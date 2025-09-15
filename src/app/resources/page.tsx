
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";

export const allResources = [
    {
        id: "holy-quran",
        title: "The Holy Quran",
        description: "The central religious text of Islam, which Muslims believe to be a revelation from God.",
        imageUrl: "https://i.ibb.co/Hfc2SKFN/close-up-islamic-new-year-with-quran-book.jpg",
        dataAiHint: "holy quran",
        pdfUrl: "/placeholder.pdf",
        pages: 30 // Example page count
    },
    {
        id: "noorani-qaida",
        title: "Noorani Qaida",
        description: "A basic book for beginners to learn how to read the Quran with Tajweed.",
        imageUrl: "https://i.ibb.co/FN7JFYq/close-up-islamic-new-year-with-quran-book-1.jpg",
        dataAiHint: "qaida book",
        pdfUrl: "/placeholder.pdf",
        pages: 20
    },
    {
        id: "basic-diniyat",
        title: "Basic Diniyat",
        description: "Fundamental Islamic knowledge covering the basics of faith, worship, and daily life.",
        imageUrl: "https://i.ibb.co/ymSBrR0W/close-up-islamic-new-year-with-quran-book-2.jpg",
        dataAiHint: "islamic knowledge",
        pdfUrl: "/placeholder.pdf",
        pages: 25
    },
    // Add more books here
];

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-secondary/50">
            <section id="resources-library" className="py-20 md:py-32">
            <div className="container">
                <div className="mb-12">
                     <Button variant="ghost" asChild className="mb-4">
                        <Link href="/#resources">
                            <ArrowLeft className="mr-2 h-4 w-4"/> Back to Home
                        </Link>
                    </Button>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">Digital Library</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mt-2">
                        Access essential Islamic texts and learning materials. Read online or download PDFs to study anytime, anywhere.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allResources.map((resource) => (
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
                          <Link href={`/resources/${resource.id}`}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Read Book
                          </Link>
                        </Button>
                    </CardFooter>
                    </Card>
                ))}
                </div>
            </div>
            </section>
        </main>
        <Footer />
    </div>
  );
}
