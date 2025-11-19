import { useState } from 'react'

export default function Home() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('Registered successfully')
        setName('')
        setPhone('')
      } else {
        setMessage(data?.error || 'Registration failed')
      }
    } catch (err) {
      setMessage('Network error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Mock Test - Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <button className="w-full bg-blue-600 text-white p-2 rounded" type="submit">Register</button>
          </div>
        </form>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </div>
  )
}
