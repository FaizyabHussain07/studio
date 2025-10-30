
'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <Image
            src="/close-up-islamic-new-year-with-quran-book.jpg"
            alt="Faizyab Al-Quran Hero Background"
            fill
            className="object-cover"
            priority
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex flex-col items-center space-y-6 max-w-4xl mx-auto px-4">
            <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight tracking-tighter">
            Faizyab Al-Quran: A Modern Platform for Knowledge & Faith
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
            Learn the Holy Quran and Islamic Studies through a structured, digital learning system — anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
                <Link href="/signup">Get Started <ArrowRight className="ml-2" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white hover:text-black">
                <Link href="#features">Explore Features</Link>
            </Button>
            </div>
        </div>
    </section>
  );
}
