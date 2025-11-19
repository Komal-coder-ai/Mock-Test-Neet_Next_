import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'

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
  const router = useRouter()
  const { id } = router.query
  const [paper, setPaper] = useState<Paper | null>(null)
  const [loading, setLoading] = useState(false)

  // test state
  const [currentIndex, setCurrentIndex] = useState(0) // global index in paper.questions
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [marked, setMarked] = useState<Record<number, boolean>>({})
  const [activeSubject, setActiveSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics' | 'All'>('All')

  // timer
  const [remaining, setRemaining] = useState<number>(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/papers/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok) {
          setPaper(data.paper)
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

  if (loading) return <div className="p-8">Loading...</div>

  const questions = paper?.questions || []
  const total = questions.length || paper?.totalQuestions || 0

  const subjects: Array<'Physics' | 'Chemistry' | 'Mathematics' | 'All'> = ['All', 'Physics', 'Chemistry', 'Mathematics']

  function filteredIndicesForSubject(subj: typeof activeSubject) {
    if (subj === 'All') return questions.map((_, i) => i)
    return questions.map((q, i) => ({ q, i })).filter((x) => (x.q.subject || '').toLowerCase() === subj.toLowerCase()).map((x) => x.i)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded shadow p-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold">{paper?.title || 'Test'}</h1>
              <div className="text-sm text-gray-600">Question {Object.keys(selectedAnswers).length > 0 ? '' : ''}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="h-2 bg-blue-500" style={{ width: `${(answeredCount / Math.max(1, total)) * 100}%` }} />
              </div>
              <div className="text-sm text-gray-600">Time Remaining</div>
              <div className="font-mono font-semibold bg-white border rounded px-3 py-1">{formatTime(remaining)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            <div className="flex gap-3 mb-4">
              {subjects.map((s) => {
                const list = filteredIndicesForSubject(s === 'All' ? 'All' : s as any)
                const answeredInSubject = list.filter((i) => selectedAnswers[i] !== undefined).length
                return (
                  <button key={s} onClick={() => { setActiveSubject(s); const idx = list[0]; if (idx !== undefined) setCurrentIndex(idx) }} className={`px-4 py-2 rounded-full ${activeSubject === s ? 'bg-blue-500 text-white' : 'bg-white border'}`}>
                    <div className="text-sm font-semibold">{s}</div>
                    <div className="text-xs">{answeredInSubject}/{list.length}</div>
                  </button>
                )
              })}
            </div>

            <div className="bg-white rounded shadow p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{currentQ?.subject || 'General'}</span>
                  <div className="text-sm text-gray-600">Question {currentIndex + 1} / {total}</div>
                </div>
                <div className="text-sm text-gray-600">Marked for review: {marked[currentIndex] ? 'Yes' : 'No'}</div>
              </div>

              <div className="mb-4">
                <div className="text-lg font-semibold">{currentQ?.text || 'No question available'}</div>
              </div>

              <div className="space-y-3">
                {(currentQ?.options || []).map((opt, i) => {
                  const isSelected = selectedAnswers[currentIndex] === i
                  return (
                    <button key={i} onClick={() => selectOption(currentIndex, i)} className={`w-full text-left p-4 rounded border ${isSelected ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold">{String.fromCharCode(65 + i)}</div>
                        <div>{opt}</div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={!!marked[currentIndex]} onChange={() => toggleMark(currentIndex)} />
                    <span className="text-sm">Mark for Review</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={prevQuestion} className="px-4 py-2 border rounded">Previous</button>
                  <button onClick={nextQuestion} className="px-6 py-2 bg-blue-600 text-white rounded">Next</button>
                </div>
              </div>
            </div>
          </div>

          <aside className="col-span-3">
            <div className="bg-white rounded shadow p-4 sticky top-6">
              <div className="font-semibold mb-3">Question Palette</div>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, i) => {
                  const answered = selectedAnswers[i] !== undefined
                  const isMarked = !!marked[i]
                  const isCurrent = i === currentIndex
                  let cls = 'bg-gray-100'
                  if (isCurrent) cls = 'bg-blue-500 text-white'
                  else if (isMarked) cls = 'bg-yellow-300'
                  else if (answered) cls = 'bg-green-100'
                  return (
                    <button key={i} onClick={() => goToQuestion(i)} className={`w-10 h-10 rounded-full flex items-center justify-center ${cls} border`}>
                      {i + 1}
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Answered</div>
                  <div className="text-sm font-semibold">{Object.keys(selectedAnswers).length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Not Answered</div>
                  <div className="text-sm font-semibold">{total - Object.keys(selectedAnswers).length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Marked</div>
                  <div className="text-sm font-semibold">{Object.keys(marked).filter((k) => marked[Number(k)]).length}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
