import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Formik, Form, Field } from 'formik'
import ErrorMsg from '../../components/ErrorMsg'
import Toast from '../../components/Toast'

export default function RegisterPage() {
  const router = useRouter()
  // redirect if already logged in
  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken')
      const phone = localStorage.getItem('userPhone')
      const userId = localStorage.getItem('userId')
      const role = localStorage.getItem('userRole')
      if (token || phone || userId) {
        if (role === 'admin') router.replace('/admin/dashboard')
        else if (userId) router.replace('/profile');
        else router.replace(`/dashboard?phone=${encodeURIComponent(phone || '')}`)
      }
    } catch (e) {}
  }, [])
  const [toast, setToast] = useState<{ msg: string; type?: 'success' | 'error' } | null>(null)

  const features = [
    {
      icon: '🎯',
      title: 'Mock Tests',
      desc: 'Access realistic NEET & JEE practice tests',
    },
    {
      icon: '📊',
      title: 'Analytics',
      desc: 'Track your performance with detailed insights',
    },
    {
      icon: '🧠',
      title: 'Smart Learning',
      desc: 'Get personalized recommendations based on progress',
    },
    {
      icon: '🏆',
      title: 'Compete & Grow',
      desc: 'Join thousands of students preparing together',
    },
  ]

  return (
    <div className="min-h-screen md:flex bg-gray-50">
      {/* Left Hero Section */}
      <motion.div
        className="md:w-1/2 hero-left p-10 items-center justify-center hidden md:flex relative overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated background circles */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-white opacity-5 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-48 h-48 bg-white opacity-5 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />

        <div className="max-w-md relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="hero-title font-extrabold">Start Your Journey!</h1>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of students preparing for NEET & JEE with real mock tests and personalized analytics.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                }}
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-white text-sm">
                  {feature.title}
                </h3>
                <p className="text-xs text-blue-100 mt-1">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-blue-100 mb-3">Already have an account?</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg"
            >
              Sign In →
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md form-card p-8"
        >
          {/* Header with animated icon */}
          <div className="text-center mb-6">
            <motion.div
              className="inline-block text-5xl mb-3"
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🚀
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="muted mt-2">Register with your phone to get started</p>
          </div>

          <Formik
            initialValues={{ name: '', phone: '' }}
            validate={(vals: any) => {
              const errors: any = {}
              if (!vals.name) errors.name = 'Name is required'
              else if (vals.name.length < 2) errors.name = 'Name must be at least 2 characters'
              if (!vals.phone) errors.phone = 'Phone is required'
              else if (!/^[0-9]{10}$/.test(vals.phone)) errors.phone = 'Enter a valid 10-digit phone number'
              return errors
            }}
            onSubmit={async (values: any, { setSubmitting }: any) => {
              setSubmitting(true)
              try {
                const phone = String(values.phone).replace(/\D/g, '').slice(0, 10)
                const res = await fetch('/api/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: values.name.trim(), phone })
                })
                const data = await res.json()
                if (res.ok) {
                  setToast({ msg: 'Registration successful! OTP sent to your phone.', type: 'success' })
                  setTimeout(() => router.push('/login'), 1500)
                } else {
                  setToast({ msg: data?.error || 'Registration failed', type: 'error' })
                }
              } catch (err) {
                setToast({ msg: 'Network error. Please try again.', type: 'error' })
              } finally {
                setSubmitting(false)
              }
            }}
          >
            {({ errors, touched, isSubmitting }: any) => (
              <Form className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span>👤</span> Full Name
                  </label>
                  <Field name="name">
                    {({ field }: any) => (
                      <input
                        {...field}
                        className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Enter your full name"
                      />
                    )}
                  </Field>
                  {touched.name && <ErrorMsg>{errors.name}</ErrorMsg>}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span>📞</span> Phone Number
                  </label>
                  <Field name="phone">
                    {({ field }: any) => (
                      <input
                        {...field}
                        inputMode="numeric"
                        maxLength={10}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '')
                          field.onChange({
                            target: { name: field.name, value: digits },
                          })
                        }}
                        className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Enter 10-digit number"
                      />
                    )}
                  </Field>
                  {touched.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
                </motion.div>

                <motion.button
                  className="w-full btn-primary py-3 text-lg font-semibold rounded-lg shadow-md mt-6"
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        ⏳
                      </motion.span>
                      Creating Account...
                    </span>
                  ) : (
                    'Register & Send OTP →'
                  )}
                </motion.button>
              </Form>
            )}
          </Formik>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm muted">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-accent font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">
                🔒 Your data is encrypted and secure. By registering, you agree
                to our terms of service.
              </p>
            </div>
          </motion.div>

          <Toast
            message={toast?.msg || null}
            type={toast?.type === 'error' ? 'error' : 'success'}
            onClose={() => setToast(null)}
          />
        </motion.div>
      </div>
    </div>
  )
}