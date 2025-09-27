import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <section id="about" className="bg-secondary/50 py-20 md:py-32">
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden shadow-lg">
          <Link href="https://www.linkedin.com/in/faizyabhussain/" target="_blank" rel="noopener noreferrer">
            <Image
              src="https://i.ibb.co/XrvLDkcg/Generated-Image-September-27-2025-9-05-AM-min.png"
              alt="Founder of Faizyab Al-Quran"
              fill
              className="object-cover"
            />
          </Link>
        </div>
        <div className="space-y-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">A Message from the Founder</h2>
          <p className="text-muted-foreground text-lg">
            "I started Faizyab Al-Quran with a simple mission: to create a modern, accessible, and engaging platform for both sacred and secular knowledge. Inspired by the structure of Google Classroom, we've built a dedicated online environment where students can deepen their understanding of the Quran and excel in their academic subjects."
          </p>
          <p className="text-muted-foreground text-lg">
            With powerful tools for administrators and an intuitive interface for students, we aim to bridge the gap between traditional teaching and modern technology. Our goal is to foster a vibrant community of learners dedicated to knowledge, faith, and personal growth. Welcome to our community.
          </p>
           <Link href="https://www.linkedin.com/in/faizyabhussain/" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground text-lg pt-2 block hover:underline">
            Syed Faizyab Hussain
           </Link>
           <p className="text-sm text-muted-foreground -mt-4">Founder, Faizyab Al-Quran</p>
        </div>
      </div>
    </section>
  );
}
