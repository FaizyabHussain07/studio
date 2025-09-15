
'use client';

import { notFound } from "next/navigation";
import { allResources } from "../page";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Download, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useState, useMemo } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";

export default function BookViewerPage({ params }: { params: { id: string } }) {
    const resource = allResources.find((r) => r.id === params.id);
    const isMobile = useIsMobile();

    const [currentPage, setCurrentPage] = useState(0);

    if (!resource) {
        notFound();
    }

    const pagesToShow = isMobile ? 1 : 2;
    const totalSpreads = Math.ceil(resource.pages / pagesToShow);
    const currentSpread = Math.floor(currentPage / pagesToShow);

    const pageImages = useMemo(() => 
        Array.from({ length: resource.pages }, (_, i) => `https://picsum.photos/seed/${resource.id}-${i + 1}/800/1100`),
        [resource.id, resource.pages]
    );

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + pagesToShow, resource.pages - pagesToShow));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - pagesToShow, 0));
    };
    
    const canGoNext = currentPage + pagesToShow < resource.pages;
    const canGoPrev = currentPage > 0;

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
                    
                    <div className="flex flex-col items-center gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl">
                             {pageImages.slice(currentPage, currentPage + pagesToShow).map((pageUrl, index) => (
                               <Card key={pageUrl} className="overflow-hidden shadow-lg w-full">
                                 <div className="relative aspect-[8/11] w-full">
                                   <Image
                                        src={pageUrl}
                                        alt={`Page ${currentPage + index + 1} of ${resource.title}`}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1024px"
                                        priority={currentPage + index < 2}
                                   />
                                 </div>
                               </Card>
                            ))}
                        </div>
                        <div className="flex items-center justify-center gap-4 w-full">
                            <Button variant="outline" onClick={handlePrevPage} disabled={!canGoPrev}>
                                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                            </Button>
                            <div className="text-sm text-muted-foreground font-medium">
                                Page {currentPage + 1}{pagesToShow > 1 && currentPage + 2 <= resource.pages ? ` - ${currentPage + 2}`: ''} of {resource.pages}
                            </div>
                            <Button variant="outline" onClick={handleNextPage} disabled={!canGoNext}>
                                Next <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    )
}
