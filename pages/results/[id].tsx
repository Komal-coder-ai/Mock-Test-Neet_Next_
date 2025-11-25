
import { useEffect, useState } from "react";
import { authApi } from "../../lib/authApi";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  History,
  ArrowRight,
} from "lucide-react";
import Confetti from "react-confetti";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function StoredResult() {
  const router = useRouter();
  const { id } = router.query;
  const [result, setResult] = useState<any>(null);
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    authApi({ url: `/api/results/${String(id)}` })
      .then((data: any) => {
        if (data?.ok) {
          setResult(data.result);
          // Fetch paper questions using paperId from result
          return authApi({ url: `/api/papers/${data.result.paperId}` });
        }
      })
      .then((paperData: any) => {
        if (paperData?.ok) setPaper(paperData.paper);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="mb-4 flex items-center gap-3"
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
        <div className="text-blue-700 font-medium text-lg mb-6">
          Loading your result...
        </div>
      </div>
    );
  if (!result || !paper)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <XCircle className="h-10 w-10 text-red-400 mb-4" />
        <div className="text-red-700 font-medium text-lg mb-6">
          No result found
        </div>
        {/* Skeleton loader for no result */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto" />
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="h-32 bg-gray-200 rounded" />
            <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto" />
          </div>
        </div>
      </div>
    );

  // Subjects for analysis
  const subjects = Object.keys(result.subjectBreakdown || {}).map((key) => ({
    name: key,
    ...result.subjectBreakdown[key],
  }));

  const subjectData = {
    labels: subjects.map((sub) => sub.name),
    datasets: [
      {
        label: "Correct Answers",
        data: subjects.map((sub) => sub.correct || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Attempted",
        data: subjects.map((sub) => sub.attempted || 0),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
      {
        label: "Total Questions",
        data: subjects.map((sub) => sub.total || 0),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const subjectOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Subject-wise Performance",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">

      {/* Confetti celebration when result is loaded */}
      <Confetti
        numberOfPieces={120}
        recycle={false}
        width={typeof window !== 'undefined' ? window.innerWidth : 800}
        height={typeof window !== 'undefined' ? window.innerHeight : 600}
      />
      <div className="max-w-4xl mx-auto px-2 md:px-4">
        <motion.div
          className="bg-white p-4 md:p-6 rounded-lg shadow-lg transition-shadow hover:shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mb-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-50 flex items-center justify-center shadow-md">
              <CheckCircle2 className="text-green-600" />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                {result.paperTitle || "Test Result"}
              </h2>
              <div className="text-xs md:text-sm text-gray-500">
                {new Date(result.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-4">
            <div className="p-3 md:p-4 bg-blue-50 rounded-lg text-center shadow-sm">
              <div className="text-xs md:text-sm text-gray-600">Total Questions</div>
              <div className="text-base md:text-lg font-bold text-blue-700">
                {result.total}
              </div>
            </div>
            <div className="p-3 md:p-4 bg-green-50 rounded-lg text-center shadow-sm">
              <div className="text-xs md:text-sm text-gray-600">Correct</div>
              <div className="text-base md:text-lg font-bold text-green-700">
                {result.correctCount}
              </div>
            </div>
            <div className="p-3 md:p-4 bg-red-50 rounded-lg text-center shadow-sm">
              <div className="text-xs md:text-sm text-gray-600">Wrong</div>
              <div className="text-base md:text-lg font-bold text-red-700">
                {result.wrongCount}
              </div>
            </div>
            <div className="p-3 md:p-4 bg-purple-50 rounded-lg text-center shadow-sm col-span-2 md:col-span-1">
              <div className="text-xs md:text-sm text-gray-600">Score</div>
              <div className="text-base md:text-lg font-bold text-purple-700">
                {/* Score calculation: +4 for correct, -1 for wrong */}
                {result.correctCount * 4 - result.wrongCount} / {result.total * 4}
              </div>
            </div>
            <div className="p-3 md:p-4 bg-yellow-50 rounded-lg text-center shadow-sm col-span-2 md:col-span-1">
              <div className="text-xs md:text-sm text-gray-600">Accuracy</div>
              <div className="text-base md:text-lg font-bold text-yellow-700">
                {result.answeredCount && result.answeredCount > 0
                  ? `${((result.correctCount / result.answeredCount) * 100).toFixed(2)}%`
                  : '0%'}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 md:p-4 mb-4 shadow-sm">
            <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-800">
              Subject-wise Performance
            </h3>
            <Bar data={subjectData} options={subjectOptions} />
          </div>

          {/* Detailed Analysis */}
          <div className="mt-6 md:mt-8">
            <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4">Detailed Analysis</h3>
            <div className="space-y-2 md:space-y-3" >
              {subjects.map((sub) => {
                const percent = sub.total ? Math.round((sub.correct / sub.total) * 100) : 0;
                const accuracy = sub.attempted && sub.attempted > 0 ? ((sub.correct / sub.attempted) * 100).toFixed(2) : null;
                return (
                  <div key={sub.name} className="w-full bg-gray-50 border rounded-lg px-3 md:px-4 py-2 md:py-3 mb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-1 gap-2 md:gap-0">
                      <span className="font-semibold text-gray-800">
                        {sub.name}
                      </span>
                      <div className="flex items-center gap-2 md:gap-4">
                        <span className="text-xs md:text-sm text-gray-600">
                          {sub.correct || 0} / {sub.total || 0} correct
                        </span>
                       
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="w-full mr-2">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs md:text-sm text-gray-600 min-w-[40px] text-right">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:gap-3 mt-4 md:mb-6">
            <button
              className="w-full md:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 shadow"
              onClick={() => router.push(`/test/${paper._id}/review?resultId=${result._id}`)}
            >
              Review Answers
              <ArrowRight size={18} />
            </button>
            <button
              className="w-full md:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold flex items-center justify-center gap-2 shadow"
              onClick={() => {
                localStorage.removeItem(`lastSubmission_${String(id)}`);
                router.push(`/test/${paper._id}/begin`);
              }}
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
      </div>
  );
}
