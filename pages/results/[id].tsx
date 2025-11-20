import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
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
    axios
      .get(`/api/results/${String(id)}`)
      .then((res) => {
        if (res.data?.ok) {
          setResult(res.data.result);
          // Fetch paper questions using paperId from result
          return axios.get(`/api/papers/${res.data.result.paperId}`);
        }
      })
      .then((paperRes) => {
        if (paperRes?.data?.ok) setPaper(paperRes.data.paper);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!result || !paper)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No result found
      </div>
    );

  // Subjects for analysis
  const subjects = [
    { name: "Physics", ...result.subjectBreakdown?.Physics },
    { name: "Chemistry", ...result.subjectBreakdown?.Chemistry },
    { name: "Mathematics", ...result.subjectBreakdown?.Mathematics },
  ];

  const subjectData = {
    labels: subjects.map((sub) => sub.name),
    datasets: [
      {
        label: "Correct Answers",
        data: subjects.map((sub) => sub.correct || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg transition-shadow hover:shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center shadow-md">
              <CheckCircle2 className="text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {result.paperTitle || "Test Result"}
              </h2>
              <div className="text-sm text-gray-500">
                {new Date(result.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center shadow-sm">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-lg font-bold text-blue-700">
                {result.total}
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center shadow-sm">
              <div className="text-sm text-gray-600">Correct</div>
              <div className="text-lg font-bold text-green-700">
                {result.correctCount}
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center shadow-sm">
              <div className="text-sm text-gray-600">Wrong</div>
              <div className="text-lg font-bold text-red-700">
                {result.wrongCount}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center flex flex-col items-center shadow-sm">
              <div className="text-sm text-gray-600">Total Score</div>
              <div className="text-lg font-bold text-blue-700">
                {result.score}/{result.maxScore}
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center flex flex-col items-center shadow-sm">
              <div className="text-sm text-gray-600">Accuracy</div>
              <div className="text-lg font-bold text-green-700">
                {result.accuracy}%
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-center flex flex-col items-center shadow-sm">
              <div className="text-sm text-gray-600">Correct</div>
              <div className="text-lg font-bold text-blue-700">
                {result.correctCount}/{result.total}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4 flex flex-col md:flex-row justify-between items-center shadow-sm">
            <div className="flex-1 flex flex-col items-center">
              <div className="text-green-600 font-bold text-lg">
                {result.correctCount}
              </div>
              <div className="text-gray-600 text-sm">Correct</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="text-red-600 font-bold text-lg">
                {result.wrongCount}
              </div>
              <div className="text-gray-600 text-sm">Incorrect</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="text-blue-600 font-bold text-lg">
                {result.unansweredCount}
              </div>
              <div className="text-gray-600 text-sm">Unanswered</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">
              Subject-wise Performance
            </h3>
            <Bar data={subjectData} options={subjectOptions} />
          </div>

          {/* Detailed Analysis */}
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-4">Detailed Analysis</h3>
            <div className="space-y-3">
              {subjects.map((sub) => (
                <div key={sub.name} className="bg-gray-50 border rounded-lg">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 focus:outline-none"
                    onClick={() =>
                      setExpanded(expanded === sub.name ? null : sub.name)
                    }
                  >
                    <span className="font-semibold text-gray-800">
                      {sub.name}
                    </span>
                    <span className="text-xs text-gray-600">
                      {sub.correct || 0} / {sub.total || 0} correct
                    </span>

                    <button
                      className=" items-center justify-center gap-2 px-4 py-2 border rounded-full text-sm bg-blue-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/test/${paper._id}/review`, "_blank");
                      }}
                    >
                      view
                    </button>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              className="px-4 py-2 rounded-lg border"
              onClick={() => router.push("/test/history")}
            >
              Back to History
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
              onClick={() => router.push("/")}
            >
              Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
