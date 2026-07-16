import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ciaotee.vercel.app'),
  title: {
    default: 'Tee — Web Designer & Developer',
    template: '%s | Tee Portfolio',
  },
  description:
    'Web Developer focused on UI design, responsive websites, and practical web products. Available for freelance projects.',
  keywords: [
    'web developer', 'web designer', 'freelance', 'portfolio', 'next.js', 'react',
    'responsive', 'ui ux', 'vietnam', 'lập trình web', 'thiết kế web',
  ],
  authors: [{ name: 'Tee' }],
  creator: 'Tee',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'vi_VN',
    siteName: 'Tee Portfolio',
    title: 'Tee — Web Designer & Developer',
    description: 'Building modern, responsive, and user-friendly websites for individuals, stores, and small businesses.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tee Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tee — Web Designer & Developer',
    description: 'Building modern, responsive, and user-friendly websites.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Tee',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ciaotee.vercel.app',
  jobTitle: 'Web Designer & Developer',
  description: 'Web Developer focused on UI design and responsive websites.',
  sameAs: [],
  knowsAbout: ['Web Design', 'React', 'Next.js', 'Tailwind CSS', 'UI/UX Design'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased relative">
        <div className="signal-line-container"></div>
        {children}
      </body>
    </html>
  );
}
