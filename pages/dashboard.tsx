import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Clock, 
  Target, 
  Trophy, 
  Search, 
  User, 
  FileCheck, 
  ScrollText,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Activity,
  Calendar,
  TrendingUp
} from 'lucide-react'

type PaperItem = {
  _id: string
  title: string
  durationMinutes: number
  totalQuestions: number
  date?: string
  createdAt?: string
}

export default function Dashboard() {
  const router = useRouter()
  const phone = typeof router.query.phone === 'string' ? router.query.phone : ''
  const [user, setUser] = useState<any | null>(null)

  // papers
  const [category, setCategory] = useState<'JEE' | 'NEET'>('JEE')
  const [papers, setPapers] = useState<PaperItem[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!phone) return
    fetch(`/api/user?phone=${encodeURIComponent(phone)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok) setUser(data.user)
      })
  }, [phone])

  useEffect(() => {
    fetchPapers()
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  useEffect(() => {
    fetchPapers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  async function fetchPapers() {
    setLoading(true)
    try {
      const res = await fetch(`/api/papers?category=${category}&page=${page}&limit=${limit}`)
      const data = await res.json()
      if (data?.ok) {
        setPapers(data.papers)
        setTotal(data.total)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const stats = [
    { icon: FileText, label: 'Total Papers', value: total, color: 'from-blue-500 to-blue-600' },
    { icon: Clock, label: 'Avg Duration', value: '180 min', color: 'from-emerald-500 to-emerald-600' },
      ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Navbar */}
      <motion.nav 
        className="bg-white border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="font-semibold text-lg text-gray-900">MockTest Pro</div>
                <div className="text-xs text-gray-500">JEE & NEET Preparation</div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <motion.a 
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push(`/test/history?phone=${encodeURIComponent(phone)}`)}
              >
                <Activity size={16} />
                Test History
              </motion.a>
              <motion.a 
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <User size={16} />
                Profile
              </motion.a>
              <motion.a 
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <ScrollText size={16} />
                Terms
              </motion.a>
            </div>

            {/* User Info */}
            {user && (
              <motion.div 
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Available Question Papers</h1>
              <p className="text-gray-600 mt-1">Select your exam and begin your test preparation</p>
            </div>
            <motion.button 
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Search size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Category Tabs */}
        <motion.div 
          className="flex gap-3 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              category === 'JEE'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setCategory('JEE')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BookOpen size={18} />
            JEE
          </motion.button>
          <motion.button
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              category === 'NEET'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setCategory('NEET')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Activity size={18} />
            NEET
          </motion.button>
        </motion.div>

        {/* Papers List */}
        <div className="space-y-4">
          {loading && (
            <motion.div 
              className="p-12 bg-white rounded-lg border border-gray-200 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-4"
              >
                <TrendingUp size={40} className="text-blue-600" />
              </motion.div>
              <p className="text-gray-600 font-medium">Loading papers...</p>
            </motion.div>
          )}
          
          <AnimatePresence mode="wait">
            {!loading && papers.map((p, idx) => (
              <motion.div
                key={p._id}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      category === 'JEE' 
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600' 
                        : 'bg-gradient-to-br from-emerald-600 to-teal-600'
                    }`}>
                      <FileCheck size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{p.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {p.durationMinutes} mins
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText size={14} />
                          {p.totalQuestions} Questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {p.date ? new Date(p.date).toLocaleDateString() : 'Latest'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                    onClick={() => router.push(`/test/${p._id}?phone=${encodeURIComponent(phone)}`)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Test
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!loading && papers.length === 0 && (
            <motion.div 
              className="p-12 bg-white rounded-lg border border-gray-200 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Papers Available</h3>
              <p className="text-gray-600">Check back later for new {category} papers</p>
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {!loading && papers.length > 0 && (
          <motion.div 
            className="mt-8 flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-sm text-gray-600">
              Page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <motion.button
                className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                whileHover={{ scale: page > 1 ? 1.02 : 1 }}
                whileTap={{ scale: page > 1 ? 0.98 : 1 }}
              >
                <ChevronLeft size={16} />
                Previous
              </motion.button>
              <motion.button
                className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                whileHover={{ scale: page < totalPages ? 1.02 : 1 }}
                whileTap={{ scale: page < totalPages ? 0.98 : 1 }}
              >
                Next
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <motion.footer 
        className="mt-16 py-6 border-t border-gray-200 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>© 2024 MockTest Pro. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  )
}