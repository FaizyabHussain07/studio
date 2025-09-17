
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from '@/components/analytics/analytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://faizyab-al-quran.vercel.app'),
  title: {
    default: 'Faizyab Al-Quran - Modern Learning Platform',
    template: `%s | Faizyab Al-Quran`,
  },
  description: 'Faizyab Al-Quran is a comprehensive online learning platform (LMS) designed for Quranic and academic studies. Inspired by Google Classroom, we provide role-based dashboards for students and admins to manage courses, assignments, and progress with ease.',
  keywords: ['Faizyab Al-Quran', 'Quran learning', 'online education', 'LMS', 'e-learning', 'academic studies', 'student management', 'Islamic education'],
  icons: {
    icon: '/WhatsApp_Image_2025-07-07_at_16.40.56_083d1ca9-removebg-preview.png'
  },
  openGraph: {
    title: 'Faizyab Al-Quran - Modern Learning Platform',
    description: 'A modern, interactive platform for Quranic and academic learning.',
    url: 'https://faizyab-al-quran.vercel.app',
    siteName: 'Faizyab Al-Quran',
    images: [
      {
        url: 'https://faizyab-al-quran.vercel.app/close-up-islamic-new-year-with-quran-book.jpg', // Should be an absolute URL
        width: 1200,
        height: 630,
        alt: 'A student learning with Faizyab Al-Quran platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faizyab Al-Quran - Modern Learning Platform',
    description: 'A modern, interactive platform for Quranic and academic learning.',
    creator: '@FaizyabHus74391',
    images: ['https://faizyab-al-quran.vercel.app/close-up-islamic-new-year-with-quran-book.jpg'], // Should be an absolute URL
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Faizyab Al-Quran",
  "url": "https://faizyab-al-quran.vercel.app",
  "logo": "https://faizyab-al-quran.vercel.app/WhatsApp_Image_2025-07-07_at_16.40.56_083d1ca9-removebg-preview.png",
  "description": "Faizyab Al-Quran is a comprehensive online learning platform (LMS) for Quranic and academic studies, providing role-based dashboards for students and admins to manage courses and progress.",
  "founder": {
    "@type": "Person",
    "name": "Syed Faizyab Hussain",
    "url": "https://www.linkedin.com/in/faizyabhussain/"
  },
  "sameAs": [
    "https://x.com/FaizyabHus74391",
    "https://www.youtube.com/@FaizyabAlQuran",
    "https://whatsapp.com/channel/0029Vb1JCt9CBtxIbIs9FJ3p",
    "https://github.com/FaizyabHussain07/studio",
    "https://www.linkedin.com/in/faizyabhussain/"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "faizyab.al.quran@gmail.com",
    "contactType": "Customer Service"
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <Analytics />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
