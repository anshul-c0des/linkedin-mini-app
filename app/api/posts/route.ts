import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { dbConnect } from '../../../lib/db';
import { User } from '../../../models/User';
import { Post } from '../../../models/Post';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const posts = await Post.find({})
      .populate({
        path: 'author',
        select: 'name clerkId',
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('❌ GET /api/posts error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { content } = await req.json();

    if (!content || content.trim() === '') {
      return new NextResponse('Content is required', { status: 400 });
    }

    await dbConnect();

    // ✅ Get full user data from Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || 'User';
    const email = clerkUser.emailAddresses[0]?.emailAddress || null;

    const dbUser = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        name,
        email,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const post = await Post.create({
      author: dbUser._id,
      content,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('❌ POST /api/posts error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
