import { useState, useEffect } from 'react';

export default function ProfileForm({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    class: '',
    dateOfBirth: '',
    aadharNumber: '',
  });

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/profile?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setProfile(data.profile);
          setForm({
            fullName: data.profile.fullName,
            class: data.profile.class,
            dateOfBirth: data.profile.dateOfBirth,
            aadharNumber: data.profile.aadharNumber,
          });
        }
      });
  }, [userId]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, userId }),
    });
    const data = await res.json();
    if (data.ok) {
      setProfile(data.profile);
      setEdit(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-xl font-bold mb-4">Personal Information</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          disabled={!edit}
          className="w-full p-2 border rounded"
        />
        <span className="text-xs text-gray-500">Your name cannot be changed</span>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Class</label>
        <input
          type="text"
          name="class"
          value={form.class}
          onChange={handleChange}
          disabled={!edit}
          className="w-full p-2 border rounded"
        />
        <span className="text-xs text-gray-500">You can update your current class</span>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          disabled={!edit}
          className="w-full p-2 border rounded"
        />
        <span className="text-xs text-gray-500">Your date of birth cannot be changed</span>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Aadhar Number</label>
        <input
          type="text"
          name="aadharNumber"
          value={form.aadharNumber}
          onChange={handleChange}
          disabled={!edit}
          className="w-full p-2 border rounded"
        />
        <span className="text-xs text-yellow-700 flex items-center gap-1">
          <svg width="16" height="16" fill="currentColor" className="inline"><circle cx="8" cy="8" r="8"/></svg>
          Your Aadhar is encrypted and secure
        </span>
      </div>
      <div className="flex justify-end gap-2">
        {!edit ? (
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setEdit(true)}>
            Edit
          </button>
        ) : (
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSave}>
            Save
          </button>
        )}
      </div>
    </div>
  );
}
