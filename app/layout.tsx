import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar'  // <-- Import Navbar here

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LinkedIn Mini',
  description: 'A mini LinkedIn-like platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />   {/* Add Navbar here */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
