import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import { User, IntUser } from '../../../../models/User';
import { Post } from '../../../../models/Post';

export async function GET(req: Request, { params }: { params: { clerkId: string } }) {
  await dbConnect();

  const user = await User.findOne({ clerkId: params.clerkId }).lean<IntUser>();

  if (!user) {
    return new NextResponse('User not found', { status: 404 });
  }

  const posts = await Post.find({ author: user._id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ user, posts });
}
