import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function StoredResult() {
  const router = useRouter()
  const { id } = router.query
  const [result, setResult] = useState<any>(null)
  const [paper, setPaper] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axios.get(`/api/results/${String(id)}`)
      .then((res) => {
        if (res.data?.ok) {
          setResult(res.data.result)
          // Fetch paper questions using paperId from result
          return axios.get(`/api/papers/${res.data.result.paperId}`)
        }
      })
      .then((paperRes) => {
        if (paperRes?.data?.ok) setPaper(paperRes.data.paper)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!result || !paper) return <div className="min-h-screen flex items-center justify-center">No result found</div>

  // Subjects for analysis
  const subjects = [
    { name: 'Physics', ...result.subjectBreakdown?.Physics },
    { name: 'Chemistry', ...result.subjectBreakdown?.Chemistry },
    { name: 'Mathematics', ...result.subjectBreakdown?.Mathematics }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div className="bg-white p-6 rounded-lg shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{result.paperTitle || 'Test Result'}</h2>
              <div className="text-sm text-gray-600">{new Date(result.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-lg font-bold">{result.total}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-sm text-gray-600">Correct</div>
              <div className="text-lg font-bold">{result.correctCount}</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <div className="text-sm text-gray-600">Wrong</div>
              <div className="text-lg font-bold">{result.wrongCount}</div>
            </div>
          </div>

          {/* Score, Accuracy, Correct, Answer Statistics, Subject Chart */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center flex flex-col items-center">
              <div className="text-sm text-gray-600">Total Score</div>
              <div className="text-lg font-bold text-blue-700">{result.score}/{result.maxScore}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center flex flex-col items-center">
              <div className="text-sm text-gray-600">Accuracy</div>
              <div className="text-lg font-bold text-green-700">{result.accuracy}%</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-center flex flex-col items-center">
              <div className="text-sm text-gray-600">Correct</div>
              <div className="text-lg font-bold text-blue-700">{result.correctCount}/{result.total}</div>
            </div>
          </div>

          {/* Answer Statistics */}
          <div className="bg-white rounded-lg p-4 mb-4 flex flex-col md:flex-row justify-between items-center">
            <div className="flex-1 flex flex-col items-center">
              <div className="text-green-600 font-bold text-lg">{result.correctCount}</div>
              <div className="text-gray-600 text-sm">Correct</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="text-red-600 font-bold text-lg">{result.wrongCount}</div>
              <div className="text-gray-600 text-sm">Incorrect</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="text-blue-600 font-bold text-lg">{result.unansweredCount}</div>
              <div className="text-gray-600 text-sm">Unanswered</div>
            </div>
          </div>

          {/* Subject-wise Performance Chart */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-lg mb-2">Subject-wise Performance</h3>
            <div className="flex gap-6 items-end h-32">
              {subjects.map((sub, idx) => (
                <div key={sub.name} className="flex flex-col items-center w-1/3">
                  <div
                    className={
                      `w-16 rounded-t-lg ` +
                      (idx === 0 ? 'bg-blue-600' : idx === 1 ? 'bg-green-700' : 'bg-orange-500')
                    }
                    style={{ height: `${(sub.correct || 0) / (sub.total || 1) * 100}%` }}
                  ></div>
                  <div className="mt-2 text-sm font-semibold text-gray-700">{sub.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-4">Detailed Analysis</h3>
            <div className="space-y-3">
              {subjects.map((sub) => (
                <div key={sub.name} className="bg-gray-50 border rounded-lg">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 focus:outline-none"
                    onClick={() => setExpanded(expanded === sub.name ? null : sub.name)}
                  >
                    <span className="font-semibold text-gray-800">{sub.name}</span>
                    <span className="text-xs text-gray-600">{sub.correct || 0} / {sub.total || 0} correct</span>
                    {expanded === sub.name ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {expanded === sub.name && (
                    <div className="px-4 pb-4">
                      {paper.questions
                        .filter((q: any) => q.subject === sub.name)
                        .map((q: any, idx: number) => {
                          // Find user's answer for this question
                          const pq = (result.perQuestion || []).find((pq: any) => pq.qid === q._id)
                          const selected = pq?.selected
                          const correct = q.correctIndex
                          return (
                            <div key={q._id} className="py-4 border-b last:border-b-0">
                              <div className="mb-2 text-sm font-semibold text-gray-800">Q{idx + 1}. {q.text}</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                {(q.options || []).map((opt: string, i: number) => {
                                  const isCorrect = correct === i
                                  const isSelected = selected === i
                                  return (
                                    <div
                                      key={i}
                                      className={`p-2 rounded border flex items-center gap-2 ` +
                                        (isCorrect ? 'bg-green-100 border-green-500' : isSelected ? 'bg-red-100 border-red-500' : 'bg-white')}
                                    >
                                      <span className={`font-bold text-lg ${isCorrect ? 'text-green-700' : isSelected ? 'text-red-700' : 'text-gray-700'}`}>{String.fromCharCode(65 + i)}.</span>
                                      <span className="flex-1">{opt}</span>
                                      {isCorrect && <span className="ml-2 text-green-700 font-bold">Correct</span>}
                                      {isSelected && !isCorrect && <span className="ml-2 text-red-700 font-bold">Selected</span>}
                                    </div>
                                  )
                                })}
                              </div>
                              <div className="flex items-center gap-2">
                                {selected === correct ? <span className="text-green-600 font-semibold">Correct</span> : selected !== undefined && selected !== null ? <span className="text-red-600 font-semibold">Incorrect</span> : <span className="text-gray-400 font-semibold">Unanswered</span>}
                                <span className="text-xs text-gray-500">Selected: {typeof selected === 'number' ? String.fromCharCode(65 + selected) : '-'}</span>
                                <span className="text-xs text-gray-500">Correct: {typeof correct === 'number' ? String.fromCharCode(65 + correct) : '-'}</span>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg border" onClick={() => router.push('/test/history')}>Back to History</button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white" onClick={() => router.push('/')}>Home</button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
