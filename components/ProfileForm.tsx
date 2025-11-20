import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  GraduationCap, 
  Calendar, 
  CreditCard, 
  Edit3, 
  Save, 
  X, 
  Shield, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function ProfileForm({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    class: '',
    dateOfBirth: '',
    aadharNumber: '',
  });

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/profile?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setProfile(data.profile);
          setForm({
            fullName: data.profile.fullName || '',
            class: data.profile.class || '',
            dateOfBirth: data.profile.dateOfBirth || '',
            aadharNumber: data.profile.aadharNumber || '',
          });
        } else {
          setError('Failed to load profile information');
        }
      })
      .catch(() => setError('Network error occurred'))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId }),
      });
      const data = await res.json();
      if (data.ok) {
        setProfile(data.profile);
        setEdit(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      fullName: profile?.fullName || '',
      class: profile?.class || '',
      dateOfBirth: profile?.dateOfBirth || '',
      aadharNumber: profile?.aadharNumber || '',
    });
    setEdit(false);
    setError('');
  };

  if (loading && !profile) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="p-8 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <User size={32} className="text-blue-600" />
          </motion.div>
          <p className="text-gray-600">Loading profile information...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Personal Information</h2>
              <p className="text-blue-100">Manage your profile details</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!edit ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEdit(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all"
              >
                <Edit3 size={18} />
                Edit Profile
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all"
                >
                  <X size={18} />
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border-l-4 border-red-400 px-8 py-4"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-50 border-l-4 border-green-400 px-8 py-4"
          >
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Content */}
      <div className="p-8 space-y-6">
        {/* Full Name Field */}
        <div className="group">
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
            <User size={18} className="text-blue-600" />
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              disabled={!edit}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                edit 
                  ? 'border-gray-300 focus:border-blue-500 bg-white' 
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed'
              }`}
              placeholder="Enter your full name"
            />
            {!edit && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Shield size={16} className="text-gray-400" />
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
            <Shield size={14} className="text-gray-400" />
            Your name cannot be changed after verification
          </p>
        </div>

        {/* Class Field */}
        <div className="group">
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
            <GraduationCap size={18} className="text-green-600" />
            Current Class
          </label>
          <div className="relative">
            <select
              name="class"
              value={form.class}
              onChange={handleChange}
              disabled={!edit}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-green-100 ${
                edit 
                  ? 'border-gray-300 focus:border-green-500 bg-white' 
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed'
              }`}
            >
              <option value="">Select your class</option>
              <option value="9th">9th Grade</option>
              <option value="10th">10th Grade</option>
              <option value="11th">11th Grade</option>
              <option value="12th">12th Grade</option>
              <option value="Graduate">Graduate</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
            <CheckCircle size={14} />
            You can update your current class anytime
          </p>
        </div>

        {/* Date of Birth Field */}
        <div className="group">
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
            <Calendar size={18} className="text-purple-600" />
            Date of Birth
          </label>
          <div className="relative">
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              disabled={!edit}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-purple-100 ${
                edit 
                  ? 'border-gray-300 focus:border-purple-500 bg-white' 
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed'
              }`}
            />
            {!edit && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Shield size={16} className="text-gray-400" />
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
            <Shield size={14} className="text-gray-400" />
            Your date of birth cannot be changed
          </p>
        </div>

        {/* Aadhar Number Field */}
        <div className="group">
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
            <CreditCard size={18} className="text-orange-600" />
            Aadhar Number
          </label>
          <div className="relative">
            <input
              type="text"
              name="aadharNumber"
              value={form.aadharNumber}
              onChange={handleChange}
              disabled={!edit}
              maxLength={12}
              pattern="[0-9]{12}"
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-orange-100 ${
                edit 
                  ? 'border-gray-300 focus:border-orange-500 bg-white' 
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed'
              }`}
              placeholder="Enter 12-digit Aadhar number"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Shield size={16} className="text-orange-500" />
            </div>
          </div>
          <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-700 flex items-center gap-2">
              <Shield size={16} className="text-orange-600" />
              <span className="font-medium">Your Aadhar is encrypted and secure</span>
            </p>
            <p className="text-xs text-orange-600 mt-1">
              We use bank-level encryption to protect your sensitive information
            </p>
          </div>
        </div>

        {/* Save Button for Mobile */}
        {edit && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 border-t border-gray-200 md:hidden"
          >
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
