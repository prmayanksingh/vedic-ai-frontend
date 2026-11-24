import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#131314',
};

export const metadata: Metadata = {
  title: 'Vedic AI Engine',
  description: 'Agentic assistant for Rigveda knowledge and ritual bookings',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="bg-[#131314] font-sans text-[#e3e3e3] antialiased">{children}</body>
    </html>
  );
}
