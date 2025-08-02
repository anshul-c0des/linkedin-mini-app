'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditBio() {
  const [bio, setBio] = useState('');
  const router = useRouter();
  const params = useParams(); // ← Get dynamic route params
  const id = params.id as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/profile/${id}/bio`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bio }),
    });
    
    const data = await res.text();
    console.log('Response status:', res.status);
    console.log('Response body:', data);
    
    if (res.ok) {
      router.push(`/profile/${id}`);
    } else {
      alert('Failed to update bio.');
    }
    
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Bio</h1>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full border rounded p-2 mb-4"
        rows={5}
        placeholder="Write something about yourself..."
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
}
