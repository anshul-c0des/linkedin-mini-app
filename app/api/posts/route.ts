// app/api/posts/route.ts
import { auth } from '@clerk/nextjs/server';
import { dbConnect } from '../../../lib/db';
import { User } from '../../../models/User';
import { Post } from '../../../models/Post';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
      await dbConnect();
  
      // Find all posts and populate the author field to get user details
      const posts = await Post.find({})
        .populate({
          path: 'author',
          select: 'name clerkId', // Selects the name and clerkId from the User model
        })
        .sort({ createdAt: -1 }); // Sorts by newest first
  
      return NextResponse.json(posts, { status: 200 });
    } catch (error) {
      console.error('❌ GET /api/posts error:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }
  

export async function POST(req: NextRequest) {
    try {
      const { userId, sessionClaims } = auth(); // ✅ Call auth() directly and destructure
      
      if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
      
      const { content } = await req.json();
      
      if (!content || content.trim() === '') {
        return new NextResponse('Content is required', { status: 400 });
      }
      
      await dbConnect();
      
      const name = sessionClaims?.firstName || 'User';
      const email = sessionClaims?.email || null;
      
      const dbUser = await User.findOneAndUpdate(
        { clerkId: userId },
        {
          name: name,
          email: email,
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