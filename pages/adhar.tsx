import { useState } from 'react'
import { useRouter } from 'next/router'

export default function AadharPage() {
  const router = useRouter()
  const [aadhar, setAadhar] = useState('')
  const { query } = useRouter()
  const phone = typeof query.phone === 'string' ? query.phone : ''


  async function submit() {
    if (!phone) {
      alert('Missing phone number')
      return
    }
    // validate aadhar: 12 digits
    const a = String(aadhar).replace(/\D/g, '')
    if (a.length !== 12) {
      alert('Please enter a valid 12-digit Aadhar number')
      return
    }
    try {
      const res = await fetch('/api/save-aadhar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, aadhar: a })
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/dashboard?phone=${encodeURIComponent(phone)}`)
      } else {
        alert(data?.error || 'Failed to save aadhar')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  return (
    <div className="min-h-screen flex items-stretch">
      <div className="hidden md:block md:w-1/2 hero-left p-12">
        <div className="max-w-lg text-white">
          <h1 className="hero-title font-extrabold">Aadhar Verification</h1>
          <p className="muted mt-4">Please upload or enter your Aadhar number to complete account setup. Your data is private.</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-lg form-card p-8">
          <h2 className="text-2xl font-semibold">Enter Aadhar</h2>
          <p className="muted mt-2">Enter your 12-digit Aadhar number to complete account setup. We do not accept uploads.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Aadhar Number</label>
              <input value={aadhar} onChange={(e) => setAadhar(e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="12-digit Aadhar" className="mt-1 block w-full border rounded p-3" />
              <p className="text-xs muted mt-1">Only the 12-digit Aadhaar number is required — do not upload files.</p>
            </div>

            <div>
              <button className="btn-primary w-full py-3" onClick={submit}>Submit Aadhar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
