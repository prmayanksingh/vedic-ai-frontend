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

const SITE_NAME = 'Vedic AI Engine';
const SITE_DESCRIPTION =
  'An agentic AI assistant for Rigveda wisdom and Hindu ritual services — explore Vedic hymns, check Pandit availability, and book, reschedule, or cancel pujas in plain language.';

// Set NEXT_PUBLIC_SITE_URL in production so Open Graph / Twitter image URLs are absolute.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ??
  'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} · Rigveda & Pandit Booking Assistant`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'Vedic AI',
    'Rigveda',
    'Vedas',
    'Hindu rituals',
    'puja booking',
    'book a Pandit',
    'Pandit availability',
    'Satyanarayan Puja',
    'Griha Pravesh',
    'AI agent',
  ],
  category: 'religion',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  appleWebApp: { capable: true, title: 'Vedic AI', statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false, email: false, address: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="bg-[#131314] font-sans text-[#e3e3e3] antialiased">{children}</body>
    </html>
  );
}
