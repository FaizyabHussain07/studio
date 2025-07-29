

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const sampleCourses = [
    {
        id: "basic-qaida-for-kid",
        title: "Basic Qaida for kid",
        description: "Foundational course for children to learn the basic rules of reading the Quran.",
        imageUrl: "https://images.unsplash.com/photo-1594910196905-5735b54a5a57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjaGlsZCUyMHJlYWRpbmd8ZW58MHx8fHwxNzUzNzY4NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "child reading",
    },
    {
        id: "qaida-revision",
        title: "Qaida Revision",
        description: "A revision course to solidify the rules of Qaida for accurate Quranic recitation.",
        imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMGJvb2tzfGVufDB8fHx8MTc1Mzc2ODQ5NHww&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "study books",
    },
    {
        id: "quran-reading",
        title: "Quran Reading",
        description: "Learn to read the Holy Quran with proper pronunciation and fluency.",
        imageUrl: "https://images.unsplash.com/photo-1621160105007-727ca40f26a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8cXVyYW4lMjByZWFkaW5nfGVufDB8fHx8MTc1Mzc1Nzc0NHww&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "quran reading",
    },
    {
        id: "quran-reading-revision",
        title: "Quran Reading Revision",
        description: "Revise and perfect your Quranic reading skills with guided practice.",
        imageUrl: "https://images.unsplash.com/photo-1582159073167-2a14a3857f0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxyZWxpZ2lvdXMlMjB0ZXh0fGVufDB8fHx8MTc1Mzc2ODQ5NHww&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "religious text",
    },
    {
        id: "quran-with-tajweed",
        title: "Quran with Tajweed",
        description: "Master the art of Quranic recitation with the correct rules of Tajweed.",
        imageUrl: "https://images.unsplash.com/photo-1609599595249-1a3b83f4be5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3NxdWUlMjBhcmNoaXRlY3R1cmV8ZW58MHx8fHwxNzUzNzY4NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "mosque architecture",
    },
    {
        id: "quran-with-tajweed-revision",
        title: "Quran with Tajweed Revision",
        description: "A comprehensive revision course for all the rules of Tajweed.",
        imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb2Rpbmd8ZW58MHx8fHwxNzUzNzY4NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "coding",
    },
    {
        id: "hifz-ul-quran",
        title: "Hifz-ul-Quran",
        description: "This course is for students who want to memorize the Holy Quran by heart.",
        imageUrl: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtZW1vcml6YXRpb258ZW58MHx8fHwxNzUzNzY4NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "memorization",
    },
    {
        id: "hifz-ul-quran-revision",
        title: "Hifz-ul-Quran Revision",
        description: "Revise your memorization of the Quran to ensure long-term retention.",
        imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyZXZpc2lvbiUyMHN0dWR5fGVufDB8fHx8MTc1Mzc2ODQ5NHww&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "revision study",
    },
    {
        id: "diniyat-for-kids",
        title: "Diniyat for kids/Basic Diniyat",
        description: "Fundamental Islamic knowledge for children, covering basics of faith and practice.",
        imageUrl: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsZWFybmluZyUyMGNsYXNzfGVufDB8fHx8MTc1Mzc2ODQ5NXww&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "learning class",
    },
    {
        id: "diniyat-for-kids-revision",
        title: "Diniyat for kids/Basic Diniyat Revision",
        description: "A revision course to reinforce the foundational concepts of Diniyat.",
        imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxncm91cCUyMHN0dWR5fGVufDB8fHx8MTc1Mzc2ODQ5NXww&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "group study",
    },
    {
        id: "advanced-diniyat",
        title: "Advanced Diniyat",
        description: "An in-depth study of Islamic sciences for advanced learners.",
        imageUrl: "https://images.unsplash.com/photo-1517414442328-3693a72e81d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhZHZhbmNlZCUyMGxlYXJuaW5nfGVufDB8fHx8MTc1Mzc2ODQ5NXww&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "advanced learning",
    },
    {
        id: "advanced-diniyat-revision",
        title: "Advanced Diniyat Revision",
        description: "Revise complex topics in Islamic studies to deepen your understanding.",
        imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxleGFtJTIwcHJlcGFyYXRpb258ZW58MHx8fHwxNzUzNzY4NDk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
        dataAiHint: "exam preparation",
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
