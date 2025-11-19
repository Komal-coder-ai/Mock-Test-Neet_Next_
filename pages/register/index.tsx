import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submitForm(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name || !phone) {
      setError('Name and phone are required')
      return
    }
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('OTP sent (see response for testing)')
        if (data?.otp) setMessage((m) => `${m} — OTP: ${data.otp}`)
        setStep('verify')
      } else {
        setError(data?.error || 'Registration failed')
      }
    } catch (err) {
      setError('Network error')
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!phone || !otp) {
      setError('Phone and OTP are required')
      return
    }
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      })
      const data = await res.json()
      if (res.ok) {
        // store tokens locally
        try {
          if (data?.accessToken) localStorage.setItem('accessToken', data.accessToken)
          if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)
          if (data?.role) localStorage.setItem('userRole', data.role)
          if (data?.id) localStorage.setItem('userId', data.id)
        } catch (e) {
          // ignore storage errors
        }

        // if admin go to dashboard, else to Aadhar
        if (data?.role === 'admin') {
          router.push('/dashboard')
        } else {
          router.push(`/adhar?phone=${encodeURIComponent(phone)}`)
        }
      } else {
        setError(data?.error || 'OTP verification failed')
      }
    } catch (err) {
      setError('Network error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold">Register</h2>
        <p className="muted mt-2">Create an account with phone and optional Aadhar. We'll send an OTP to verify.</p>

        {step === 'form' && (
          <form onSubmit={submitForm} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border rounded p-2" required />
            </div>
            {/* Aadhar will be collected after OTP verification on the Aadhar page */}
            {message && <p className="text-sm text-green-600">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <button className="w-full btn-primary" type="submit">Register & Send OTP</button>
            </div>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={verifyOtp} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border rounded p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium">OTP</label>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 block w-full border rounded p-2" required />
            </div>
            {message && <p className="text-sm text-green-600">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <button className="w-full btn-primary" type="submit">Verify & Continue</button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}
