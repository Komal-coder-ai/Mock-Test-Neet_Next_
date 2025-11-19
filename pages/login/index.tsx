import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Formik, Form, Field } from 'formik'
import ErrorMsg from '../../components/ErrorMsg'
import Toast from '../../components/Toast'

function OTPBoxes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = useRef<HTMLInputElement[]>([])

  function handleChange(index: number, val: string) {
    if (!/^[0-9]?$/.test(val)) return
    const chars = value.split('')
    while (chars.length < 6) chars.push('')
    chars[index] = val
    onChange(chars.join('').slice(0, 6))
    if (val && index < 5) inputs.current[index + 1]?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key === 'Backspace' && !(e.currentTarget.value) && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  const chars = value.split('').slice(0, 6)

  return (
    <div className="flex gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el!)}
          value={chars[i] || ''}
          onChange={(e) => handleChange(i, e.target.value.replace(/[^0-9]/g, '').slice(0, 1))}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-12 text-center border rounded"
          inputMode="numeric"
          maxLength={1}
        />
      ))}
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [phoneStored, setPhoneStored] = useState('')
  const [otp, setOtp] = useState('')

  return (
    <div className="min-h-screen md:flex">
      <motion.div className="md:w-1/2 hero-left hero-overlay p-10 items-center justify-center hidden md:flex">
        <div className="max-w-md">
          <h1 className="hero-title font-extrabold">Welcome back</h1>
          <p className="mt-4 muted">Sign in with your phone to continue your prep journey.</p>
          <div className="mt-6">
            <Link href="/register" className="px-4 py-2 bg-white text-black rounded font-medium">Create account</Link>
          </div>
        </div>
      </motion.div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md form-card p-8">
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="muted mt-2">Enter your phone to receive a one-time password.</p>

          <Formik
            initialValues={{ phone: '' }}
            validate={(v: any) => {
              const errors: any = {}
              if (!v.phone) errors.phone = 'Phone is required'
              else if (!/^[0-9]{10}$/.test(v.phone)) errors.phone = 'Enter a valid 10-digit phone number'
              return errors
            }}
            onSubmit={async (values: any, { setSubmitting }: any) => {
              setError(null)
              setMessage(null)
              setSubmitting(true)
              try {
                const phone = String(values.phone).replace(/\D/g, '').slice(0, 10)
                if (phone.length !== 10) {
                  setError('Enter a valid 10-digit phone number')
                  setSubmitting(false)
                  return
                }
                const res = await fetch('/api/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ phone })
                })
                const data = await res.json()
                if (res.ok) {
                  setMessage('OTP sent (check response in dev)')
                  if (data?.otp) setMessage((m) => `${m} — OTP: ${data.otp}`)
                  setPhoneStored(phone)
                  try { localStorage.setItem('userPhone', phone) } catch (e) {}
                  setStep('verify')
                } else {
                  setError(data?.error || 'Failed to send OTP')
                }
              } catch (err) {
                setError('Network error')
              } finally { setSubmitting(false) }
            }}
          >
            {({ errors, touched, isSubmitting }: any) => (
              <Form className="mt-6 space-y-4">
                {step === 'request' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium">Phone</label>
                      <Field name="phone">
                        {({ field }: any) => (
                          <input
                            {...field}
                            inputMode="numeric"
                            maxLength={10}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, '')
                              field.onChange({ target: { name: field.name, value: digits } })
                            }}
                            className="mt-1 block w-full border rounded p-3"
                          />
                        )}
                      </Field>
                      {touched.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
                    </div>
                    {message && <div className="text-sm text-green-600">{message}</div>}
                    {error && <div className="text-sm text-red-600">{error}</div>}
                    <div>
                      <button className="w-full btn-primary py-3" type="submit" disabled={isSubmitting}>Send OTP</button>
                    </div>
                  </>
                )}

                {step === 'verify' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium">Enter OTP</label>
                      <OTPBoxes value={otp} onChange={setOtp} />
                    </div>
                    <div className="mt-2">
                      <button
                        className="w-full btn-primary py-3"
                        type="button"
                        onClick={async () => {
                          if (otp.length !== 6) { setError('Enter 6-digit OTP'); return }
                          try {
                            const res = await fetch('/api/verify-otp', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ phone: phoneStored, otp })
                            })
                            const data = await res.json()
                            if (res.ok) {
                              try {
                                if (data?.accessToken) localStorage.setItem('accessToken', data.accessToken)
                                if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)
                                if (data?.role) localStorage.setItem('userRole', data.role)
                                if (data?.id) localStorage.setItem('userId', data.id)
                              } catch (e) {}
                              if (data?.role === 'admin') router.push('/dashboard')
                              else router.push(`/adhar?phone=${encodeURIComponent(phoneStored)}`)
                            } else {
                              setError(data?.error || 'OTP verification failed')
                            }
                          } catch (err) { setError('Network error') }
                        }}
                      >
                        Verify OTP
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="flex-1 border rounded py-2" onClick={() => setStep('request')}>Back</button>
                      <button type="button" className="flex-1 border rounded py-2" onClick={() => setStep('request')}>Resend</button>
                    </div>
                  </>
                )}
              </Form>
            )}
          </Formik>

          <p className="mt-4 text-sm muted">Don't have an account? <Link href="/register" className="text-accent font-medium">Register</Link></p>
          <Toast message={message || error || null} type={error ? 'error' : 'success'} onClose={() => { setMessage(null); setError(null) }} />
        </motion.div>
      </div>
    </div>
  )
}
