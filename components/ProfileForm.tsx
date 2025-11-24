import { useState, useEffect } from 'react';
import { authApi } from '../lib/authApi';

import { User, Calendar, GraduationCap } from 'lucide-react';
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
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8 text-center">
        <User size={32} className="text-blue-600 mb-4" />
        <p className="text-gray-600">Loading profile information...</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-md mx-auto p-8">
      <div className="flex flex-col items-center gap-6">
        {/* Profile Picture */}
        <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
          ) : (
            <User size={48} className="text-blue-500" />
          )}
          <label className={`absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer shadow-md ${!edit ? 'opacity-50 pointer-events-none' : ''}`}>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={!edit} />
            {/* <span className="text-xs">Edit</span> */}
          </label>
        </div>

        {/* Name */}
        <div className="w-full">
          <TextField
            label="Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            fullWidth
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <User size={20} />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            margin="normal"
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
                  <GraduationCap size={20} />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            margin="normal"
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
                        <Calendar size={20} />
                      </InputAdornment>
                    ),
                  },
                  variant: 'outlined',
                  margin: 'normal',
                },
              }}
            />
          </LocalizationProvider>
        </div>

        {/* Edit/Save/Cancel Buttons */}
        <div className="w-full flex justify-end gap-2 mt-4">
          {edit ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEdit(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-400 px-4 py-2 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
