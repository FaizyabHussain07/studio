
'use client';

import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileUp, X, GripVertical, Image as ImageIcon, BookOpen } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from 'react';
import { getResource, updateResourcePages } from "@/lib/services";
import { Resource, ResourcePage } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

export default function ManageResourcePages({ params }: { params: { id: string } }) {
    const [resource, setResource] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    
    useEffect(() => {
        const docRef = doc(db, "resources", params.id);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data() as Omit<Resource, 'id'>;
                const sortedPages = data.pages?.sort((a,b) => a.pageNumber - b.pageNumber) || [];
                setResource({ id: doc.id, ...data, pages: sortedPages });
            } else {
                setResource(null);
                 toast({ title: "Error", description: "This resource could not be found.", variant: "destructive" });
                 router.push('/dashboard/admin/resources');
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching resource:", error);
            setLoading(false);
            toast({ title: "Error", description: "Could not load resource data.", variant: "destructive" });
        });

        return () => unsubscribe();
    }, [params.id, toast, router]);

    const handlePageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !resource) return;

        setIsUploading(true);
        const files = Array.from(e.target.files);
        const currentPages = resource.pages || [];
        const newPages = [...currentPages];
        let lastPageNumber = currentPages.length > 0 ? Math.max(...currentPages.map(p => p.pageNumber)) : 0;
        
        try {
            for (const file of files) {
                const imageUrl = await fileToDataUrl(file);
                lastPageNumber++;
                newPages.push({ pageNumber: lastPageNumber, imageUrl });
            }
            await updateResourcePages(resource.id, newPages);
            toast({ title: "Success", description: `${files.length} page(s) uploaded and saved successfully.` });
        } catch (error) {
            toast({ title: "Error reading files", description: "Could not process all selected page images.", variant: "destructive" });
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const handleRemovePage = async (pageNumberToRemove: number) => {
        if (!resource) return;
        const updatedPages = resource.pages
            .filter(p => p.pageNumber !== pageNumberToRemove)
            .map((p, index) => ({ ...p, pageNumber: index + 1 })); // Re-order page numbers
        
        try {
            await updateResourcePages(resource.id, updatedPages);
            toast({ title: "Page Removed", description: "The page has been removed successfully."});
        } catch (error) {
            toast({ title: "Error", description: "Could not remove the page.", variant: "destructive"});
        }
    };

    if (loading) {
      return (
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 flex items-center justify-center">
            <p>Loading resource...</p>
          </main>
        </div>
      );
    }
    
    if (!resource) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <Button variant="ghost" asChild>
                <Link href="/dashboard/admin/resources">
                    <ArrowLeft className="mr-2 h-4 w-4"/> Back to All Resources
                </Link>
            </Button>
            <div className="flex items-start gap-6">
                 {resource.coverImageUrl ? (
                    <Image src={resource.coverImageUrl} alt={resource.title} width={100} height={140} className="rounded-md object-cover"/>
                ) : (
                    <div className="w-[100px] h-[140px] bg-secondary rounded-md flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground"/>
                    </div>
                )}
                <div>
                    <h1 className="font-headline text-4xl font-bold">{resource.title}</h1>
                    <p className="text-muted-foreground mt-1 max-w-2xl">{resource.description}</p>
                </div>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle>Manage Book Pages</CardTitle>
                    <CardDescription>Upload one or more images for the book's pages. Pages are automatically saved and ordered.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
                        <FileUp className="h-10 w-10 text-muted-foreground mb-2"/>
                        <p className="text-muted-foreground">Drag & drop page images here, or</p>
                        <Button variant="link" className="p-0 h-auto" type="button" disabled={isUploading}>
                            <label htmlFor="pages-upload" className="cursor-pointer">
                               {isUploading ? 'Uploading...' : 'click to browse'}
                            </label>
                        </Button>
                        <input id="pages-upload" type="file" className="sr-only" onChange={handlePageFilesChange} disabled={isUploading} multiple accept="image/*"/>
                    </div>

                    {(resource.pages?.length || 0) > 0 ? (
                        <div className="space-y-2">
                            <h4 className="font-medium">Uploaded Pages ({resource.pages.length})</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {resource.pages.map((page, index) => (
                                    <Card key={page.imageUrl} className="relative group p-2">
                                        <div className="relative aspect-[8/11] w-full overflow-hidden rounded-md bg-secondary">
                                            <Image src={page.imageUrl} alt={`Page ${page.pageNumber}`} fill className="object-contain" />
                                        </div>
                                        <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button type="button" size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleRemovePage(page.pageNumber)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="absolute bottom-1 left-1 bg-background/80 px-1.5 py-0.5 rounded-full text-xs font-bold">
                                            {page.pageNumber}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-4">No pages uploaded for this book yet.</p>
                    )}
                </CardContent>
            </Card>

        </div>
    )
}
