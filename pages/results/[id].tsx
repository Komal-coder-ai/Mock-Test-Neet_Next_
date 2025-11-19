import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function StoredResult() {
  const router = useRouter()
  const { id } = router.query
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return 
    setLoading(true)
    fetch(`/api/results/${String(id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok) setResult(data.result)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!result) return <div className="min-h-screen flex items-center justify-center">No result found</div>

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

          <div className="space-y-4">
            {(result.perQuestion || []).map((pq: any, idx: number) => {
              const selected = pq.selected
              const correct = pq.correct
              const isCorrect = pq.isCorrect
              return (
                <div key={pq.qid} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Question {pq.index + 1} • {pq.subject}</div>
                      {/* question text not stored in result in full; you may want to store it on save for faster retrieval */}
                    </div>
                    <div className="text-right">
                      {isCorrect ? <div className="text-green-600 flex items-center gap-2"><CheckCircle2 />Correct</div> : <div className="text-red-600 flex items-center gap-2"><XCircle />Incorrect</div>}
                    </div>
                  </div>
                </div>
              )
            })}
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
