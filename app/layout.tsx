import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LinkedIn Mini',
  description: 'A mini LinkedIn-like platform',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();  // get current session from clerk
  const userId = session.userId;


  if (userId) {
    await dbConnect();

    const existingUser = await User.findOne({ clerkId: userId });

    if (!existingUser) {  // if user does not exist, the create a new one
      const client = await clerkClient();
      const user = await client.users.getUser(userId);

      await User.create({
        clerkId: userId,
        name: user.firstName || 'User',
        email: user.emailAddresses[0]?.emailAddress || '',
      });
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <Navbar />
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </ClerkProvider>
      </body>
    </html>
  );
}
