import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FileText, Clock, Users, Award, AlertCircle, CheckCircle, XCircle, ArrowLeft, Play } from "lucide-react";

// API Function
const fetchPaperDetails = async (id: string) => {
  const res = await fetch(`/api/papers/${id}`);
  const data = await res.json();
  return { res, data };
};

type Paper = {
  _id: string;
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  date?: string;
};

export default function TestDetails() {
  const router = useRouter();
  const { id, phone } = router.query;
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    fetchPaperDetails(String(id))
      .then(({ res, data }) => {
        if (res.ok && data?.ok) setPaper(data.paper);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <FileText size={48} className="text-blue-600" />
          </motion.div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading test details...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <FileText size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {paper?.title || "Test Details"}
                  </h2>
                </div>
              </div>
              
              {paper && (
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span className="font-medium">{paper.durationMinutes} minutes</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    <span className="font-medium">{paper.totalQuestions} questions</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award size={14} />
                    <span className="font-medium">Mock Test</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <hr className="my-6 sm:my-8" />

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <motion.div 
              className="p-4 sm:p-5 border border-blue-200 rounded-lg bg-blue-50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={18} className="text-blue-600" />
                <div className="font-semibold text-blue-900 text-sm sm:text-base">Important Notice</div>
              </div>
              <div className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                Please make sure you have a stable internet connection and are
                in a quiet environment before starting the test.
              </div>
            </motion.div>

            <motion.div 
              className="p-4 sm:p-5 border border-gray-200 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">General Instructions</div>
              <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-700 space-y-2 leading-relaxed pl-2">
                <li>
                  The test contains {paper?.totalQuestions || 60} multiple choice questions across Physics,
                  Chemistry, and Mathematics/Biology.
                </li>
                <li>Total duration: {paper?.durationMinutes || 180} minutes.</li>
                <li>Each correct answer awards 4 marks.</li>
                <li>
                  Each incorrect answer deducts 1 mark (negative marking).
                </li>
                <li>Unanswered questions carry 0 marks.</li>
                <li>
                  You can navigate between questions using the navigation panel.
                </li>
                <li>You can change your answer before submitting the test.</li>
                <li>Once submitted, the test cannot be retaken.</li>
                <li>Ensure stable internet connection throughout the test.</li>
                <li>Do not refresh the page during the test.</li>
              </ol>
            </motion.div>

            <motion.div 
              className="p-4 sm:p-5 border border-gray-200 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Marking Scheme</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <CheckCircle size={20} className="text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-green-800 text-xs sm:text-sm">Correct Answer</div>
                  <div className="text-green-700 text-xs sm:text-sm">+4 marks</div>
                </div>
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                  <XCircle size={20} className="text-red-600 mx-auto mb-2" />
                  <div className="font-semibold text-red-800 text-xs sm:text-sm">Wrong Answer</div>
                  <div className="text-red-700 text-xs sm:text-sm">-1 mark</div>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded-full mx-auto mb-2"></div>
                  <div className="font-semibold text-gray-800 text-xs sm:text-sm">Not Attempted</div>
                  <div className="text-gray-700 text-xs sm:text-sm">0 marks</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <motion.button
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all text-sm sm:text-base"
              onClick={() => router.back()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft size={18} />
              Go Back
            </motion.button>
            <motion.button
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
              onClick={() => router.push(`/test/${id}/begin`)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play size={18} />
              Start Test Now
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
