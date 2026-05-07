import type { Metadata } from 'next';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import TrafficTracker from '@/components/analytics/TrafficTracker';

export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Global Resources Limited',
    default: 'Global Resources Limited | Machinery · Automobiles · Petroleum · Retail',
  },
  description:
    "Global Resources Limited – Nigeria's trusted supplier of industrial machinery, automobiles, AGO diesel, petroleum products and retail shopping. Contact us for a quote.",
  icons: {
    icon: '/assets/images/logo.jpeg',
    shortcut: '/assets/images/logo.jpeg',
    apple: '/assets/images/logo.jpeg',
  },
  openGraph: {
    siteName: 'Global Resources Limited',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css"
        />
        <link rel="icon" href="/assets/images/logo.jpeg" />
      </head>
      <body className="font-sans text-gray-800 bg-white antialiased">
        <TrafficTracker />
        {children}
      </body>
    </html>
  );
}
