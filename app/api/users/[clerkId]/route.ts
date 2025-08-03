import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import { User, IntUser } from '../../../../models/User';
import { Post } from '../../../../models/Post';

export async function GET(req: Request, context: any) {
  const { clerkId } = context.params;

  await dbConnect();

  const user = await User.findOne({ clerkId }).lean<IntUser>();  // finds the user with matching clerkId

  if (!user) {
    return new NextResponse('User not found', { status: 404 });
  }

  const posts = await Post.find({ author: user._id })  // finds all posts by teh user
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ user, posts });
}
