import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import React, { Suspense } from 'react';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'KITE ProjectVerse — STEM Hands-on Innovation Platform',
  description: 'Practical STEM project-building platform by KITE Robotics for Classes 3–12. Build robotics, electronics, IoT, coding, and AI projects.',
  keywords: ['STEM education', 'Robotics for kids', 'Arduino projects', 'Indian STEM', 'KITE Robotics', 'ATL Lab'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white">
        <AuthProvider>
          <Suspense fallback={<div className="h-20 bg-slate-900 border-b border-slate-800" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 flex flex-col">
            <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading...</div>}>
              {children}
            </Suspense>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
