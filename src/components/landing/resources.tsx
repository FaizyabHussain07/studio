

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";

const sampleResources = [
    {
        id: "holy-quran",
        title: "The Holy Quran",
        description: "The central religious text of Islam, which Muslims believe to be a revelation from God.",
        imageUrl: "https://i.ibb.co/Hfc2SKFN/close-up-islamic-new-year-with-quran-book.jpg",
        dataAiHint: "holy quran",
        pdfUrl: "/placeholder.pdf" 
    },
    {
        id: "noorani-qaida",
        title: "Noorani Qaida",
        description: "A basic book for beginners to learn how to read the Quran with Tajweed.",
        imageUrl: "https://i.ibb.co/FN7JFYq/close-up-islamic-new-year-with-quran-book-1.jpg",
        dataAiHint: "qaida book",
        pdfUrl: "/placeholder.pdf"
    },
    {
        id: "basic-diniyat",
        title: "Basic Diniyat",
        description: "Fundamental Islamic knowledge covering the basics of faith, worship, and daily life.",
        imageUrl: "https://i.ibb.co/ymSBrR0W/close-up-islamic-new-year-with-quran-book-2.jpg",
        dataAiHint: "islamic knowledge",
        pdfUrl: "/placeholder.pdf"
    },
];

export default function Resources() {
  return (
    <section id="resources" className="bg-background py-20 md:py-32">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Digital Library & Resources</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access essential Islamic texts and learning materials. Download PDFs to study anytime, anywhere.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleResources.map((resource) => (
            <Card key={resource.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300 overflow-hidden">
               <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    <Image 
                      src={resource.imageUrl}
                      alt={resource.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      data-ai-hint={resource.dataAiHint}
                    />
                  </div>
                </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="font-headline text-xl mb-2">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild className="w-full">
                  <a href={resource.pdfUrl} download>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
