// app/api/profile/[id]/bio/route.ts

import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = getAuth(req);

  if (userId !== params.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { bio } = await req.json();

  await dbConnect();

  await User.findOneAndUpdate({ clerkId: userId }, { bio });

  return NextResponse.json({ success: true });
}
