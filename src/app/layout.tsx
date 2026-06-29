import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import ChatBot from '@/components/ui/ChatBot';
import CommandPalette from '@/components/ui/CommandPalette';
import PWARegister from '@/components/PWARegister';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'New Wings Solutions — Cinema Equipment & Theatre Renovation',
  description:
    "India's trusted cinema equipment partner. Christie projectors, Galalite screens, Dolby Atmos audio, luxury seating. Theatre renovation experts since 2019. Based in Chennai.",
  keywords:
    'cinema equipment Chennai, theatre renovation India, Christie projectors, Galalite screens, Dolby Atmos, USHIO lamps, Leonis 3D',
  authors: [{ name: 'New Wings Solutions' }],
  openGraph: {
    title: "New Wings Solutions — Powering India's Best Cinemas",
    description:
      'Authorized dealer for Christie, Galalite, Dolby, USHIO. Full theatre renovation services across India.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Wings Solutions',
    description: "India's trusted cinema equipment partner since 2019.",
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
};

// Next 14 generates <meta name="theme-color" content="#3B5BFF" /> from this.
export const viewport: Viewport = {
  themeColor: '#3B5BFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${interTight.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans bg-surface text-fg antialiased">
        <QueryProvider>
          <ThemeProvider>
            {children}
            <ChatBot />
            <CommandPalette />
            <PWARegister />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
