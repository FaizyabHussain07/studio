
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookUser, BrainCircuit } from "lucide-react";

const sampleCourses = [
    {
        id: "basic-qaida-for-kid",
        title: "Basic Qaida for kid",
        description: "Foundational course for children to learn the basic rules of reading the Quran.",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "children learning",
    },
    {
        id: "qaida-revision",
        title: "Qaida Revision",
        description: "A revision course to solidify the rules of Qaida for accurate Quranic recitation.",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "books manuscript",
    },
    {
        id: "quran-reading",
        title: "Quran Reading",
        description: "Learn to read the Holy Quran with proper pronunciation and fluency.",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "quran reading",
    },
    {
        id: "quran-reading-revision",
        title: "Quran Reading Revision",
        description: "Revise and perfect your Quranic reading skills with guided practice.",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "holy book",
    },
    {
        id: "quran-with-tajweed",
        title: "Quran with Tajweed",
        description: "Master the art of Quranic recitation with the correct rules of Tajweed.",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "islamic calligraphy",
    },
    {
        id: "quran-with-tajweed-revision",
        title: "Quran with Tajweed Revision",
        description: "A comprehensive revision course for all the rules of Tajweed.",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "prayer beads",
    },
    {
        id: "hifz-ul-quran",
        title: "Hifz-ul-Quran",
        description: "This course is for students who want to memorize the Holy Quran by heart.",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "person memorizing",
    },
    {
        id: "hifz-ul-quran-revision",
        title: "Hifz-ul-Quran Revision",
        description: "Revise your memorization of the Quran to ensure long-term retention.",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "student studying",
    },
    {
        id: "diniyat-for-kids",
        title: "Diniyat for kids/Basic Diniyat",
        description: "Fundamental Islamic knowledge for children, covering basics of faith and practice.",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "islamic learning",
    },
    {
        id: "diniyat-for-kids-revision",
        title: "Diniyat for kids/Basic Diniyat Revision",
        description: "A revision course to reinforce the foundational concepts of Diniyat.",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "mosque interior",
    },
    {
        id: "advanced-diniyat",
        title: "Advanced Diniyat",
        description: "An in-depth study of Islamic sciences for advanced learners.",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "islamic scholar",
    },
    {
        id: "advanced-diniyat-revision",
        title: "Advanced Diniyat Revision",
        description: "Revise complex topics in Islamic studies to deepen your understanding.",
        imageUrl: "https://placehold.co/600x400.png",
        dataAiHint: "old books",
    },
];

export default function Courses() {
  return (
    <section id="courses" className="bg-secondary/50 py-20 md:py-32">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Courses</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We offer a diverse range of courses designed to deepen your understanding and knowledge.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleCourses.map((course) => (
            <Card key={course.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300 overflow-hidden">
               <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    <Image 
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                      data-ai-hint={course.dataAiHint}
                    />
                  </div>
                </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="font-headline text-xl mb-2">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild className="w-full">
                  <Link href={`/signup?courseId=${course.id}&courseName=${encodeURIComponent(course.title)}`}>
                    Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
