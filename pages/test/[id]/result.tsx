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
  const router = useRouter();
  const { id } = router.query;
  const [submission, setSubmission] = useState<any>(null);
  const [subjectRanks, setSubjectRanks] = useState<any>(null);
  // For debugging
  console.log(submission, "submission");

  useEffect(() => {
    if (!id) return;
    try {
      const raw = localStorage.getItem(`lastSubmission_${String(id)}`);
      if (raw) setSubmission(JSON.parse(raw));
    } catch (e) {
      console.warn(e);
    }
    // Fetch subject ranks from API
    fetch(`/api/papers/${id}/rank`)
      .then(res => res.json())
      .then(data => {
        setSubjectRanks(data.subjectRanks || {});
      })
      .catch(err => console.warn('Failed to fetch subject ranks', err));
  }, [id]);

    if (!submission) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
            <div className="text-lg text-gray-700 font-semibold">Loading your result...</div>
          </div>
        </div>
      );
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

        {/* Summary cards for Total Questions, Correct, Wrong, Score, Accuracy */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center shadow-sm">
            <div className="text-sm text-gray-600">Total Questions</div>
            <div className="text-lg font-bold text-blue-700">{result.total}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center shadow-sm">
            <div className="text-sm text-gray-600">Correct</div>
            <div className="text-lg font-bold text-green-700">{result.correctCount}</div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg text-center shadow-sm">
            <div className="text-sm text-gray-600">Wrong</div>
            <div className="text-lg font-bold text-red-700">{result.wrongCount}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center shadow-sm">
            <div className="text-sm text-gray-600">Score</div>
            <div className="text-lg font-bold text-purple-700">{result.answeredCount === 0 ? 0 : (result.correctCount * 4 - result.wrongCount * 1)} / {result.total * 4}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg text-center shadow-sm">
            <div className="text-sm text-gray-600">Accuracy</div>
            <div className="text-lg font-bold text-yellow-700">{result.answeredCount && result.answeredCount > 0 ? `${((result.correctCount / result.answeredCount) * 100).toFixed(2)}%` : '0%'}</div>
          </div>
        </div>

        {/* Subject-wise Performance Bar Chart */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">
            Subject-wise Performance
          </h3>
          <Bar data={subjectData} options={subjectOptions} />
        </div>

        {/* Subject Ranks Section */}
        {subjectRanks && (
          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Your Subject Ranks</h3>
            <ul className="space-y-2">
              {Object.entries(subjectRanks).map(([subject, ranks]: any) => {
                // Find current user's rank for this subject
                const myRank = ranks.find((r: any) => r.userPhone === result.userPhone);
                return (
                  <li key={subject} className="flex justify-between items-center border-b pb-2">
                    <span className="font-semibold text-gray-700">{subject}</span>
                    {myRank ? (
                      <span className="text-blue-600 font-bold">Rank: {myRank.rank}</span>
                    ) : (
                      <span className="text-gray-400">No rank</span>
                    )}
                  </li> 
                );
              })}
            </ul>
          </div>
        )}

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
  );
}