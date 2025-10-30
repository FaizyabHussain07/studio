'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import Autoplay from "embla-carousel-autoplay";


export default function Hero() {
  return (
    <section id="hero" className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center text-center text-white">
       <Carousel 
        opts={{ loop: true }} 
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]} 
        className="absolute inset-0 w-full h-full"
      >
        <CarouselContent className="w-full h-full">
            <CarouselItem className="relative w-full h-full">
                <Image
                src="/close-up-islamic-new-year-with-quran-book.jpg"
                alt="Faizyab Al-Quran Hero Background"
                fill
                className="object-cover"
                priority
                />
                 <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4">
                    <h2 className="font-headline text-2xl md:text-3xl font-bold">Learn Quran with Tajweed & Understanding</h2>
                 </div>
            </CarouselItem>
             <CarouselItem className="relative w-full h-full">
                <Image
                src="https://i.ibb.co/Hfc2SKFN/close-up-islamic-new-year-with-quran-book.jpg"
                alt="LMS Platform"
                fill
                className="object-cover"
                />
                 <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4">
                    <h2 className="font-headline text-2xl md:text-3xl font-bold">Interactive Learning Management System</h2>
                 </div>
            </CarouselItem>
             <CarouselItem className="relative w-full h-full">
                <Image
                src="https://i.ibb.co/FN7JFYq/close-up-islamic-new-year-with-quran-book-1.jpg"
                alt="Modern and Traditional Learning"
                fill
                className="object-cover"
                />
                 <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4">
                    <h2 className="font-headline text-2xl md:text-3xl font-bold">Bridging Traditional Knowledge & Modern Tools</h2>
                 </div>
            </CarouselItem>
        </CarouselContent>
      </Carousel>

      <div className="relative z-10 flex flex-col items-center space-y-6">
        <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight tracking-tighter">
          Faizyab Al-Quran: A Modern Platform for Knowledge & Faith
        </h1>
        <p className="text-lg text-white/80 max-w-2xl">
          Learn the Holy Quran and Islamic Studies through a structured, digital learning system — anytime, anywhere.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
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
