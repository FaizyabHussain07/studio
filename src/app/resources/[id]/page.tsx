
'use client';

import { notFound } from "next/navigation";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Download, ChevronLeft, ChevronRight, BookOpen, ListTree } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

    const sortedPages = resource?.pages?.sort((a,b) => a.pageNumber - b.pageNumber) || [];
    const pagesToShow = isMobile ? 1 : 2;
    const totalPages = sortedPages.length;

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + pagesToShow, totalPages - pagesToShow + (isMobile ? 0 : 1)));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - pagesToShow, 0));
    };

    const goToPage = (pageNumber: number) => {
        // Find the index of the page with the given page number
        const pageIndex = sortedPages.findIndex(p => p.pageNumber === pageNumber);
        if(pageIndex !== -1) {
            // In two-page view, we want to land on an even-numbered index to show pages correctly (e.g., 0, 2, 4...)
            const targetIndex = isMobile ? pageIndex : Math.floor(pageIndex / 2) * 2;
            setCurrentPage(targetIndex);
        }
    };
    
    const canGoNext = currentPage + pagesToShow < totalPages;
    const canGoPrev = currentPage > 0;
    
    const Watermark = () => (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <Image
                src="/WhatsApp_Image_2025-07-07_at_16.40.56_083d1ca9-removebg-preview.png"
                alt="Watermark"
                width={200}
                height={200}
                className="opacity-[0.15]"
            />
        </div>
    );

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
                            {resource.pdfUrl && (
                                <Button asChild size="lg">
                                    <a href={resource.pdfUrl} download={resource.pdfFileName}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Full PDF
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                         {resource.toc && resource.toc.length > 0 && (
                            <div className="lg:col-span-1">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <ListTree className="h-5 w-5"/>
                                            Table of Contents
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <ul className="divide-y">
                                            {resource.toc.sort((a, b) => a.startPage - b.startPage).map((item, index) => (
                                                <li key={index}>
                                                    <button onClick={() => goToPage(item.startPage)} className="w-full text-left p-4 hover:bg-secondary/50 transition-colors flex justify-between items-center">
                                                        <span>{item.title}</span>
                                                        <span className="text-muted-foreground text-sm">{item.startPage}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                        
                        <div className={resource.toc && resource.toc.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}>
                             {totalPages > 0 ? (
                                <div className="flex flex-col items-center gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                      {isMobile ? (
                                        sortedPages[currentPage] && (
                                          <Card className="overflow-hidden shadow-lg w-full md:col-span-2 relative">
                                            <div className="relative aspect-[8/11] w-full">
                                              <Image
                                                src={sortedPages[currentPage].imageUrl}
                                                alt={`Page ${sortedPages[currentPage].pageNumber} of ${resource.title}`}
                                                fill
                                                className="object-contain"
                                                sizes="100vw"
                                                priority
                                              />
                                              <Watermark />
                                            </div>
                                          </Card>
                                        )
                                      ) : (
                                        <>
                                          {sortedPages.slice(currentPage, currentPage + 2).map((page) => (
                                            <Card key={page.pageNumber} className="overflow-hidden shadow-lg w-full relative">
                                              <div className="relative aspect-[8/11] w-full">
                                                <Image
                                                  src={page.imageUrl}
                                                  alt={`Page ${page.pageNumber} of ${resource.title}`}
                                                  fill
                                                  className="object-contain"
                                                  sizes="50vw"
                                                  priority={page.pageNumber <= 2}
                                                />
                                                <Watermark />
                                              </div>
                                            </Card>
                                          ))}
                                        </>
                                      )}
                                    </div>
                                    <div className="flex items-center justify-center gap-4 w-full">
                                        <Button variant="outline" onClick={handlePrevPage} disabled={!canGoPrev}>
                                            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                                        </Button>
                                        <div className="text-sm text-muted-foreground font-medium">
                                            Page {sortedPages[currentPage]?.pageNumber || 0}
                                            {!isMobile && sortedPages[currentPage + 1] ? ` - ${sortedPages[currentPage + 1]?.pageNumber}` : ''} of {totalPages}
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
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
