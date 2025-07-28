import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookUser, BrainCircuit } from "lucide-react";

const sampleCourses = [
  {
    title: "Quranic Studies 101",
    description: "An introductory course to the fundamental principles of Quranic interpretation and recitation.",
    imageUrl: "/quran img 5.jpg",
    icon: <BookUser className="w-8 h-8 text-primary" />,
  },
  {
    title: "Advanced Tajweed",
    description: "Master the art of Quranic recitation with in-depth lessons on the rules of Tajweed.",
    imageUrl: "/close-up-islamic-new-year-with-quran-book.jpg",
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Islamic History",
    description: "Explore the rich history of Islam, from the time of the Prophet to the modern era.",
    imageUrl: "/public/3696932.jpg",
    icon: <BookUser className="w-8 h-8 text-primary" />,
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
