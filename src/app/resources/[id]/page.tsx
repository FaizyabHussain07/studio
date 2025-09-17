
'use client';

import { notFound } from "next/navigation";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Download, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { getResource } from "@/lib/services";
import { Resource } from "@/lib/types";

export default function BookViewerPage({ params }: { params: { id: string } }) {
    const [resource, setResource] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);
    const isMobile = useIsMobile();
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fetchResource = async () => {
            setLoading(true);
            try {
                const resourceData = await getResource(params.id);
                setResource(resourceData);
            } catch (error) {
                console.error("Failed to fetch resource:", error);
                setResource(null);
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
    }, [params.id]);

    if (loading) {
      return (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <p>Loading book...</p>
          </main>
          <Footer />
        </div>
      );
    }
    
    if (!resource) {
        notFound();
    }

    const sortedPages = resource.pages?.sort((a,b) => a.pageNumber - b.pageNumber) || [];
    const pagesToShow = isMobile ? 1 : 2;
    const totalPages = sortedPages.length;

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + pagesToShow, totalPages - pagesToShow));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - pagesToShow, 0));
    };
    
    const canGoNext = currentPage + pagesToShow < totalPages;
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
                            {resource.pdfDataUrl && (
                                <Button asChild size="lg">
                                    <a href={resource.pdfDataUrl} download={resource.pdfFileName}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Full PDF
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                    
                     {totalPages > 0 ? (
                         <div className="flex flex-col items-center gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl">
                                {sortedPages.slice(currentPage, currentPage + pagesToShow).map((page, index) => (
                                    <Card key={page.pageNumber} className="overflow-hidden shadow-lg w-full">
                                        <div className="relative aspect-[8/11] w-full">
                                            <Image
                                                src={page.imageUrl}
                                                alt={`Page ${page.pageNumber} of ${resource.title}`}
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 768px) 100vw, 50vw"
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
                                    Page {currentPage + 1}{pagesToShow > 1 && currentPage + 2 <= totalPages ? ` - ${currentPage + 2}`: ''} of {totalPages}
                                </div>
                                <Button variant="outline" onClick={handleNextPage} disabled={!canGoNext}>
                                    Next <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                     ) : (
                        <Card className="text-center p-12 flex flex-col items-center">
                            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold">No Pages Available</h3>
                            <p className="text-muted-foreground mt-2">The pages for this book have not been uploaded yet.</p>
                        </Card>
                     )}

                </div>
            </main>
            <Footer />
        </div>
    )
}
