
import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import About from '@/components/landing/about';
import Features from '@/components/landing/features';
import Resources from '@/components/landing/resources';
import HowItWorks from '@/components/landing/how-it-works';
import Courses from '@/components/landing/courses';
import Testimonials from '@/components/landing/testimonials';
import Faq from '@/components/landing/faq';
import Contact from '@/components/landing/contact';
import { Metadata } from 'next';
import Footer from '@/components/landing/footer';

export const metadata: Metadata = {
    title: 'Faizyab Al-Quran - Modern Learning Platform for Knowledge & Faith',
    description: 'Welcome to Faizyab Al-Quran, a comprehensive online learning management system (LMS). We offer an interactive platform for both Quranic and academic studies, inspired by the best of online education.',
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Features />
        <Resources />
        <Courses />
        <HowItWorks />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
