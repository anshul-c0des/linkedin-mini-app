'use client';
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
import { useEffect, useState } from 'react';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import axios from 'axios';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns'; 


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
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      setError('');
      const res = await axios.get('/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
      setError('Failed to load posts. Please try again.');
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
    <main className="max-w-3xl mx-auto p-4 sm:p-6 bg-linkedinLightBg rounded-lg min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-linkedinBlue">📝Community Feed</h1>
        {isSignedIn ? (
          <SignOutButton>
            <button className="text-black cursor-pointer border border-red-600 bg-white px-4 py-2 rounded hover:bg-red-100 transition">
              Sign out
            </button> 
          </SignOutButton>
        ) : (
          <SignInButton>
            <button className="text-linkedinDarkBlue cursor-pointer border border-blue-600 px-4 py-2 rounded hover:bg-linkedinDarkBlue hover:text-white transition">
              Sign in
            </button>
          </SignInButton>
        )}
      </div>


      {isSignedIn && (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            className="w-full border p-3 rounded resize-none text-base sm:text-lg"
            rows={3}
            placeholder="What do you want to share?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className="mt-3 bg-white text-black border   border-blue-600 cursor-pointer px-5 py-2 rounded hover:bg-blue-100 transition disabled:opacity-50"
            disabled={posting}
          >
            {posting ? 'Posting...' : 'Post'}
          </button>
        </form>
      
      )}

    {loading ? (
      <div className="text-center py-10 text-gray-500 animate-pulse">Loading posts...</div>
    ) : error ? (
      <div className="text-red-500 text-center py-6">{error}</div>
    ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id.toString()} className="p-4 sm:p-6 bg-white rounded shadow border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 mb-2">
                <Link href={`/profile/${post.author.clerkId}`} className="text-blue-600 font-semibold hover:underline">
                  {post.author.name}
                </Link>
                <div>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })} · {format(new Date(post.createdAt), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
              <p className="text-gray-800 text-base sm:text-lg">{post.content}</p>
            </div>
          
          ))}

        </div>
      )}
    </main>
  );
}
