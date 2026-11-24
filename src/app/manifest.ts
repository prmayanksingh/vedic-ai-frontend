import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vedic AI Engine',
    short_name: 'Vedic AI',
    description: 'Agentic assistant for Rigveda wisdom and Pandit ritual bookings.',
    start_url: '/',
    display: 'standalone',
    background_color: '#131314',
    theme_color: '#131314',
    icons: [
      { src: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
