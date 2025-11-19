import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'

export default function TestHistory() {
  const router = useRouter()
  const [userPhone, setUserPhone] = useState<string | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // try to get userPhone from localStorage (depends on your auth implementation)
    try {
      const up = localStorage.getItem('userPhone') || localStorage.getItem('user')
      if (up) {
        // if user object stored, attempt to parse
        try {
          const parsed = JSON.parse(up)
          setUserPhone(parsed?.phone || parsed?.userPhone || String(parsed))
        } catch (e) {
          setUserPhone(String(up))
        }
      }
    } catch (e) {
      console.warn(e)
    }
  }, [])

  useEffect(() => {
    if (!userPhone) return
    setLoading(true)
    fetch(`/api/results?userPhone=${encodeURIComponent(userPhone)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok) setResults(data.results || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userPhone])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 mb-6">
          <h1 className="text-2xl font-bold">Test History & Analysis</h1>
          <p className="text-sm opacity-90">Review your past performances and track your progress</p>
        </div>

        {!userPhone && (
          <div className="bg-white p-6 rounded-lg mb-6">
            <p className="text-gray-700">You are not signed in. To view your test history, please login or enter your phone number.</p>
          </div>
        )}

        {loading && <div className="text-center py-12">Loading...</div>}

        <div className="space-y-6">
          {results.map((r) => (
            <motion.div key={r._id} className="bg-white rounded-lg p-6 shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{r.paperTitle || 'Untitled Test'}</h3>
                  <div className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-6 py-4 rounded-lg bg-blue-50 text-center">
                    <div className="text-xs text-gray-600">Score</div>
                    <div className="text-lg font-bold">{r.correctCount}/{r.total}</div>
                  </div>
                  <div className="px-6 py-4 rounded-lg bg-green-50 text-center">
                    <div className="text-xs text-gray-600">Accuracy</div>
                    <div className="text-lg font-bold">{r.percent}%</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-full text-sm" onClick={() => router.push(`/results/${r._id}`)}>
                  <Eye size={16} /> View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
