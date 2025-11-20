import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'

export default function TestHistory() {
  const router = useRouter()
  const [userPhone, setUserPhone] = useState<string | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // try to get userPhone from query param first, then localStorage
    const q = router.query?.phone
    if (q && typeof q === 'string') {
      setUserPhone(q)
      return
    }
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

  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const scroll = (dir = 1) => {
    if (!scrollerRef.current) return
    scrollerRef.current.scrollBy({ left: dir * 360, behavior: 'smooth' })
  }

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

        {/* Horizontal scroller */}
        <div className="relative mb-6">
          <button
            aria-label="Scroll left"
            onClick={() => scroll(-1)}
            className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-md"
          >
            ‹
          </button>

          <div
            ref={scrollerRef}
            className="overflow-x-auto no-scrollbar flex gap-4 py-2 px-3 md:px-6 scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {results.length === 0 && !loading && (
              <div className="text-gray-600 px-3">No results yet.</div>
            )}

            {results.map((r) => (
              <div key={r._id} className="flex-shrink-0 w-72 md:w-80">
                <motion.div
                  className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow h-full flex flex-col justify-between"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div>
                    <h4 className="font-semibold text-sm truncate">{r.paperTitle || 'Untitled Test'}</h4>
                    <div className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString()}</div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500">Score</div>
                        <div className="text-lg font-bold">{r.correctCount}/{r.total}</div>
                      </div>

                      <div className="flex-1">
                        <div className="text-xs text-gray-500">Accuracy</div>
                        <div className="text-lg font-bold">{r.percent}%</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-blue-600 rounded-full"
                          style={{ width: `${Math.min(100, Number(r.percent) || 0)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => router.push(`/results/${r._id}`)}
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border rounded-full text-sm"
                    >
                      <Eye size={16} /> View
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          <button
            aria-label="Scroll right"
            onClick={() => scroll(1)}
            className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-md"
          >
            ›
          </button>
        </div>

        {/* Vertical list fallback (kept for accessibility/responsive) */}
        <div className="space-y-6">
          {results.map((r) => (
            <motion.div key={`list-${r._id}`} className="bg-white rounded-lg p-6 shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
