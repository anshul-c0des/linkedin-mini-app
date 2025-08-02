'use client';
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import PostDate from '@/components/Postdate';


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
      const res = await axios.get('/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
      toast.error('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()){
      toast.error('Post content cannot be empty!');
      return;
    }
  
    setPosting(true);
    try {
      await axios.post('/api/posts', { content }, { withCredentials: true });
      setContent('');
      toast.success('Post submitted successfully!');
      fetchPosts(); // refresh feed
    } catch (err) {
      console.error('Failed to post', err);
      toast.error('Failed to submit post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <main className="max-w-3xl min-h-screen p-4 mx-auto rounded-lg sm:p-6 bg-#f3f6f8 mt-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-extrabold text-blue-700">📝Community Feed</h1>
      </div>


      {isSignedIn && (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            className="w-full p-3 text-base bg-white border rounded resize-none sm:text-lg"
            rows={3}
            placeholder="What do you want to post?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            disabled={posting}
            className="shadow-md transition cursor-pointer hover:bg-blue-600 flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded disabled:opacity-50"
          >
            {posting && (
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
            )}
            {posting ? 'Posting...' : 'Post'}
          </button>

        </form>
      
      )}

    {loading ? (
      <div className="flex flex-col items-center justify-center py-10">
        <svg
          className="w-10 h-10 text-blue-500 animate-spin"
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
        <p className='mt-3 ml-3 font-semibold text-blue-500'>Just a sec...</p>
      </div>
    ) : error ? (
      <div className="py-6 text-center text-red-500">{error}</div>
    ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id.toString()} className="p-4 transition duration-300 ease-in-out bg-white border rounded shadow-sm hover:shadow-md">
              <div className="flex flex-col justify-between mb-2 text-sm text-gray-500 sm:flex-row sm:items-center">
                <Link href={`/profile/${post.author.clerkId}`} className="font-bold text-blue-400 text-lg hover:underline hover:text-blue-600 transition">
                  {post.author.name}
                </Link>
                <div><PostDate dateString={post.createdAt} />
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
