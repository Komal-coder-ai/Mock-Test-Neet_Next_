import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
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
  TrendingUp,
} from "lucide-react";

type PaperItem = {
  _id: string;
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  date?: string;
  createdAt?: string;
};

export default function Dashboard() {
  const router = useRouter();
  const phone =
    typeof router.query.phone === "string" ? router.query.phone : "";
  const [user, setUser] = useState<any | null>(null);

  // papers
  const [category, setCategory] = useState<"JEE" | "NEET">("JEE");
  const [papers, setPapers] = useState<PaperItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!phone) return;
    fetch(`/api/user?phone=${encodeURIComponent(phone)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok) setUser(data.user);
      });
  }, [phone]);

  useEffect(() => {
    fetchPapers();
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    fetchPapers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function fetchPapers() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/papers?category=${category}&page=${page}&limit=${limit}`
      );
      const data = await res.json();
      if (data?.ok) {
        setPapers(data.papers);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Available Question Papers
              </h1>
              <p className="text-gray-600 mt-1">
                Select your exam and begin your test preparation
              </p>
            </div>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex gap-3 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              category === "JEE"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setCategory("JEE")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BookOpen size={18} />
            JEE
          </motion.button>
          <motion.button
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              category === "NEET"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setCategory("NEET")}
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
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <TrendingUp size={40} className="text-blue-600" />
              </motion.div>
              <p className="text-gray-600 font-medium">Loading papers...</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!loading &&
              papers.map((p, idx) => (
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
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          category === "JEE"
                            ? "bg-gradient-to-br from-blue-600 to-indigo-600"
                            : "bg-gradient-to-br from-emerald-600 to-teal-600"
                        }`}
                      >
                        <FileCheck size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {p.title}
                        </h3>
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
                            {p.date
                              ? new Date(p.date).toLocaleDateString()
                              : "Latest"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                      onClick={() =>
                        router.push(
                          `/test/${p._id}?phone=${encodeURIComponent(phone)}`
                        )
                      }
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Papers Available
              </h3>
              <p className="text-gray-600">
                Check back later for new {category} papers
              </p>
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
              Page <span className="font-semibold text-gray-900">{page}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">{totalPages}</span>
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

    </div>
  );
}
