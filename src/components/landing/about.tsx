import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="bg-secondary/50 py-20 md:py-32">
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-video">
           <Image
            src="https://placehold.co/550x310.png"
            alt="About Faizyab Al-Quran"
            width={550}
            height={310}
            className="rounded-xl object-cover shadow-lg"
            data-ai-hint="library books"
          />
        </div>
        <div className="space-y-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">About Faizyab Al-Quran</h2>
          <p className="text-muted-foreground text-lg">
            Faizyab Al-Quran is a dedicated online learning environment inspired by the structure of Google Classroom, but tailored for both sacred and secular knowledge. Our mission is to provide an accessible, organized, and engaging platform for students to deepen their understanding of the Quran and excel in their academic subjects.
          </p>
          <p className="text-muted-foreground text-lg">
            With powerful tools for administrators and an intuitive interface for students, we bridge the gap between traditional teaching and modern technology, fostering a community of learners dedicated to knowledge and faith.
          </p>
        </div>
      </div>
    </section>
  );
}
