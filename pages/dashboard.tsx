import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const { query } = useRouter()
  const phone = typeof query.phone === 'string' ? query.phone : ''
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    if (!phone) return
    fetch(`/api/user?phone=${encodeURIComponent(phone)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok) setUser(data.user)
      })
  }, [phone])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-3xl p-8 bg-white rounded shadow text-left">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {!user && <p className="mt-4 muted">Loading user...</p>}
        {user && (
          <div className="mt-4 space-y-2">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Aadhar:</strong> {user.aadhar || 'Not provided'}</p>
            <p><strong>Verified:</strong> {user.verified ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
