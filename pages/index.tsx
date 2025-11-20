import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { School, Assessment, Speed, Quiz } from '@mui/icons-material';

const COLORS = {
  primary: 'bg-gradient-to-r from-blue-700 to-indigo-700',
  secondary: 'bg-gradient-to-r from-blue-100 to-indigo-100',
  accent: 'text-blue-700',
  card: 'bg-white',
  border: 'border-gray-200',
  icon: 'text-blue-600',
  cta: 'bg-blue-600 text-white',
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken');
      const phone = localStorage.getItem('userPhone');
      const userId = localStorage.getItem('userId');
      if (token || phone || userId) {
        router.replace(`/dashboard?phone=${encodeURIComponent(phone || '')}`);
      }
    } catch (e) {}
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 ${COLORS.secondary}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-3xl ${COLORS.card} rounded-2xl shadow-2xl border ${COLORS.border}`}
      >
        {/* Hero Section */}
        <div className="text-center px-8 pt-12 pb-8 border-b border-gray-100">
          <div className="flex justify-center mb-4">
            <School fontSize="large" className={COLORS.icon} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-2">
            NEET & JEE Mock Test Platform
          </h1>
          <p className="text-lg md:text-xl text-gray-700 font-medium mb-4">
            Practice. Analyze. Improve. Succeed.
          </p>
          <p className="text-base text-gray-500 max-w-xl mx-auto">
            The most advanced mock test experience for serious NEET & JEE aspirants. Get instant analytics, personalized recommendations, and real exam simulation.
          </p>
        </div>

        {/* Features Section */}
        <div className="px-8 py-10">
          <h3 className="font-bold text-xl mb-8 text-center text-gray-800">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`p-5 border ${COLORS.border} rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow`}>
              <div className="flex items-center gap-3 mb-2">
                <Quiz fontSize="medium" className={COLORS.icon} />
                <span className="font-semibold text-gray-900">Real Exam Mock Tests</span>
              </div>
              <p className="text-gray-600 text-sm">
                Attempt full-length NEET/JEE pattern tests with timer, negative marking, and sectional analysis. Experience the real exam pressure.
              </p>
            </div>
            <div className={`p-5 border ${COLORS.border} rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow`}>
              <div className="flex items-center gap-3 mb-2">
                <Assessment fontSize="medium" className={COLORS.icon} />
                <span className="font-semibold text-gray-900">Instant Performance Analytics</span>
              </div>
              <p className="text-gray-600 text-sm">
                Get detailed accuracy, speed, and topic-wise breakdown after every test. Track your progress and boost your rank.
              </p>
            </div>
            <div className={`p-5 border ${COLORS.border} rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow`}>
              <div className="flex items-center gap-3 mb-2">
                <Speed fontSize="medium" className={COLORS.icon} />
                <span className="font-semibold text-gray-900">Speed & Accuracy Builder</span>
              </div>
              <p className="text-gray-600 text-sm">
                Practice with time tracking per question. Learn to optimize speed and accuracy for the real exam.
              </p>
            </div>
            <div className={`p-5 border ${COLORS.border} rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow`}>
              <div className="flex items-center gap-3 mb-2">
                <School fontSize="medium" className={COLORS.icon} />
                <span className="font-semibold text-gray-900">Subject-Wise Practice</span>
              </div>
              <p className="text-gray-600 text-sm">
                Focus on Physics, Chemistry, Maths/Biology. Strengthen weak areas with targeted practice sets and chapter-wise tests.
              </p>
            </div>
          </div>
        </div>

        {/* Exam Coverage Section */}
        <div className="px-8 pb-8">
          <div className={`p-6 bg-gray-50 border ${COLORS.border} rounded-xl`}>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-700">
              <School fontSize="small" className={COLORS.icon} /> Complete Exam Coverage
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
        <div className="text-center px-8 pb-12">
          <p className="text-gray-600 mb-6 text-sm">
            Join thousands of NEET & JEE aspirants. Track your progress, identify weak areas, and boost your rank.
          </p>
          <Link 
            href="/login" 
            className={`inline-flex items-center shadow-lg hover:shadow-xl transition-all text-lg px-8 py-3 rounded-full font-semibold ${COLORS.cta}`}
          >
            Start Your Preparation
          </Link>
          <p className="mt-4 text-xs text-gray-500">
            Free practice tests available • No credit card required
          </p>
        </div>
      </motion.div>
    </div>
  );
}