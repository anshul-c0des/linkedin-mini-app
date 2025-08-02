'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser, SignOutButton, SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full p-4 bg-white border-b">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/">
          <h1 className="text-xl font-bold cursor-pointer text-linkedinBlue">
            <p className="text-blue-400 inline text-4xl">LinkedIn </p> Mini
          </h1>
        </Link>

        {/* Hamburger button - visible on small screens */}
        <button
          className="p-2 rounded-md md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-linkedinBlue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Menu items */}
        <div
          className={`flex-col md:flex-row md:flex md:items-center md:justify-center md:space-x-4 absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent border-t md:border-0 md:pt-0 pt-4 md:shadow-none shadow-md transition-all duration-300 ease-in-out ${
            menuOpen ? 'flex' : 'hidden'
          }`}
        >
          {!isSignedIn && (
            <>
              <SignInButton mode="modal">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex justify-center items-center px-4 py-2 border border-[#0073b1] rounded text-blue-700 hover:bg-blue-100 transition w-full md:w-auto text-center"
                >
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex justify-center items-center w-full px-4 py-2 mt-2 text-white transition bg-blue-500 rounded hover:bg-blue-600 md:w-auto md:mt-0 text-center"
                >
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}

          {isSignedIn && (
            <>
              <Link
                href={`/profile/${user?.id}`}
                onClick={() => setMenuOpen(false)}
                className="group flex justify-center items-center w-full px-4 py-2 transition border-blue-500 border rounded-md text-blue-700 bg-blue-50 hover:bg-blue-200 md:w-auto text-center"
              >
                {user?.firstName || 'Profile'}
                <p className="ml-1 transform transition-transform group-hover:translate-x-0.5">{'->'}</p>
              </Link>

              <SignOutButton>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex justify-center items-center w-full px-4 py-2 mt-2 text-red-600 transition border border-red-600 rounded bg-red-50 hover:bg-red-200 md:w-auto md:mt-0 cursor-pointer text-center"
                >
                  Sign Out
                </button>
              </SignOutButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
