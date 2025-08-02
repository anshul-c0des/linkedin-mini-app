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
    <div className="max-w-2xl p-4 mx-auto mt-20">
      <h1 className="text-4xl font-bold text-blue-700">{user.name}</h1>
      <p className="text-md text-gray-500 mt-1">{user.email}</p>

      {/* Bio section */}
      <div className="mt-4">
        <h2 className="font-semibold text-2xl text-blue-400">Bio..</h2>
        {user.bio ? <p className="mt-1">{user.bio}</p> : <p className="text-gray-400">No bio yet.</p>}
        {isOwnProfile && (
          <Link
            href={`/profile/${userId}/edit`}
            className="inline-block mt-2 text-sm text-orange-400 hover:underline"
          >
            {"Edit Bio ->"}
          </Link>
        )}
      </div>

      <hr className="my-4 mt-5" />

      <h2 className="mb-4 text-2xl font-semibold text-blue-400">{posts.length} {posts.length===1 ? 'Post' : 'Posts'}</h2>
      {posts.length === 0 ? (
        <p className="mt-4 italic text-gray-500">Nothing to show here yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id.toString()} className="p-3 mb-3 text-md bg-white border rounded">
            <p>{post.content}</p>
            <p className="mt-1 text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleString('en-GB', { timeZone: 'GMT' })}
            </p>

          </div>
        ))
      )}
    </div>
  );
}
