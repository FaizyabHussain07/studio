
'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import Autoplay from "embla-carousel-autoplay";


const carouselSlides = [
    {
        src: "/close-up-islamic-new-year-with-quran-book.jpg",
        alt: "Faizyab Al-Quran Hero Background",
        text: "Learn Quran with Tajweed & Understanding"
    },
    {
        src: "https://i.ibb.co/Hfc2SKFN/close-up-islamic-new-year-with-quran-book.jpg",
        alt: "LMS Platform",
        text: "Interactive Learning Management System"
    },
    {
        src: "https://i.ibb.co/FN7JFYq/close-up-islamic-new-year-with-quran-book-1.jpg",
        alt: "Modern and Traditional Learning",
        text: "Bridging Traditional Knowledge & Modern Tools"
    },
     {
        src: "https://i.ibb.co/s9Vbg65H/close-up-islamic-new-year-with-quran-book-3.jpg",
        alt: "Hifz ul Quran",
        text: "Memorize the Quran with Expert Guidance"
    },
     {
        src: "https://i.ibb.co/Y4YxfvD9/close-up-islamic-new-year-with-quran-book-4.jpg",
        alt: "Diniyat Courses",
        text: "Build Your Fundamental Islamic Knowledge"
    },
];

export default function Hero() {
  return (
    <section id="hero" className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center text-center text-white overflow-hidden">
       <Carousel
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
        className="absolute inset-0 w-full h-full"
      >
        <CarouselContent className="w-full h-full">
            {carouselSlides.map((slide, index) => (
                <CarouselItem key={index} className="relative w-full h-full">
                    <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4">
                        <h2 className="font-headline text-2xl md:text-3xl font-bold">{slide.text}</h2>
                    </div>
                </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>

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
