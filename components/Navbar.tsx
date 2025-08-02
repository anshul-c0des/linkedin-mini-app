'use client';

import Link from 'next/link';
import { useUser, SignOutButton, SignInButton, UserButton, SignUpButton } from '@clerk/nextjs';

export default function Navbar() {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b">
      <Link href="/">
        <h1 className="text-xl font-bold cursor-pointer text-linkedinBlue">LinkedIn Mini</h1>
      </Link>

      <div className="flex items-center space-x-4">
        {!isSignedIn && (
          <>
            <SignInButton mode='modal'>
              <button className="px-4 py-2 transition border border-#0073b1 rounded cursor-pointer text-blue-700 hover:bg-blue-100">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 text-white transition bg-blue-500 border rounded cursor-pointer hover:bg-blue-600">Sign Up</button>
            </SignUpButton>
          </>
        )}

        {isSignedIn && (
          <>
            <Link href={`/profile/${user?.id}`} className="mr-6 text-linkedinBlue hover:text-blue-600">
              {user?.firstName || 'Profile'}
            </Link>

            <SignOutButton>
              <button className="px-4 py-2 text-black transition bg-white border border-red-600 rounded cursor-pointer hover:bg-red-100">Sign Out</button>
            </SignOutButton>
          </>
        )}
      </div>
    </nav>
  );
}
