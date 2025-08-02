'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditBio() {
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/profile/${id}/bio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio }),
      });

      if (res.ok) {
        toast.success('Bio updated successfully!');
        router.push(`/profile/${id}`);
      } else {
        toast.error('Failed to update bio.');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl p-4 mx-auto mt-20">
      <h1 className="mb-4 text-2xl font-bold">Edit Bio</h1>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        rows={5}
        placeholder="Write something about yourself..."
        disabled={loading}
      />
      <button
        type="submit"
        className="flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (
          <svg
            className="w-5 h-5 mr-2 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : null}
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}