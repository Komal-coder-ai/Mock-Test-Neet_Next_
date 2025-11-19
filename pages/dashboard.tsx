import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type PaperItem = {
  _id: string
  title: string
  durationMinutes: number
  totalQuestions: number
  date?: string
  createdAt?: string
}

export default function Dashboard() {
  const { query } = useRouter()
  const phone = typeof query.phone === 'string' ? query.phone : ''
  const [user, setUser] = useState<any | null>(null)

  // papers
  const [category, setCategory] = useState<'JEE' | 'NEET'>('JEE')
  const [papers, setPapers] = useState<PaperItem[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    if (!phone) return
    fetch(`/api/user?phone=${encodeURIComponent(phone)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok) setUser(data.user)
      })
  }, [phone])

  useEffect(() => {
    fetchPapers()
    // reset page when category changes
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  useEffect(() => {
    fetchPapers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  async function fetchPapers() {
    setLoading(true)
    try {
      const res = await fetch(`/api/papers?category=${category}&page=${page}&limit=${limit}`)
      const data = await res.json()
      if (data?.ok) {
        setPapers(data.papers)
        setTotal(data.total)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function createPaper(e: React.FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement & { title: { value: string }; duration: { value: string }; total: { value: string }; date: { value: string } }
    const title = form.title.value.trim()
    const durationMinutes = parseInt(form.duration.value || '0', 10)
    const totalQuestions = parseInt(form.total.value || '0', 10)
    const date = form.date.value || undefined
    if (!title || !durationMinutes || !totalQuestions) return
    try {
      const res = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, durationMinutes, totalQuestions, date })
      })
      const data = await res.json()
      if (res.ok) {
        // refresh list
        setShowCreate(false)
        fetchPapers()
      } else {
        alert(data?.error || 'Failed to create')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-accent flex items-center justify-center text-white font-bold">MT</div>
            <div>
              <div className="font-bold">MockTest</div>
              <div className="text-xs muted">JEE & NEET Prep</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a className="text-sm muted">Test History</a>
            <a className="text-sm muted">Profile</a>
            <a className="text-sm muted">Terms & Conditions</a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Available Question Papers</h1>
          <div className="flex items-center gap-3">
            <div className="rounded-full border px-3 py-1">Filter</div>
            <button className="btn-primary" onClick={() => setShowCreate((s) => !s)}>Create Paper</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-3">
          <button className={`px-4 py-2 rounded ${category === 'JEE' ? 'bg-accent text-white' : 'bg-white border'}`} onClick={() => setCategory('JEE')}>JEE</button>
          <button className={`px-4 py-2 rounded ${category === 'NEET' ? 'bg-accent text-white' : 'bg-white border'}`} onClick={() => setCategory('NEET')}>NEET</button>
        </div>

        {/* Create form */}
        {showCreate && (
          <form onSubmit={createPaper} className="mt-6 p-4 bg-white rounded shadow space-y-3">
            <div>
              <label className="block text-sm font-medium">Paper Name</label>
              <input name="title" className="mt-1 block w-full border rounded p-2" required />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium">Time (mins)</label>
                <input name="duration" type="number" className="mt-1 block w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Total Questions</label>
                <input name="total" type="number" className="mt-1 block w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Date</label>
                <input name="date" type="date" className="mt-1 block w-full border rounded p-2" />
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary px-4 py-2" type="submit">Create</button>
              <button type="button" className="px-4 py-2 border rounded" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* List */}
        <div className="mt-6 space-y-4">
          {loading && <div className="p-6 bg-white rounded text-center">Loading...</div>}
          {!loading && papers.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded shadow-sm flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="mt-1 muted text-sm">⏱ {p.durationMinutes} mins • {p.totalQuestions} Questions • {p.date ? new Date(p.date).toLocaleDateString() : 'Latest'}</div>
              </div>
              <div>
                <button className="px-4 py-2 bg-white border rounded text-accent">Start Test</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="muted">Showing page {page} of {totalPages}</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
            <button className="px-3 py-1 border rounded" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</button>
          </div>
        </div>
      </main>
    </div>
  )
}
