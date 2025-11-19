import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken')
      const phone = localStorage.getItem('userPhone')
      const userId = localStorage.getItem('userId')
      if (token || phone || userId) {
        // already logged in -> redirect to dashboard
        router.replace(`/dashboard?phone=${encodeURIComponent(phone || '')}`)
      }
    } catch (e) {}
  }, [])
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl form-card"
      >
        {/* Header Section */}
        <div className="text-center px-10 pt-10 pb-6 border-b border-gray-100">
          <h1 className="text-5xl font-extrabold text-accent leading-tight">
            Mock Test Platform
          </h1>
          <p className="text-2xl font-bold text-gray-900 mt-2">NEET & JEE Preparation</p>
          <p className="mt-4 muted text-lg max-w-2xl mx-auto">
            Master your exam strategy with full-length mock tests, in-depth performance analytics, 
            and personalized weak-topic recommendations. Practice like the real exam.
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="px-10 py-8">
          <h3 className="font-bold text-accent text-xl mb-6 text-center">Why Choose Our Platform?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="p-5 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📝</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Full-Length Mock Tests</h4>
                  <p className="text-gray-600 mt-1 text-sm">
                    Timed tests exactly like NEET/JEE pattern with 180-200 questions. Experience real exam pressure with sectional breakdown.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-5 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Subject-Wise Practice</h4>
                  <p className="text-gray-600 mt-1 text-sm">
                    Dedicated question palettes for Physics, Chemistry & Mathematics/Biology. Focus on weak subjects strategically.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-5 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Detailed Analytics</h4>
                  <p className="text-gray-600 mt-1 text-sm">
                    Get accuracy reports, time management insights, rank predictions, and topic-wise performance breakdowns after every test.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-5 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Speed & Accuracy Builder</h4>
                  <p className="text-gray-600 mt-1 text-sm">
                    Track your solving speed per question. Build confidence with negative marking system and learn time optimization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Coverage Section */}
        <div className="px-10 pb-8">
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-bold text-accent text-lg mb-4 flex items-center gap-2">
              <span>🎓</span> Complete Exam Coverage
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">NEET (UG) Pattern</h4>
                <ul className="text-gray-600 space-y-1 ml-4">
                  <li>• 180 Questions (45 each: Physics, Chemistry, Botany, Zoology)</li>
                  <li>• 3 hours 20 minutes duration</li>
                  <li>• 720 marks total with negative marking</li>
                  <li>• Chapter-wise & full syllabus tests</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">JEE Main Pattern</h4>
                <ul className="text-gray-600 space-y-1 ml-4">
                  <li>• 90 Questions (30 each: Physics, Chemistry, Maths)</li>
                  <li>• 3 hours duration</li>
                  <li>• 300 marks with negative marking</li>
                  <li>• MCQs + Numerical type questions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center px-10 pb-10">
          <p className="text-gray-600 mb-6 text-sm">
            Join thousands of students preparing smarter. Track progress, identify weak areas, and boost your rank.
          </p>
          <Link 
            href="/login" 
            className="btn-primary inline-flex items-center shadow-lg hover:shadow-xl transition-all text-lg px-8 py-3"
          >
            Start Your Preparation →
          </Link>
          <p className="mt-4 text-xs text-gray-500">
            Free practice tests available • No credit card required
          </p>
        </div>
      </motion.div>
    </div>
  )
}