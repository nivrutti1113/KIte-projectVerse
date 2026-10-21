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
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600/15 selection:text-blue-900">
        <AuthProvider>
          <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200" />}>
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
