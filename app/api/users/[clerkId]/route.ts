import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import { User, IntUser } from '../../../../models/User';
import { Post } from '../../../../models/Post';

export async function GET(req: Request, context: any) {
  const { clerkId } = context.params;

  await dbConnect();

  const user = await User.findOne({ clerkId }).lean<IntUser>();

  if (!user) {
    return new NextResponse('User not found', { status: 404 });
  }

  const posts = await Post.find({ author: user._id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ user, posts });
}
