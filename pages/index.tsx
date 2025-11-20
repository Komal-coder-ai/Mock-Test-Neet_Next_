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
    <div className={`min-h-screen flex items-center justify-center py-4 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-[95%] sm:max-w-[90%] md:max-w-2xl lg:max-w-4xl xl:max-w-5xl ${COLORS.card} rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border ${COLORS.border}`}
      >
        {/* Hero Section */}
        <div className="text-center px-4 sm:px-6 md:px-8 lg:px-10 pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-4 sm:pb-6 md:pb-8 border-b border-gray-100">
          <div className="flex justify-center mb-3 sm:mb-4">
            <School 
              className={COLORS.icon}
              sx={{ fontSize: { xs: 36, sm: 40, md: 48, lg: 56 } }}
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight mb-2 sm:mb-3 px-2">
            NEET & JEE Mock Test Platform
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-medium mb-2 sm:mb-3 md:mb-4 px-2">
            Practice. Analyze. Improve. Succeed.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto px-2">
            The most advanced mock test experience for serious NEET & JEE aspirants. Get instant analytics, personalized recommendations, and real exam simulation.
          </p>
        </div>

        {/* Features Section */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10">
          <h3 className="font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 md:mb-8 text-center text-gray-800">Key Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            <motion.div 
              className={`p-4 sm:p-5 md:p-6 border ${COLORS.border} rounded-lg sm:rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Quiz 
                  className={COLORS.icon}
                  sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }}
                />
                <span className="font-semibold text-sm sm:text-base md:text-lg text-gray-900">Real Exam Mock Tests</span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                Attempt full-length NEET/JEE pattern tests with timer, negative marking, and sectional analysis. Experience the real exam pressure.
              </p>
            </motion.div>
            <motion.div 
              className={`p-4 sm:p-5 md:p-6 border ${COLORS.border} rounded-lg sm:rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Assessment 
                  className={COLORS.icon}
                  sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }}
                />
                <span className="font-semibold text-sm sm:text-base md:text-lg text-gray-900">Instant Performance Analytics</span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                Get detailed accuracy, speed, and topic-wise breakdown after every test. Track your progress and boost your rank.
              </p>
            </motion.div>
            <motion.div 
              className={`p-4 sm:p-5 md:p-6 border ${COLORS.border} rounded-lg sm:rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Speed 
                  className={COLORS.icon}
                  sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }}
                />
                <span className="font-semibold text-sm sm:text-base md:text-lg text-gray-900">Speed & Accuracy Builder</span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                Practice with time tracking per question. Learn to optimize speed and accuracy for the real exam.
              </p>
            </motion.div>
            <motion.div 
              className={`p-4 sm:p-5 md:p-6 border ${COLORS.border} rounded-lg sm:rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <School 
                  className={COLORS.icon}
                  sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }}
                />
                <span className="font-semibold text-sm sm:text-base md:text-lg text-gray-900">Subject-Wise Practice</span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                Focus on Physics, Chemistry, Maths/Biology. Strengthen weak areas with targeted practice sets and chapter-wise tests.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Exam Coverage Section */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 pb-6 sm:pb-8">
          <div className={`p-4 sm:p-5 md:p-6 bg-gray-50 border ${COLORS.border} rounded-lg sm:rounded-xl`}>
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 flex items-center gap-2 text-blue-700 flex-wrap">
              <School 
                className={COLORS.icon}
                sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }}
              />
              <span>Complete Exam Coverage</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 text-xs sm:text-sm md:text-base">
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base md:text-lg">NEET (UG) Pattern</h4>
                <ul className="text-gray-600 space-y-1 sm:space-y-1.5 ml-3 sm:ml-4">
                  <li className="leading-relaxed">• 180 Questions (45 each: Physics, Chemistry, Botany, Zoology)</li>
                  <li className="leading-relaxed">• 3 hours 20 minutes duration</li>
                  <li className="leading-relaxed">• 720 marks total with negative marking</li>
                  <li className="leading-relaxed">• Chapter-wise & full syllabus tests</li>
                </ul>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base md:text-lg">JEE Main Pattern</h4>
                <ul className="text-gray-600 space-y-1 sm:space-y-1.5 ml-3 sm:ml-4">
                  <li className="leading-relaxed">• 90 Questions (30 each: Physics, Chemistry, Maths)</li>
                  <li className="leading-relaxed">• 3 hours duration</li>
                  <li className="leading-relaxed">• 300 marks with negative marking</li>
                  <li className="leading-relaxed">• MCQs + Numerical type questions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center px-4 sm:px-6 md:px-8 lg:px-10 pb-6 sm:pb-8 md:pb-10 lg:pb-12">
          <p className="text-gray-600 mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm md:text-base px-2 leading-relaxed">
            Join thousands of NEET & JEE aspirants. Track your progress, identify weak areas, and boost your rank.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/login" 
              className={`inline-flex items-center shadow-lg hover:shadow-xl transition-all text-sm sm:text-base md:text-lg lg:text-xl px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-full font-semibold ${COLORS.cta}`}
            >
              Start Your Preparation
            </Link>
          </motion.div>
          <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs md:text-sm text-gray-500">
            Free practice tests available • No credit card required
          </p>
        </div>
      </motion.div>
    </div>
  );
}