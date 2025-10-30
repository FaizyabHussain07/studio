
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
import Teachers from '@/components/landing/teachers';

export const metadata: Metadata = {
    title: 'Faizyab Al-Quran - Modern Learning Platform for Knowledge & Faith',
    description: 'Faizyab Al-Quran offers a single, powerful platform for both Quranic and academic studies. Our integrated system empowers students and admins to manage courses, assignments, and progress with unparalleled ease.',
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Features />
        <Courses />
        <HowItWorks />
        <Resources />
        <Teachers />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
