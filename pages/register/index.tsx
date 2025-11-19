import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Formik, Form, Field } from 'formik'
import ErrorMsg from '../../components/ErrorMsg'
import Toast from '../../components/Toast'

export default function RegisterPage() {
  const router = useRouter()
  const [toast, setToast] = useState<{ msg: string; type?: 'success' | 'error' } | null>(null)

  return (
    <div className="min-h-screen md:flex">
      <motion.div className="md:w-1/2 hero-left hero-overlay p-10 items-center justify-center hidden md:flex">
        <div className="max-w-md">
          <h1 className="hero-title font-extrabold">Build confidence with real mock tests</h1>
          <p className="mt-4 muted">Register and get started with realistic JEE & NEET mock tests, analytics and learning paths.</p>
          <div className="mt-6">
            <p className="text-sm muted">Have an account? <a href="/login" className="text-accent font-medium">Login</a></p>
          </div>
        </div>
      </motion.div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md form-card p-8">
          <h2 className="text-2xl font-bold">Register</h2>
          <p className="muted mt-2">Create an account with phone. We'll send an OTP to verify.</p>

          <Formik
            initialValues={{ name: '', phone: '' }}
            validate={(vals: any) => {
              const errors: any = {}
              if (!vals.name) errors.name = 'Name is required'
              if (!vals.phone) errors.phone = 'Phone is required'
              else if (!/^[0-9]{10}$/.test(vals.phone)) errors.phone = 'Enter a valid 10-digit phone number'
              return errors
            }}
            onSubmit={async (values: any, { setSubmitting }: any) => {
              setSubmitting(true)
              try {
                const res = await fetch('/api/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: values.name, phone: values.phone })
                })
                const data = await res.json()
                if (res.ok) {
                  setToast({ msg: 'Registered — OTP sent (check response in dev).' , type: 'success'})
                  // brief delay then navigate to login
                  setTimeout(() => router.push('/login'), 1200)
                } else {
                  setToast({ msg: data?.error || 'Registration failed', type: 'error' })
                }
              } catch (err) {
                setToast({ msg: 'Network error', type: 'error' })
              } finally {
                setSubmitting(false)
              }
            }}
          >
            {({ errors, touched, isSubmitting }: any) => (
              <Form className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <Field name="name" className="mt-1 block w-full border rounded p-3" />
                  {touched.name && <ErrorMsg>{errors.name}</ErrorMsg>}
                </div>
                <div>
                  <label className="block text-sm font-medium">Phone</label>
                  <Field name="phone" className="mt-1 block w-full border rounded p-3" />
                  {touched.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
                </div>
                <div>
                  <button className="w-full btn-primary py-3" type="submit" disabled={isSubmitting}>Register & Send OTP</button>
                </div>
              </Form>
            )}
          </Formik>

          <Toast message={toast?.msg || null} type={toast?.type === 'error' ? 'error' : 'success'} onClose={() => setToast(null)} />
        </motion.div>
      </div>
    </div>
  )
}
