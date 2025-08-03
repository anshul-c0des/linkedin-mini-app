import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { dbConnect } from '../../../lib/db';
import { User } from '../../../models/User';
import { Post } from '../../../models/Post';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const posts = await Post.find({})    // retrieves all posts from Posts collection
      .populate({   // replace author field with actual user data
        path: 'author',
        select: 'name clerkId',
      })
      .sort({ createdAt: -1 });  // sort newest first

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
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

    const client = await clerkClient();   // fetch user
    const clerkUser = await client.users.getUser(userId);
    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || 'User';
    const email = clerkUser.emailAddresses[0]?.emailAddress || null;

    const dbUser = await User.findOneAndUpdate(   //  finds this user in the mongo database
      { clerkId: userId },
      {
        name,
        email,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const post = await Post.create({  // creates a new post and link it to user
      author: dbUser._id,
      content,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
