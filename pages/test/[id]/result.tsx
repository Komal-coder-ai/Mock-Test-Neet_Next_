import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react'

export default function ResultPage() {
  const router = useRouter()
  const { id } = router.query
  const [submission, setSubmission] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    try {
      const raw = localStorage.getItem(`lastSubmission_${String(id)}`)
      if (raw) setSubmission(JSON.parse(raw))
    } catch (e) {
      console.warn(e)
    }
  }, [id])

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow">
          <h3 className="text-lg font-semibold">No submission found</h3>
          <p className="text-sm text-gray-600 mt-2">We couldn't find a recent submission for this test. You can go back to take the test.</p>
          <div className="mt-4">
            <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => router.push(`/test/${String(id)}`)}>Go to Test</button>
          </div>
        </div>
      </div>
    )
  }

  const { result } = submission

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div className="max-w-3xl w-full bg-white rounded-2xl p-8 shadow-lg" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Test Submitted</h2>
            <p className="text-sm text-gray-600">Your result summary is below. You can review answers after viewing your score.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold">{result.total}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">Correct</div>
            <div className="text-2xl font-bold text-green-700">{result.correctCount}</div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-gray-600">Wrong</div>
            <div className="text-2xl font-bold text-red-600">{result.wrongCount}</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Answered</div>
              <div className="text-lg font-bold">{result.answeredCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-lg font-bold">{result.percent}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Submitted At</div>
              <div className="text-lg font-medium">{new Date(submission.timestamp).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-2" onClick={() => router.push(`/test/${String(id)}/review`)}>
            <ArrowRight size={16} />
            Review Answers
          </button>
          <button className="px-4 py-2 rounded-lg border" onClick={() => router.push('/')}>Back to Home</button>
        </div>
      </motion.div>
    </div>
  )
}
