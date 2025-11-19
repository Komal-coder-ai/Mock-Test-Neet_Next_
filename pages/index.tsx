import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl p-10 bg-white rounded-lg shadow-lg text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900">Mock Test NEET & JEE</h1>
        <p className="mt-4 muted">
          Prepare effectively with exam-like mock tests, detailed analytics, and topic-wise practice. Build
          speed, accuracy and confidence with systematic revision.
        </p>
        <div className="mt-6 text-left text-sm text-gray-700">
          <h3 className="font-semibold">How it helps</h3>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Full-length timed mock tests with sectional breakdown.</li>
            <li>Subject-wise question palette (Physics/Chemistry/Mathematics) for focused practice.</li>
            <li>Detailed performance analytics and weak-topic recommendations.</li>
          </ul>
        </div>

        <div className="mt-8">
          <Link href="/login" className="btn-primary inline-flex items-center">
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
