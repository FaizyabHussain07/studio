

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookUser, BrainCircuit, Clock, Star, Users } from "lucide-react";
import { Badge } from "../ui/badge";

const sampleCourses = [
    {
        id: "basic-qaida-for-kid",
        title: "Basic Qaida for Kids",
        description: "Learn the foundation of Qur’anic reading.",
        imageUrl: "https://i.ibb.co/MxXvn01D/Smiling-Child-with-Open-Quran-Thumbnail.png",
        dataAiHint: "child reading",
        duration: "3 Months",
        rating: 5,
        students: 120,
    },
    {
        id: "quran-with-tajweed",
        title: "Quran with Tajweed",
        description: "Perfect your recitation with correct pronunciation.",
        imageUrl: "https://i.ibb.co/sJWYYZ7q/Quran-Thumbnail-on-Wooden-Lectern.png",
        dataAiHint: "quran reading",
        duration: "6 Months",
        rating: 5,
        students: 250,
    },
    {
        id: "hifz-ul-quran",
        title: "Hifz-ul-Quran",
        description: "Memorize the Quran with expert guidance.",
        imageUrl: "https://i.ibb.co/cXY5rW5s/Luminous-You-Tube-Thumbnail-with-Student-and-Quran.png",
        dataAiHint: "memorization",
        duration: "3 Years",
        rating: 5,
        students: 80,
    },
    {
        id: "diniyat-courses",
        title: "Diniyat Courses",
        description: "Build your fundamental Islamic knowledge step-by-step.",
        imageUrl: "https://i.ibb.co/d023z98C/Vibrant-Classroom-with-Engaged-Students.png",
        dataAiHint: "learning class",
        duration: "1 Year",
        rating: 5,
        students: 150,
    },
];

export default function Courses() {
  return (
    <section id="courses" className="bg-secondary/50 py-20 md:py-32">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Courses</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore a range of Qur’anic and Islamic courses tailored to every level.
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      data-ai-hint={course.dataAiHint}
                    />
                  </div>
                </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="font-headline text-xl mb-2">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
                 <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                    </div>
                    <span>({course.students} students)</span>
                 </div>
                 <Badge className="mt-2" variant="secondary">{course.duration}</Badge>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild className="w-full">
                  <Link href={`/signup?courseId=${course.id}&courseName=${encodeURIComponent(course.title)}`}>
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
         <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
                <Link href="/courses">
                    View All Courses <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
