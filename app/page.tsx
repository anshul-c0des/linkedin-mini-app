'use client';

import { useEffect, useState } from 'react';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import axios from 'axios';

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
    bio?: string;
    clerkId?: string;
  };
}

export default function HomePage() {
  const { isSignedIn, user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setPosting(true);
    try {
      // ✅ Corrected: Add the withCredentials option
      await axios.post('/api/posts', { content }, {
        withCredentials: true,
      });
      setContent('');
      fetchPosts(); // refresh feed
    } catch (err) {
      console.error('Failed to post', err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📝 Community Feed</h1>
        {isSignedIn ? (
          <SignOutButton>
            <button className="text-red-600 text-sm border px-2 py-1 rounded">Sign out</button>
          </SignOutButton>
        ) : (
          <SignInButton>
            <button className="text-blue-600 text-sm border px-2 py-1 rounded">Sign in</button>
          </SignInButton>
        )}
      </div>

      {isSignedIn && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <textarea
            className="w-full border p-2 rounded"
            rows={3}
            placeholder="Share something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={posting}
          >
            {posting ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="p-4 border rounded shadow-sm">
              <div className="text-sm text-gray-500 mb-1">
                {post.author?.name || 'Unknown'} •{' '}
                {new Date(post.createdAt).toLocaleString()}
              </div>
              <div className="text-lg">{post.content}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
