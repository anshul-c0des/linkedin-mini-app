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
    <main className="max-w-3xl min-h-screen p-4 mx-auto rounded-lg sm:p-6 bg-#f3f6f8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-extrabold text-linkedinBlue">📝Community Feed</h1>
      </div>


      {isSignedIn && (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            className="w-full p-3 text-base bg-white border rounded resize-none sm:text-lg"
            rows={3}
            placeholder="What do you want to share?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className="px-5 py-2 mt-3 text-black transition bg-white border border-blue-600 rounded cursor-pointer hover:bg-blue-100 disabled:opacity-50"
            disabled={posting}
          >
            {posting ? 'Posting...' : 'Post'}
          </button>
        </form>
      
      )}

    {loading ? (
      <div className="py-10 text-center text-gray-500 animate-pulse">Loading posts...</div>
    ) : error ? (
      <div className="py-6 text-center text-red-500">{error}</div>
    ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id.toString()} className="p-4 transition duration-300 ease-in-out bg-white border rounded shadow-sm hover:shadow-md">
              <div className="flex flex-col justify-between mb-2 text-sm text-gray-500 sm:flex-row sm:items-center">
                <Link href={`/profile/${post.author.clerkId}`} className="font-semibold text-blue-600 hover:underline">
                  {post.author.name}
                </Link>
                <div>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })} · {format(new Date(post.createdAt), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
              <p className="text-base text-gray-800 sm:text-lg">{post.content}</p>
            </div>
          
          ))}

        </div>
      )}
    </main>
  );
}
