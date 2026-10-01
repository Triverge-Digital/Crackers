import type { Metadata, Viewport } from 'next';
import { Lilita_One, Plus_Jakarta_Sans } from 'next/font/google';
import { SITE_NAME, SITE_URL } from '@/shop/constants';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['500', '700', '800'], variable: '--font-jakarta', display: 'swap' });
const lilita = Lilita_One({ subsets: ['latin'], weight: '400', variable: '--font-lilita', display: 'swap' });

const description =
  'B&W Crackers Sivakasi — 2026 Diwali price list with a flat 80% discount on MRP. Direct dispatch from Sivakasi, order online, pay after confirmation.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} Sivakasi | 2026 Price List – Flat 80% Off, Direct Delivery`, template: `%s | ${SITE_NAME}` },
  description,
  keywords: ['Sivakasi crackers', 'Diwali crackers online', 'B&W Crackers', 'crackers price list 2026', '80% discount crackers'],
  icons: { icon: '/favicon-32.png', apple: '/apple-touch-icon.png' },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} Sivakasi | 2026 Price List – Flat 80% Off`,
    description,
    url: SITE_URL,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.jpg'] },
};

export const viewport: Viewport = { themeColor: '#1A1A4E', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${jakarta.variable} ${lilita.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
