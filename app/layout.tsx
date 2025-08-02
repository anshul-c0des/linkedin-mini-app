// app/layout.tsx (NO 'use client' here)
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LinkedIn Mini',
  description: 'A mini LinkedIn-like platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
            <Navbar />
            {children}
            <Toaster position="top-right" reverseOrder={false} />
        </body>
      </html>
    </ClerkProvider>
  );
}
