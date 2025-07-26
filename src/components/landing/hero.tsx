import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section id="hero" className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
      <div className="flex flex-col items-start space-y-6">
        <h1 className="font-headline text-4xl md:text-6xl font-bold leading-tight tracking-tighter">
          Unlock the Wisdom of the Quran
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Faizyab Al-Quran offers a modern, interactive platform for Quranic and academic learning, tailored for both students and administrators.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} asChild>
            <Link href="/signup">Get Started for Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>
      <div className="relative">
        <Image
          src="https://placehold.co/600x400.png"
          alt="Quran learning platform"
          width={600}
          height={400}
          className="rounded-xl shadow-2xl"
          data-ai-hint="quran learning"
        />
      </div>
    </section>
  );
}
