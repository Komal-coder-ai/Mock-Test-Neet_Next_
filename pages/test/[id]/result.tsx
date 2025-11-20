import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, BarChartHorizontal, Info } from 'lucide-react'

export default function ResultPage() {
  const router = useRouter()
  const { id } = router.query
  const [submission, setSubmission] = useState<any>(null)
  // For debugging
  // console.log(submission, "submission");

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

  // Use subjectBreakdown from result
  const subjects = [
    {
      name: 'Physics',
      correct: result.subjectBreakdown?.Physics?.correct || 0,
      total: result.subjectBreakdown?.Physics?.total || 0
    },
    {
      name: 'Chemistry',
      correct: result.subjectBreakdown?.Chemistry?.correct || 0,
      total: result.subjectBreakdown?.Chemistry?.total || 0
    },
    {
      name: 'Mathematics',
      correct: result.subjectBreakdown?.Mathematics?.correct || 0,
      total: result.subjectBreakdown?.Mathematics?.total || 0
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-2 md:px-0">
        {/* Top summary */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Info size={20} className="text-yellow-600" />
            </div>
            <span className="font-semibold text-lg text-gray-900">Test Completed!</span>
          </div>
          <p className="text-sm text-gray-600">Your comprehensive performance summary</p>
        </div>

        {/* Score and accuracy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <BarChartHorizontal size={24} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Total Score</div>
              <div className="font-bold text-lg">{result.correctCount}/{result.total}</div>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded ml-1">{result.percent}%</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={24} className="text-green-600" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Accuracy</div>
              <div className="font-bold text-lg">{result.accuracy || result.percent}%</div>
            </div>
          </div>
        </div>

        {/* Subject-wise Performance Bar Chart */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="font-semibold text-gray-900 mb-2">Subject-wise Performance</div>
          <div className="w-full h-48 flex items-end gap-6">
            {subjects.map((sub, idx) => (
              <div key={sub.name} className="flex-1 flex flex-col items-center justify-end">
                <div
                  className={`w-16 md:w-20 rounded-t-lg ${sub.total ? 'bg-orange-400' : 'bg-gray-200'} transition-all`}
                  style={{ height: `${sub.correct * 40}px` }}
                ></div>
                <span className="mt-2 text-xs text-gray-700">{sub.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Subject Analysis */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="font-semibold text-gray-900 mb-2">Detailed Subject Analysis</div>
          <div className="space-y-3">
            {subjects.map((sub, idx) => (
              <div key={sub.name} className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                <span className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                <span className="font-semibold text-gray-700">{sub.name}</span>
                <span className="ml-auto text-xs text-gray-600">{sub.correct} / {sub.total} correct</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <button
            className="w-full md:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 shadow"
            onClick={() => router.push(`/test/${String(id)}/review`)}
          >
            Review Answers
            <ArrowRight size={18} />
          </button>
            <button
              className="w-full md:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold flex items-center justify-center gap-2 shadow"
              onClick={() => {
                localStorage.removeItem(`lastSubmission_${String(id)}`);
                router.push(`/test/${String(id)}`);
              }}
            >
              Try Again
            </button>
        </div>
      </div>
    </div>
  )
}