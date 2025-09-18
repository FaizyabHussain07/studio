

'use client';

import { notFound } from "next/navigation";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Download, ChevronLeft, ChevronRight, BookOpen, ListTree, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { getResource } from "@/lib/services";
import { Resource } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function BookViewerPage({ params }: { params: { id: string } }) {
    const [resource, setResource] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);
    const isMobile = useIsMobile();
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [isTocOpen, setIsTocOpen] = useState(false);
    
    // State for lightbox/modal
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerPageIndex, setViewerPageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

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
        setCurrentPageIndex((prev) => Math.min(prev + pagesToShow, totalPages - pagesToShow + (isMobile ? 0 : 1)));
    };

    const handlePrevPage = () => {
        setCurrentPageIndex((prev) => Math.max(prev - pagesToShow, 0));
    };

    const goToPage = (pageNumber: number) => {
        const pageIndex = sortedPages.findIndex(p => p.pageNumber === pageNumber);
        if(pageIndex !== -1) {
            const targetIndex = isMobile ? pageIndex : Math.floor(pageIndex / 2) * 2;
            setCurrentPageIndex(targetIndex);
            setIsTocOpen(false);
        }
    };
    
    const canGoNext = currentPageIndex + pagesToShow < totalPages;
    const canGoPrev = currentPageIndex > 0;

    // Lightbox functions
    const openViewer = (index: number) => {
        setViewerPageIndex(index);
        setIsViewerOpen(true);
    }

    const closeViewer = () => {
        setIsViewerOpen(false);
        setIsZoomed(false); // Reset zoom on close
    }

    const goToNextViewerPage = useCallback(() => {
        if (viewerPageIndex < totalPages - 1) {
            setViewerPageIndex(prev => prev + 1);
            setIsZoomed(false);
        }
    }, [viewerPageIndex, totalPages]);

    const goToPrevViewerPage = useCallback(() => {
        if (viewerPageIndex > 0) {
            setViewerPageIndex(prev => prev - 1);
            setIsZoomed(false);
        }
    }, [viewerPageIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isViewerOpen) return;
            if (e.key === 'ArrowRight') {
                goToNextViewerPage();
            } else if (e.key === 'ArrowLeft') {
                goToPrevViewerPage();
            } else if (e.key === 'Escape') {
                closeViewer();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isViewerOpen, goToNextViewerPage, goToPrevViewerPage]);
    
    const Watermark = () => (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <Image
                src="/WhatsApp_Image_2025-07-07_at_16.40.56_083d1ca9-removebg-preview.png"
                alt="Watermark"
                width={200}
                height={200}
                className="opacity-[0.2]"
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
                    <div className="mb-8 space-y-4">
                         <Button variant="ghost" asChild>
                            <Link href="/resources">
                                <ArrowLeft className="mr-2 h-4 w-4"/> Back to Library
                            </Link>
                        </Button>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <h1 className="font-headline text-4xl font-bold">{resource.title}</h1>
                                <p className="text-muted-foreground mt-1 max-w-2xl">{resource.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {resource.toc && resource.toc.length > 0 && (
                                    <Dialog open={isTocOpen} onOpenChange={setIsTocOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">
                                                <ListTree className="mr-2 h-4 w-4"/>
                                                Table of Contents
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Table of Contents</DialogTitle>
                                            </DialogHeader>
                                            <div className="max-h-96 overflow-y-auto">
                                                 <ul className="divide-y">
                                                    {resource.toc.sort((a, b) => a.startPage - b.startPage).map((item, index) => (
                                                        <li key={index}>
                                                            <button onClick={() => goToPage(item.startPage)} className="w-full text-left p-4 hover:bg-secondary/50 transition-colors flex justify-between items-center rounded-md">
                                                                <span className="font-medium">{item.title}</span>
                                                                <span className="text-muted-foreground text-sm">Page {item.startPage}</span>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}
                                {resource.pdfUrl && (
                                    <Button asChild>
                                        <a href={resource.pdfUrl} download={resource.pdfFileName}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download PDF
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                         {totalPages > 0 ? (
                            <div className="flex flex-col items-center gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                  {isMobile ? (
                                    sortedPages[currentPageIndex] && (
                                      <Card className="overflow-hidden shadow-lg w-full md:col-span-2 flex flex-col cursor-pointer" onClick={() => openViewer(currentPageIndex)}>
                                        <CardContent className="p-0 relative flex-grow">
                                            <div className="relative aspect-[8/11] w-full">
                                                <Image
                                                    src={sortedPages[currentPageIndex].imageUrl}
                                                    alt={`Page ${sortedPages[currentPageIndex].pageNumber} of ${resource.title}`}
                                                    fill
                                                    className="object-contain"
                                                    sizes="100vw"
                                                    priority
                                                />
                                                <Watermark />
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-2 justify-center text-sm text-muted-foreground bg-secondary/50 border-t">
                                            Page {sortedPages[currentPageIndex].pageNumber}
                                        </CardFooter>
                                      </Card>
                                    )
                                  ) : (
                                    <>
                                      {sortedPages.slice(currentPageIndex, currentPageIndex + 2).map((page, index) => (
                                        <Card key={page.pageNumber} className="overflow-hidden shadow-lg w-full flex flex-col cursor-pointer" onClick={() => openViewer(currentPageIndex + index)}>
                                           <CardContent className="p-0 relative flex-grow">
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
                                           </CardContent>
                                            <CardFooter className="p-2 justify-center text-sm text-muted-foreground bg-secondary/50 border-t">
                                                Page {page.pageNumber}
                                            </CardFooter>
                                        </Card>
                                      ))}
                                    </>
                                  )}
                                </div>
                                <div className="flex items-center justify-center gap-4 w-full">
                                    <Button variant="outline" onClick={handlePrevPage} disabled={!canGoPrev}>
                                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                                    </Button>
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
            </main>
            
            {/* Fullscreen Viewer Dialog */}
            <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
                <DialogContent 
                    className="max-w-none w-screen h-screen p-0 border-0 bg-black/80 backdrop-blur-sm flex items-center justify-center overflow-auto" 
                    closeButtonClass="top-4 right-4 text-white bg-black/50 hover:bg-black/75 hover:text-white"
                >
                    {/* Previous Button */}
                    <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white bg-black/50 hover:bg-black/75 hover:text-white disabled:opacity-50 disabled:hover:bg-black/50" onClick={goToPrevViewerPage} disabled={viewerPageIndex <= 0}>
                        <ChevronLeft className="h-8 w-8" />
                    </Button>
                    
                    {/* Image Viewer */}
                    <div 
                        className="relative w-full h-full flex items-center justify-center"
                        onClick={(e) => {
                            // Only toggle zoom if clicking on the container, not the image itself when zoomed
                            if (e.target === e.currentTarget) {
                                setIsZoomed(isZoomed => !isZoomed);
                            }
                        }}
                    >
                        {sortedPages[viewerPageIndex] && (
                             <div className={cn(
                                "relative transition-transform duration-300",
                                isZoomed ? 'scale-150 cursor-grab' : 'scale-100 cursor-zoom-in'
                             )}>
                                <Image
                                    src={sortedPages[viewerPageIndex].imageUrl}
                                    alt={`Page ${sortedPages[viewerPageIndex].pageNumber}`}
                                    width={1200}
                                    height={1600}
                                    className={cn(
                                        "max-w-[80vw] max-h-[85vh] object-contain shadow-2xl",
                                        isZoomed ? "cursor-grab" : "cursor-zoom-in"
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent container click
                                        setIsZoomed(!isZoomed);
                                    }}
                                    priority
                                />
                                <Watermark />
                             </div>
                        )}
                         <p className="absolute bottom-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                            Page {sortedPages[viewerPageIndex]?.pageNumber} of {totalPages}
                        </p>
                         <Button variant="ghost" size="icon" className="absolute top-4 right-16 z-50 text-white bg-black/50 hover:bg-black/75 hover:text-white" onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}>
                             {isZoomed ? <ZoomOut className="h-6 w-6"/> : <ZoomIn className="h-6 w-6"/>}
                         </Button>
                    </div>

                    {/* Next Button */}
                     <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white bg-black/50 hover:bg-black/75 hover:text-white disabled:opacity-50 disabled:hover:bg-black/50" onClick={goToNextViewerPage} disabled={viewerPageIndex >= totalPages - 1}>
                        <ChevronRight className="h-8 w-8" />
                    </Button>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    )
}
