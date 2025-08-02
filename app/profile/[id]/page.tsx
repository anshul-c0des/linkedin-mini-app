import React from 'react'; // import React for React.use
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { Post } from '@/models/Post';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage(props: Props) {
  // unwrap params with React.use
  const params = await props.params;  // await directly
  const userId = params.id;

  await dbConnect();

  const session = await auth();
  const currentUserId = session.userId;
  const isOwnProfile = currentUserId === userId;

  const user = await User.findOne({ clerkId: userId }).lean();

  if (!user) return notFound();

  const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <p className="text-sm text-gray-500">{user.email}</p>

      {/* Bio section */}
      <div className="mt-4">
        <h2 className="font-semibold">Bio</h2>
        {user.bio ? <p className="mt-1">{user.bio}</p> : <p className="text-gray-400">No bio yet.</p>}
        {isOwnProfile && (
          <Link
            href={`/profile/${userId}/edit`}
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            Edit Bio
          </Link>
        )}
      </div>

      <hr className="my-4" />

      <h2 className="text-xl font-semibold mb-2">Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id.toString()} className="border p-3 rounded mb-3">
            <p>{post.content}</p>
            <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
