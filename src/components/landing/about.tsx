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
          <h2 className="font-headline text-3xl md:text-4xl font-bold">About Faizyab Al-Quran</h2>
          <p className="text-muted-foreground text-lg">
            Faizyab Al-Quran is an innovative online platform designed to simplify Qur’anic and Islamic education for students and teachers alike. We believe learning the Quran should be structured, accessible, and spiritually fulfilling — whether you’re a beginner or an advanced student.
          </p>
          <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
            "Our goal is to unite sacred and academic learning under one seamless system."
          </blockquote>
           <Link href="https://www.linkedin.com/in/faizyabhussain/" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground text-lg pt-2 block hover:underline">
            Syed Faizyab Hussain
           </Link>
           <p className="text-sm text-muted-foreground -mt-4">Founder, Faizyab Al-Quran</p>
        </div>
      </div>
    </section>
  );
}
