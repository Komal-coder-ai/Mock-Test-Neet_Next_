import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, BarChartHorizontal, Info, XCircle, History } from 'lucide-react'
import Confetti from 'react-confetti';
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <XCircle className="h-10 w-10 text-red-400 mb-4" />
        <div className="text-red-700 font-medium text-lg mb-6">No submission found</div>
        {/* Skeleton loader for no submission */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto" />
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="h-32 bg-gray-200 rounded" />
            <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto" />
          </div>
        </div>
        <div className="mt-4">
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => router.push(`/test/${String(id)}`)}>Go to Test</button>
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
      {/* Confetti celebration when result is loaded */}
      <Confetti numberOfPieces={120} recycle={false} width={typeof window !== 'undefined' ? window.innerWidth : 800} height={typeof window !== 'undefined' ? window.innerHeight : 600} />
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
            {subjects.map((sub) => {
              const percent = sub.total ? Math.round((sub.correct / sub.total) * 100) : 0;
              return (
                <div key={sub.name} className="bg-gray-50 border rounded-lg px-4 py-3 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800">
                      {sub.name}
                    </span>
                    <span className="text-xs text-gray-600">
                      {sub.correct || 0} / {sub.total || 0} correct
                    </span>
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
                    <span className="text-xs text-gray-600 min-w-[40px] text-right">{percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col mt-4 md:flex-row gap-3 mb-6">
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