import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [exam, setExam] = useState<'JEE' | 'NEET'>('JEE')
  const [name, setName] = useState('')
  const [questionsCount, setQuestionsCount] = useState(20)
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [date, setDate] = useState('')
  const [icon, setIcon] = useState('')
  const [source, setSource] = useState('')
  const [official, setOfficial] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Manage Questions state
  const [papers, setPapers] = useState<any[]>([])
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null)
  const [subject, setSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics'>('Physics')
  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState<number>(0)
  const [qMessage, setQMessage] = useState<string | null>(null)
  const [qError, setQError] = useState<string | null>(null)

  useEffect(() => {
    // set default date to today
    const today = new Date().toISOString().slice(0, 10)
    setDate(today)
    fetchPapers()
  }, [])

  async function fetchPapers() {
    try {
      const res = await fetch('/api/papers?category=all&limit=200')
      const data = await res.json()
      if (res.ok) {
        setPapers(data.papers || [])
        if ((data.papers || []).length > 0) setSelectedPaper((data.papers || [])[0]._id)
      }
    } catch (err) {
      // ignore
    }
  }

  async function createPaper(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)

    const adminPhone = typeof window !== 'undefined' ? localStorage.getItem('userPhone') : null
    if (!adminPhone) {
      setError('Admin phone not found in localStorage. Make sure you are logged in as admin.')
      return
    }

    const body = { exam, name, questionsCount, durationMinutes, date, icon, source, official, adminPhone }

    try {
      const res = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('Paper created successfully')
        setName('')
      } else {
        setError(data?.error || 'Failed to create')
      }
    } catch (err) {
      setError('Network error')
    }
  }

  async function addQuestion(e: React.FormEvent) {
    e.preventDefault()
    setQError(null)
    setQMessage(null)

    if (!selectedPaper) {
      setQError('Select a paper first')
      return
    }

    if (!questionText || options.some((o) => !o)) {
      setQError('Question and all options are required')
      return
    }

    const adminPhone = typeof window !== 'undefined' ? localStorage.getItem('userPhone') : null
    if (!adminPhone) {
      setQError('Admin phone not found in localStorage')
      return
    }

    const body = { text: questionText, options, correctIndex, subject, adminPhone }

    try {
      const res = await fetch(`/api/papers/${selectedPaper}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (res.ok) {
        setQMessage('Question added')
        setQuestionText('')
        setOptions(['', '', '', ''])
        setCorrectIndex(0)
      } else {
        setQError(data?.error || 'Failed to add question')
      }
    } catch (err) {
      setQError('Network error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar */}
        <aside className="w-72 bg-white rounded shadow p-4">
          <div className="font-bold mb-4">Admin</div>
          <ul className="space-y-2 text-sm">
            <li className="py-2 px-2 rounded bg-green-50">Create Paper</li>
            <li className="py-2 px-2 rounded">Manage Questions</li>
            <li className="py-2 px-2 rounded">Users</li>
            <li className="py-2 px-2 rounded">Settings</li>
          </ul>
        </aside>

        {/* Main form */}
        <main className="flex-1">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-bold mb-4">Create Paper</h2>

            <form onSubmit={createPaper} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Exam</label>
                  <select value={exam} onChange={(e) => setExam(e.target.value as any)} className="mt-1 block w-full border rounded p-2">
                    <option value="JEE">JEE</option>
                    <option value="NEET">NEET</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded p-2" />
                </div>

                <div>
                  <label className="block text-sm font-medium">Questions Count</label>
                  <input type="number" value={questionsCount} onChange={(e) => setQuestionsCount(parseInt(e.target.value || '0'))} className="mt-1 block w-full border rounded p-2" />
                </div>

                <div>
                  <label className="block text-sm font-medium">Duration (mins)</label>
                  <input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(parseInt(e.target.value || '0'))} className="mt-1 block w-full border rounded p-2" />
                </div>

                <div>
                  <label className="block text-sm font-medium">Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full border rounded p-2" />
                </div>

                <div>
                  <label className="block text-sm font-medium">Icon</label>
                  <input value={icon} onChange={(e) => setIcon(e.target.value)} className="mt-1 block w-full border rounded p-2" />
                </div>

                <div>
                  <label className="block text-sm font-medium">Source</label>
                  <input value={source} onChange={(e) => setSource(e.target.value)} className="mt-1 block w-full border rounded p-2" />
                </div>

                <div className="flex items-center gap-2">
                  <input id="official" type="checkbox" checked={official} onChange={(e) => setOfficial(e.target.checked)} />
                  <label htmlFor="official" className="text-sm">Official</label>
                </div>
              </div>

              {message && <div className="text-green-600">{message}</div>}
              {error && <div className="text-red-600">{error}</div>}

              <div>
                <button className="btn-primary px-4 py-2" type="submit">Create Paper</button>
              </div>
            </form>
          </div>

          {/* Manage Questions */}
          <div className="bg-white rounded shadow p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Manage Questions</h2>

            <form onSubmit={addQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Select Paper</label>
                  <select value={selectedPaper || ''} onChange={(e) => setSelectedPaper(e.target.value)} className="mt-1 block w-full border rounded p-2">
                    {papers.map((p) => (
                      <option key={p._id} value={p._id}>{p.title} — {p.exam}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Subject</label>
                  <select value={subject} onChange={(e) => setSubject(e.target.value as any)} className="mt-1 block w-full border rounded p-2">
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium">Question</label>
                  <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="mt-1 block w-full border rounded p-2" />
                </div>

                {[0, 1, 2, 3].map((i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium">Option {i + 1}</label>
                    <input value={options[i]} onChange={(e) => setOptions((prev) => { const copy = [...prev]; copy[i] = e.target.value; return copy })} className="mt-1 block w-full border rounded p-2" />
                  </div>
                ))}

                <div className="col-span-2">
                  <label className="block text-sm font-medium">Correct Option</label>
                  <div className="flex gap-4 mt-2">
                    {[0, 1, 2, 3].map((i) => (
                      <label key={i} className="inline-flex items-center gap-2">
                        <input type="radio" name="correct" checked={correctIndex === i} onChange={() => setCorrectIndex(i)} />
                        <span>Option {i + 1}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {qMessage && <div className="text-green-600">{qMessage}</div>}
              {qError && <div className="text-red-600">{qError}</div>}

              <div>
                <button className="btn-primary px-4 py-2" type="submit">Add Question</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
