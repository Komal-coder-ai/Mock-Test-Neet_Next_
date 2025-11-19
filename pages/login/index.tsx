import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [aadhar, setAadhar] = useState('')
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
        body: JSON.stringify({ phone, aadhar })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('OTP sent (for testing it is returned in response)')
        // For development we show the OTP in the message
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
        router.push('/dashboard')
      } else {
        setError(data?.error || 'OTP verification failed')
      }
    } catch (err) {
      setError('Network error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl p-6 bg-white rounded shadow grid md:grid-cols-2 gap-6"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="muted mt-4">Login with your phone and receive a one-time password. No password required.</p>
          <p className="mt-4">Don't have an account? <Link href="/register" className="text-accent font-medium">Register here</Link></p>
        </div>

        <div className="p-6">
          {step === 'request' && (
            <form onSubmit={requestOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Aadhar (optional)</label>
                <input value={aadhar} onChange={(e) => setAadhar(e.target.value)} className="mt-1 block w-full border rounded p-2" />
              </div>
              {message && <p className="text-sm text-green-600">{message}</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <button className="w-full btn-primary" type="submit">Send OTP</button>
              </div>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">OTP</label>
                <input value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1 block w-full border rounded p-2" required />
              </div>
              {message && <p className="text-sm text-green-600">{message}</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <button className="flex-1 btn-primary" type="submit">Verify OTP</button>
                <button type="button" className="px-4 py-2 border rounded" onClick={() => setStep('request')}>Back</button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
