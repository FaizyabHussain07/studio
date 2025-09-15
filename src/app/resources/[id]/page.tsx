
import { notFound } from "next/navigation";
import { allResources } from "../page";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function BookViewerPage({ params }: { params: { id: string } }) {
    const resource = allResources.find((r) => r.id === params.id);

    if (!resource) {
        notFound();
    }

    // Generate an array of placeholder page image URLs
    const pageImages = Array.from({ length: resource.pages }, (_, i) => `https://picsum.photos/seed/${resource.id}-${i + 1}/800/1100`);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-secondary/40">
                <div className="container py-12 md:py-16">
                    <div className="mb-8">
                         <Button variant="ghost" asChild className="mb-4">
                            <Link href="/resources">
                                <ArrowLeft className="mr-2 h-4 w-4"/> Back to Library
                            </Link>
                        </Button>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="font-headline text-4xl font-bold">{resource.title}</h1>
                                <p className="text-muted-foreground mt-1 max-w-2xl">{resource.description}</p>
                            </div>
                            <Button asChild size="lg">
                                <a href={resource.pdfUrl} download>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Full PDF
                                </a>
                            </Button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-4">
                        {pageImages.map((pageUrl, index) => (
                           <Card key={index} className="overflow-hidden shadow-lg w-full max-w-4xl">
                             <div className="relative aspect-[8/11] w-full">
                               <Image
                                    src={pageUrl}
                                    alt={`Page ${index + 1} of ${resource.title}`}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1024px"
                                    priority={index < 3} // Prioritize loading the first few pages
                               />
                             </div>
                           </Card>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
