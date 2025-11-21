import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, BarChartHorizontal, Info } from 'lucide-react'
import { Bar } from 'react-chartjs-2';
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

export default function ResultPage() {
  const router = useRouter()
  const { id } = router.query
  const [submission, setSubmission] = useState<any>(null)
  // For debugging
  console.log(submission, "submission");

  useEffect(() => {
    if (!id) return
    try {
      const raw = localStorage.getItem(`lastSubmission_${String(id)}`)
      if (raw) setSubmission(JSON.parse(raw))
    } catch (e) {
      console.warn(e)
    }
  }, [id])

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow">
          <h3 className="text-lg font-semibold">No submission found</h3>
          <p className="text-sm text-gray-600 mt-2">We couldn't find a recent submission for this test. You can go back to take the test.</p>
          <div className="mt-4">
            <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => router.push(`/test/${String(id)}`)}>Go to Test</button>
          </div>
        </div>
      </div>
    )
  }

  const { result } = submission

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
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Subject-wise Performance',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-2 md:px-0">
        {/* Top summary */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Info size={20} className="text-yellow-600" />
            </div>
            <span className="font-semibold text-lg text-gray-900">Test Completed!</span>
          </div>
          <p className="text-sm text-gray-600">Your comprehensive performance summary</p>
        </div>

        {/* Score and accuracy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <BarChartHorizontal size={24} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Total Score</div>
              <div className="font-bold text-lg">{result.correctCount}/{result.total}</div>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded ml-1">{result.percent}%</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={24} className="text-green-600" />
            </div>
            <div>
              <div className="text-xs text-gray-600">Accuracy</div>
              <div className="font-bold text-lg">{result.accuracy || result.percent}%</div>
            </div>
          </div>
        </div>

        {/* Subject-wise Performance Bar Chart */}
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
                <div className="w-full flex items-center justify-between px-4 py-3">
                  <span className="font-semibold text-gray-800">
                    {sub.name}
                  </span>
                  <span className="text-xs text-gray-600">
                    {sub.correct || 0} / {sub.attempted || 0} attempted / {sub.total || 0} total
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <button
            className="w-full md:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 shadow"
            onClick={() => router.push(`/test/${String(id)}/review`)}
          >
            Review Answers
            <ArrowRight size={18} />
          </button>
            <button
              className="w-full md:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold flex items-center justify-center gap-2 shadow"
              onClick={() => {
                localStorage.removeItem(`lastSubmission_${String(id)}`);
                router.push(`/test/${String(id)}`);
              }}
            >
              Try Again
            </button>
        </div>
      </div>
    </div>
  )
}