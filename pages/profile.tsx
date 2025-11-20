import { useEffect, useState } from 'react';
import ProfileForm from '../components/ProfileForm';

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Try to get userId from localStorage
    const stored = localStorage.getItem('userId') || localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserId(parsed?.userId || parsed?.id || String(parsed));
      } catch {
        setUserId(String(stored));
      }
    }
  }, []);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">Profile</h2>
          <p className="text-gray-600">User ID not found. Please login or verify OTP.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <ProfileForm userId={userId} />
      </div>
    </div>
  );
}
