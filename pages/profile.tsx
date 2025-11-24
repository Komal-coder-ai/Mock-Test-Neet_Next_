import { useEffect, useState } from 'react';
import ProfileForm from '../components/ProfileForm';
import { User } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4 animate-spin">
              <User size={32} className="text-blue-600" />
            </div>
            <div className="font-semibold text-lg text-gray-900 mb-1">Loading Profile</div>
            <div className="text-sm text-gray-500">Please wait while we fetch your information...</div>
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
