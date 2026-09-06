import type { Metadata, Viewport } from 'next';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'Nexus — Social Super-App',
  description: 'A secure social super-app combining features of Telegram, WhatsApp, Instagram, X, Facebook, Spotify, and Snapchat with E2E encryption and AI playground.',
  manifest: '/manifest.json',
  applicationName: 'Nexus',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Nexus' },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <ThemeProvider>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
