
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  metadataBase: new URL('https://faizyab-al-quran.vercel.app'),
  title: {
    default: 'Faizyab Al-Quran - Modern Learning Platform',
    template: `%s | Faizyab Al-Quran`,
  },
  description: 'A modern learning platform for Quranic and academic studies, inspired by Google Classroom. Manage courses, assignments, and student progress with ease.',
  keywords: ['Quran learning', 'online education', 'LMS', 'e-learning', 'academic studies', 'student management'],
  icons: {
    icon: '/WhatsApp_Image_2025-07-07_at_16.40.56_083d1ca9-removebg-preview.png'
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="google-site-verification" content="googled5e9f1c43ffe54df" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
