import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
      <div className="flex flex-col items-start space-y-6">
        <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight tracking-tighter">
          Embark on a Journey of Knowledge & Faith
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Faizyab Al-Quran offers a modern, interactive platform for Quranic and academic learning, inspired by the best of online education.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/signup">Get Started <ArrowRight className="ml-2" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">Explore Features</Link>
          </Button>
        </div>
      </div>
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl group">
        <Image
          src="/close-up-islamic-new-year-with-quran-book.jpg"
          alt="A student engaged in learning with books and a laptop"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
         <div className="absolute bottom-6 left-6 text-white">
            <h3 className="font-headline text-2xl font-bold">Learn the Holy Quran</h3>
            <p className="text-sm opacity-90">Structured lessons for all levels.</p>
        </div>
      </div>
    </section>
  );
}
