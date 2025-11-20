import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Bookmark,
  AlertCircle,
  BarChart3,
  Timer,
  FileText
} from 'lucide-react'

type Question = {
  text: string
  options: string[]
  correctIndex: number
  subject?: string
}

type Paper = {
  _id: string
  title: string
  durationMinutes: number
  totalQuestions: number
  questions?: Question[]
}

export default function TestRunner() {
    const [remaining, setRemaining] = useState<number>(0)
    useEffect(() => {
      if (remaining === 0 && !submitting && !showSubmitModal) {
        (async () => {
          setSubmitting(true);
          try {
            const answersMap: Record<string, number> = {};
            for (let i = 0; i < questions.length; i++) {
              const q = questions[i] as any;
              const qid = q && (q as any)._id ? String((q as any)._id) : String(i);
              if (selectedAnswers[i] !== undefined) answersMap[qid] = selectedAnswers[i];
            }
            let userPhone: string | null = null;
            try {
              if (phone && typeof phone === 'string') userPhone = phone;
              else {
                const stored = localStorage.getItem('userPhone') || localStorage.getItem('user');
                if (stored) {
                  try { const parsed = JSON.parse(stored); userPhone = parsed?.phone || parsed?.userPhone || String(parsed) } catch { userPhone = String(stored) }
                }
              }
            } catch (e) {
              console.warn('Error reading user phone from storage', e);
            }
            const resp = await fetch(`/api/papers/${String(id)}/submit`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                answers: answersMap,
                answersByIndex: selectedAnswers,
                save: !!userPhone,
                userPhone: userPhone || undefined,
                paperTitle: paper?.title || undefined
              })
            });
            const data = await resp.json();
            if (resp.ok && data?.ok) {
              try {
                const payload = { result: data.result, answers: answersMap, paperId: String(id), timestamp: Date.now() };
                localStorage.setItem(`lastSubmission_${String(id)}`, JSON.stringify(payload));
              } catch (e) {
                console.warn('Failed to save submission locally', e);
              }
              router.push(`/test/${String(id)}/result`);
            } else {
              alert(data?.error || 'Failed to submit');
            }
          } catch (e) {
            console.error(e);
            alert('Network error');
          } finally {
            setSubmitting(false);
          }
        })();
      }
    }, [remaining]);
  const router = useRouter()
  const { id, phone } = router.query
  const [paper, setPaper] = useState<Paper | null>(null)
  const [loading, setLoading] = useState(false)

  // test state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [marked, setMarked] = useState<Record<number, boolean>>({})
  const [activeSubject, setActiveSubject] = useState<string>('All')
  const [subjectCounts, setSubjectCounts] = useState<Record<string, number>>({})

  // timer
 
  const timerRef = useRef<number | null>(null)

  // submit modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/papers/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok) {
          setPaper(data.paper)
          setSubjectCounts(data.subjectCounts || {})
          const mins = data.paper?.durationMinutes || 30
          setRemaining(mins * 60)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (remaining <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }
    timerRef.current = window.setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000)
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [remaining])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <FileText size={48} className="text-blue-600" />
          </motion.div>
          <p className="text-gray-600 font-medium">Loading test paper...</p>
        </motion.div>
      </div>
    )
  }

  const questions = paper?.questions || []
  const total = questions.length || paper?.totalQuestions || 0

  // derive subjects from API-provided subjectCounts (keep 'All' first)
  // include Unspecified if present so user can filter those questions too
  const subjects: string[] = [
    'All',
    ...Object.keys(subjectCounts || {})
      .filter((k) => k && String(k).toLowerCase() !== '')
      .sort((a, b) => {
        // keep Unspecified at the end
        if (String(a).toLowerCase() === 'unspecified') return 1
        if (String(b).toLowerCase() === 'unspecified') return -1
        return String(a).localeCompare(String(b))
      })
  ]

  function filteredIndicesForSubject(subj: string) {
    if (!subj || subj.toLowerCase() === 'all') return questions.map((_, i) => i)
    const subjLower = subj.toLowerCase()
    return questions
      .map((q, i) => ({ q, i }))
      .filter((x) => String(x.q.subject || '').toLowerCase() === subjLower)
      .map((x) => x.i)
  }

  const answeredCount = Object.keys(selectedAnswers).length

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  function goToQuestion(idx: number) {
    setCurrentIndex(idx)
  }

  function selectOption(qIdx: number, optIdx: number) {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
  }

  function clearResponse(qIdx: number) {
    setSelectedAnswers((prev) => {
      const copy = { ...prev }
      if (copy[qIdx] !== undefined) delete copy[qIdx]
      return copy
    })
  }

  function toggleMark(qIdx: number) {
    setMarked((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }))
  }

  function nextQuestion() {
    const list = filteredIndicesForSubject(activeSubject)
    if (list.length === 0) return
    const pos = list.indexOf(currentIndex)
    const next = pos >= 0 && pos < list.length - 1 ? list[pos + 1] : list[0]
    setCurrentIndex(next)
  }

  function prevQuestion() {
    const list = filteredIndicesForSubject(activeSubject)
    if (list.length === 0) return
    const pos = list.indexOf(currentIndex)
    const prev = pos > 0 ? list[pos - 1] : list[list.length - 1]
    setCurrentIndex(prev)
  }

  const currentQ = questions[currentIndex]
  const isLowTime = remaining < 300 // less than 5 minutes

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Bar */}
      <motion.div 
        className="bg-white border-b border-gray-200 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Title & Progress */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{paper?.title || 'Test'}</h1>
                  <p className="text-sm text-gray-600">{answeredCount} of {total} answered</p>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center gap-3">
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${(answeredCount / Math.max(1, total)) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{Math.round((answeredCount / Math.max(1, total)) * 100)}%</span>
              </div>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border-2 ${
              isLowTime ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
            }`}>
              <Timer size={20} className={isLowTime ? 'text-red-600' : 'text-gray-600'} />
              <div>
                <p className="text-xs text-gray-600">Time Remaining</p>
                <p className={`text-lg font-mono font-bold ${isLowTime ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(remaining)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            {/* Subject Tabs */}
            <motion.div 
              className="flex gap-3 mb-6 overflow-x-auto pb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {subjects.map((s) => {
                const list = filteredIndicesForSubject(s === 'All' ? 'All' : s as any)
                const answeredInSubject = list.filter((i) => selectedAnswers[i] !== undefined).length
                return (
                  <motion.button
                    key={s}
                    onClick={() => {
                      setActiveSubject(s)
                      const idx = list[0]
                      if (idx !== undefined) setCurrentIndex(idx)
                    }}
                    className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold transition-all ${
                      activeSubject === s
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-sm font-semibold">{s}</div>
                    <div className="text-xs opacity-90">{answeredInSubject}/{list.length}</div>
                  </motion.button>
                )
              })}
            </motion.div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Question Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                      {currentQ?.subject || 'General'}
                    </span>
                    <span className="text-gray-600 text-sm font-medium">
                      Question {currentIndex + 1} of {total}
                    </span>
                  </div>
                  
                  {marked[currentIndex] && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg">
                      <Bookmark size={16} />
                      <span className="text-sm font-medium">Marked</span>
                    </div>
                  )}
                </div>

                {/* Question Text */}
                <div className="mb-8">
                  <p className="text-lg font-medium text-gray-900 leading-relaxed">
                    {currentQ?.text || 'No question available'}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {(currentQ?.options || []).map((opt, i) => {
                    const isSelected = selectedAnswers[currentIndex] === i
                    return (
                      <motion.button
                        key={i}
                        onClick={() => selectOption(currentIndex, i)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="text-gray-900">{opt}</span>
                          {isSelected && (
                            <CheckCircle2 size={20} className="text-blue-600 ml-auto" />
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Bottom Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <motion.label 
                    className="flex items-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <input
                      type="checkbox"
                      checked={!!marked[currentIndex]}
                      onChange={() => toggleMark(currentIndex)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Bookmark size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Mark for Review</span>
                  </motion.label>

                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={prevQuestion}
                      className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </motion.button>
                    <motion.button
                      onClick={() => clearResponse(currentIndex)}
                      disabled={!selectedAnswers[currentIndex] && selectedAnswers[currentIndex] !== 0}
                      title="Clear selected response"
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors ${
                        !selectedAnswers[currentIndex] && selectedAnswers[currentIndex] !== 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Clear
                    </motion.button>

                    <motion.button
                      onClick={nextQuestion}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Next
                      <ChevronRight size={18} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24 shadow-sm">
              {/* Stats */}
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={20} className="text-gray-600" />
                <h3 className="font-semibold text-gray-900">Question Overview</h3>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle2 size={20} className="text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-green-600">{answeredCount}</p>
                  <p className="text-xs text-green-700">Answered</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Circle size={20} className="text-gray-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-600">{total - answeredCount}</p>
                  <p className="text-xs text-gray-700">Pending</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Bookmark size={20} className="text-yellow-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-yellow-600">
                    {Object.keys(marked).filter((k) => marked[Number(k)]).length}
                  </p>
                  <p className="text-xs text-yellow-700">Marked</p>
                </div>
              </div>

              {/* Question Palette */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Question Palette</h4>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, i) => {
                    const answered = selectedAnswers[i] !== undefined
                    const isMarked = !!marked[i]
                    const isCurrent = i === currentIndex
                    
                    let cls = 'bg-white border-gray-300 text-gray-700'
                    if (isCurrent) cls = 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-600 text-white shadow-md'
                    else if (isMarked) cls = 'bg-yellow-100 border-yellow-400 text-yellow-700'
                    else if (answered) cls = 'bg-green-100 border-green-400 text-green-700'
                    
                    return (
                      <motion.button
                        key={i}
                        onClick={() => goToQuestion(i)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold border-2 transition-all ${cls}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {i + 1}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-600 to-indigo-600"></div>
                  <span className="text-gray-600">Current</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-400"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded bg-yellow-100 border-2 border-yellow-400"></div>
                  <span className="text-gray-600">Marked</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded bg-white border-2 border-gray-300"></div>
                  <span className="text-gray-600">Not Answered</span>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSubmitModal(true)}
              >
                <CheckCircle2 size={18} />
                Submit Test
              </motion.button>

              {/* Submit Confirmation Modal */}
              <AnimatePresence>
                {showSubmitModal && (
                  <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowSubmitModal(false)} />
                    <motion.div className="bg-white rounded-2xl p-8 w-[720px] max-w-full z-10 shadow-2xl" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }}>
                      <h3 className="text-2xl font-bold mb-6">Submit Test?</h3>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-lg bg-green-50 flex flex-col items-start">
                          <div className="text-3xl font-bold text-green-600">{answeredCount}</div>
                          <div className="text-sm text-green-700">Answered</div>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 flex flex-col items-start">
                          <div className="text-3xl font-bold text-gray-700">{total - answeredCount}</div>
                          <div className="text-sm text-gray-700">Not Answered</div>
                        </div>
                        <div className="p-4 rounded-lg bg-yellow-50 flex flex-col items-start">
                          <div className="text-3xl font-bold text-yellow-700">{Object.keys(marked).filter((k) => marked[Number(k)]).length}</div>
                          <div className="text-sm text-yellow-700">Marked</div>
                        </div>
                        <div className="p-4 rounded-lg bg-blue-50 flex flex-col items-start">
                          <div className="text-3xl font-bold text-blue-700">{Math.round((answeredCount / Math.max(1, total)) * 100)}%</div>
                          <div className="text-sm text-blue-700">Progress</div>
                        </div>
                      </div>

                      <p className="text-center text-gray-600 mb-6">Are you sure you want to submit the test? This action cannot be undone.</p>

                      <div className="flex items-center justify-center gap-4">
                        <button className="px-6 py-2 rounded-full border" onClick={() => setShowSubmitModal(false)}>Continue Test</button>
                        <button disabled={submitting} className="px-6 py-2 rounded-full bg-blue-600 text-white" onClick={async () => {
                          if (submitting) return
                          setSubmitting(true)
                          try {
                            const answersMap: Record<string, number> = {}
                            for (let i = 0; i < questions.length; i++) {
                              const q = questions[i] as any
                              const qid = q && (q as any)._id ? String((q as any)._id) : String(i)
                              if (selectedAnswers[i] !== undefined) answersMap[qid] = selectedAnswers[i]
                            }
                            // include both answers keyed by qid and by index (fallback)
                            // determine userPhone: prefer query param, fallback to localStorage
                            let userPhone: string | null = null
                            try {
                              if (phone && typeof phone === 'string') userPhone = phone
                              else {
                                const stored = localStorage.getItem('userPhone') || localStorage.getItem('user')
                                if (stored) {
                                  try { const parsed = JSON.parse(stored); userPhone = parsed?.phone || parsed?.userPhone || String(parsed) } catch { userPhone = String(stored) }
                                }
                              }
                            } catch (e) {
                              console.warn('Error reading user phone from storage', e)
                            }

                            const resp = await fetch(`/api/papers/${String(id)}/submit`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                answers: answersMap,
                                answersByIndex: selectedAnswers,
                                save: !!userPhone,
                                userPhone: userPhone || undefined,
                                paperTitle: paper?.title || undefined
                              })
                            })
                            const data = await resp.json()
                            if (resp.ok && data?.ok) {
                              try {
                                const payload = { result: data.result, answers: answersMap, paperId: String(id), timestamp: Date.now() }
                                localStorage.setItem(`lastSubmission_${String(id)}`, JSON.stringify(payload))
                              } catch (e) {
                                console.warn('Failed to save submission locally', e)
                              }
                              setShowSubmitModal(false)
                              router.push(`/test/${String(id)}/result`)
                            } else {
                              alert(data?.error || 'Failed to submit')
                            }
                          } catch (e) {
                            console.error(e)
                            alert('Network error')
                          } finally {
                            setSubmitting(false)
                          }
                        }}>{submitting ? 'Submitting...' : 'Submit Test'}</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}