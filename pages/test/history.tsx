import { useEffect, useRef, useState } from "react";
import { authApi } from '../../lib/authApi';
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

export default function TestHistoryPage() {
  const router = useRouter();
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // try to get userPhone from query param first, then localStorage
    const q = router.query?.phone;
    if (q && typeof q === "string") {
      setUserPhone(q);
      return;
    }
    try {
      const up =
        localStorage.getItem("userPhone") || localStorage.getItem("user");
      if (up) {
        // if user object stored, attempt to parse
        try {
          const parsed = JSON.parse(up);
          setUserPhone(parsed?.phone || parsed?.userPhone || String(parsed));
        } catch (e) {
          setUserPhone(String(up));
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    if (!userPhone) return;
    setLoading(true);
    authApi({ url: `/api/results?userPhone=${encodeURIComponent(userPhone)}` })
      .then((data: any) => {
        if (data?.ok) setResults(data.results || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userPhone]);

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir = 1) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (  
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 mb-6">
          <h1 className="text-2xl font-bold">Test History & Analysis</h1>
          <p className="text-sm opacity-90">
            Review your past performances and track your progress
          </p>
        </div>

        {!userPhone && (
          <div className="bg-white p-6 rounded-lg mb-6">
            <p className="text-gray-700">
              You are not signed in. To view your test history, please login or
              enter your phone number.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="mb-4"
            >
              <svg
                className="animate-spin h-10 w-10 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </motion.div>
            <div className="text-blue-700 font-medium text-lg">
              Loading your test history...
            </div>
          </div>
        )}

        {/* Vertical list fallback (kept for accessibility/responsive) */}
        <div className="space-y-6">
          {results.map((r) => (
            <motion.div
              key={`list-${r._id}`}
              className="bg-white rounded-lg p-6 shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">
                    {r.paperTitle || "Untitled Test"}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-6 py-4 rounded-lg bg-blue-50 text-center">
                    <div className="text-xs text-gray-600">Score</div>
                    <div className="text-lg font-bold">
                      {(r.correctCount * 4 - (r.wrongCount || (r.total - r.correctCount)))} / {r.total * 4}
                    </div>
                  </div>
                  <div className="px-6 py-4 rounded-lg bg-green-50 text-center">
                    <div className="text-xs text-gray-600">Accuracy</div>
                    <div className="text-lg font-bold">
                      {r.answeredCount && r.answeredCount > 0
                        ? `${((r.correctCount / r.answeredCount) * 100).toFixed(2)}%`
                        : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4 flex justify-between">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-full text-sm mr-2"
                  onClick={() => router.push(`/results/${r._id}`)}
                >
                  <Eye size={16} /> View Details
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-full text-sm bg-blue-600 text-white"
                  onClick={() => router.push(`/test/${r.paperId}/begin`)}
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
