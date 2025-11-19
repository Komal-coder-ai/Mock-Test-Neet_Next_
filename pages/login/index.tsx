import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function requestOtp(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setError(null)
    setMessage(null)
    if (!phone) {
      setError('Phone is required')
      return
    }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('OTP sent (for testing it is returned in response)')
        if (data?.otp) setMessage((m) => `${m} — OTP: ${data.otp}`)
        setStep('verify')
      } else {
        setError(data?.error || 'Failed to send OTP')
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
        } catch (e) {}

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
    <div className="min-h-screen md:flex">
      {/* Left hero cover */}
      <motion.div className="md:w-1/2 hero-left hero-overlay p-10 items-center justify-center hidden md:flex">
        <div className="max-w-md">
          <h1 className="hero-title font-extrabold">Prepare. Practice. Perform.</h1>
          <p className="mt-4 muted">Real-like mock tests for NEET & JEE with analytics and targeted revision. Start your focused journey today.</p>
          <div className="mt-6">
            <Link href="/register" className="px-4 py-2 bg-white text-black rounded font-medium">Create account</Link>
          </div>
        </div>
      </motion.div>

      {/* Right form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md form-card p-8">
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="muted mt-2">Enter your phone to receive a one-time password.</p>

          {step === 'request' && (
            <form onSubmit={requestOtp} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border rounded p-3" required />
              </div>
              {/* removed inline Aadhar input - Aadhar is collected after OTP verification */}
              {message && <p className="text-sm text-green-600">{message}</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <button className="w-full btn-primary py-3" type="submit">Send OTP</button>
              </div>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={verifyOtp} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium">OTP</label>
                <input value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 block w-full border rounded p-3" required />
              </div>
              {message && <p className="text-sm text-green-600">{message}</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button className="flex-1 btn-primary py-3" type="submit">Verify OTP</button>
                <button type="button" className="px-4 py-3 border rounded" onClick={() => setStep('request')}>Back</button>
              </div>
            </form>
          )}

          <p className="mt-4 text-sm muted">Don't have an account? <Link href="/register" className="text-accent font-medium">Register</Link></p>
        </motion.div>
      </div>
    </div>
  )
}
