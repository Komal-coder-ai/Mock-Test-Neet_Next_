import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type Paper = {
  _id: string
  title: string
  durationMinutes: number
  totalQuestions: number
  date?: string
}

export default function TestDetails() {
  const router = useRouter()
  const { id, phone } = router.query
  const [paper, setPaper] = useState<Paper | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/papers/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok) setPaper(data.paper)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{paper?.title || 'Test Details'}</h2>
              <div className="muted text-sm mt-1">{paper ? `${paper.durationMinutes} mins • ${paper.totalQuestions} questions` : ''}</div>
            </div>
            <div className="text-right">
              <div className="text-sm muted">Status</div>
              <div className="font-semibold text-green-600">Ready</div>
            </div>
          </div>

          <hr className="my-6" />

          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 border rounded">
              <div className="font-semibold">Important Notice</div>
              <div className="mt-2 muted text-sm">Please make sure you have a stable internet connection and are in a quiet environment before starting the test.</div>
            </div>

            <div className="p-4 border rounded">
              <div className="font-semibold">General Instructions</div>
              <ol className="list-decimal list-inside mt-2 text-sm muted space-y-1">
                <li>Total duration: {paper?.durationMinutes ?? '—'} minutes</li>
                <li>Each correct answer: +4 marks</li>
                <li>Incorrect answer: -1 mark</li>
                <li>Unanswered: 0 marks</li>
                <li>Use the navigation panel to move between questions</li>
              </ol>
            </div>

            <div className="p-4 border rounded">
              <div className="font-semibold">Marking Scheme</div>
              <div className="mt-3 flex gap-3">
                <div className="flex-1 p-3 bg-green-50 border rounded text-green-700">Correct Answer: +4 marks</div>
                <div className="flex-1 p-3 bg-red-50 border rounded text-red-600">Wrong Answer: -1 mark</div>
                <div className="flex-1 p-3 bg-gray-50 border rounded text-gray-600">Not Attempted: 0 marks</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button className="px-4 py-2 border rounded" onClick={() => router.back()}>Go Back</button>
            <button
              className="px-4 py-2 bg-brand-gradient text-white rounded"
              onClick={() => router.push(`/test/${id}/begin`)}
            >
              Start Test Now
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

