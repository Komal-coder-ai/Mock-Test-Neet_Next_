import { useState, useEffect } from 'react';
import { authApi } from '../lib/authApi';

import { User, Calendar, GraduationCap, Camera, Sparkles } from 'lucide-react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function ProfileForm({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    class: '',
    dateOfBirth: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    authApi({ url: `/api/profile?userId=${userId}` })
      .then((data: any) => {
        if (data.ok) {
          setProfile(data.profile);
          setForm({
            fullName: data.profile.fullName || '',
            class: data.profile.class || '',
            dateOfBirth: data.profile.dateOfBirth || '',
            imageUrl: data.profile.imageUrl || '',
          });
        } else {
          setError('Failed to load profile information');
        }
      })
      .catch(() => setError('Network error occurred'))
      .finally(() => setLoading(false));
  }, [userId]);
  
  if (loading && !profile) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden p-12 flex flex-col items-center justify-center">
        <div className="relative w-20 h-20 mb-6">
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          {/* Inner icon */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <User size={28} className="text-white" />
          </div>
        </div>
        
        <div className="font-bold text-2xl text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Loading Profile
        </div>
        <div className="text-base text-gray-600 text-center max-w-xs">
          Please wait while we fetch your information...
        </div>
        
        {/* Loading dots */}
        <div className="flex gap-2 mt-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleDateChange = (date: any) => {
    setForm({ ...form, dateOfBirth: date ? dayjs(date).format('YYYY-MM-DD') : '' });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await authApi({
        url: '/api/profile',
        method: 'PUT',
        data: { userId, ...form },
      });
      if (data.ok) {
        setProfile(data.profile);
        setEdit(false);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch {
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
      imageUrl: profile?.imageUrl || '',
    });
    setEdit(false);
    setError('');
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden max-w-md mx-auto p-10 relative">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-pink-400/10 rounded-tr-full"></div>
      
      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Profile Picture */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-xl">
            {form.imageUrl ? (
              <img src={form.imageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <User size={56} className="text-white" />
              </div>
            )}
            <label className={`absolute bottom-1 right-1 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full p-2.5 cursor-pointer shadow-lg transform transition-all duration-200 ${!edit ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 hover:scale-110'}`}>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} 
              disabled
              />
            
            </label>
          </div>
        
        </div>

        {/* Name */}
        <div className="w-full">
          <TextField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            fullWidth
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <User size={20} className="text-blue-600" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover fieldset': {
                  borderColor: '#6366f1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6366f1',
                  borderWidth: '2px',
                },
              },
            }}
          />   
        </div>

        {/* Class (editable only) */}
        <div className="w-full">
          <TextField
            select
            label="Class"
            name="class"
            value={form.class}
            onChange={handleChange}
            fullWidth
            disabled={!edit}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GraduationCap size={20} className="text-purple-600" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover fieldset': {
                  borderColor: '#6366f1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6366f1',
                  borderWidth: '2px',
                },
              },
            }}
          >
            <MenuItem value="">Select your class</MenuItem>
            <MenuItem value="9th">9th Grade</MenuItem>
            <MenuItem value="10th">10th Grade</MenuItem>
            <MenuItem value="11th">11th Grade</MenuItem>
            <MenuItem value="12th">12th Grade</MenuItem>
            <MenuItem value="Graduate">Graduate</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </div>

        {/* Date of Birth */}
        <div className="w-full">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={form.dateOfBirth ? dayjs(form.dateOfBirth) : null}
              onChange={handleDateChange}
              disabled
              slotProps={{
                textField: {
                  fullWidth: true,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Calendar size={20} className="text-indigo-600" />
                      </InputAdornment>
                    ),
                  },
                  variant: 'outlined',
                  margin: 'normal',
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </div>

        {/* Edit/Save/Cancel Buttons */}
        <div className="w-full flex justify-end gap-3 mt-6">
          {edit ? (
            <>
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all transform hover:scale-105 shadow-md"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEdit(true)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-6 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-lg px-5 py-3.5 text-red-700 shadow-md animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}