
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookUser, BrainCircuit } from "lucide-react";

const sampleCourses = [
  {
    title: "Hifz-ul-Quran",
    description: "This course is for students who want to memorize the Holy Quran by heart.",
    imageUrl: "/quran img 5.jpg",
    icon: <BookUser className="w-8 h-8 text-primary" />,
  },
  {
    title: "Nazra-tul-Quran",
    description: "Learn to read the Holy Quran with proper pronunciation and articulation.",
    imageUrl: "/close-up-islamic-new-year-with-quran-book.jpg",
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Translation of the Qur'an",
    description: "Understand the meaning of the Holy Quran with our comprehensive translation course.",
    imageUrl: "/3696932.jpg",
    icon: <BookUser className="w-8 h-8 text-primary" />,
  },
  {
    title: "Tafseer-ul-Quran",
    description: "Delve deeper into the meanings of the Quranic verses with our Tafseer course.",
    imageUrl: "/3699655.jpg",
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Basic Qaida for kids",
    description: "This course is designed for children to learn the basic rules of reading the Quran.",
    imageUrl: "/7800339.jpg",
    icon: <BookUser className="w-8 h-8 text-primary" />,
  },
  {
    title: "Arabic Language",
    description: "Learn the language of the Quran to better understand its message.",
    imageUrl: "/6628329.jpg",
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
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
          {sampleCourses.map((course, index) => (
            <Card key={index} className="flex flex-col hover:shadow-xl transition-shadow duration-300 overflow-hidden">
               <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    <Image 
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="font-headline text-xl mb-2">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/signup">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
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
