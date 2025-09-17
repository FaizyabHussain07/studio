
'use client';

import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, PlusCircle, X, BookOpen, Save, Trash2, GripVertical } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from 'react';
import { getResource, updateResourcePages } from "@/lib/services";
import { Resource, ResourcePage } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ManageResourcePages({ params }: { params: { id: string } }) {
    const [resource, setResource] = useState<Resource | null>(null);
    const [pages, setPages] = useState<ResourcePage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    
    useEffect(() => {
        const docRef = doc(db, "resources", params.id);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data() as Omit<Resource, 'id'>;
                const sortedPages = data.pages?.sort((a,b) => a.pageNumber - b.pageNumber) || [];
                setResource({ id: doc.id, ...data, pages: sortedPages });
                setPages(sortedPages);
            } else {
                setResource(null);
                setPages([]);
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

    const handleAddPage = () => {
        const newPageNumber = pages.length > 0 ? Math.max(...pages.map(p => p.pageNumber)) + 1 : 1;
        setPages([...pages, { pageNumber: newPageNumber, imageUrl: '' }]);
    };

    const handleRemovePage = (indexToRemove: number) => {
        setPages(pages.filter((_, index) => index !== indexToRemove));
    };

    const handlePageChange = (index: number, field: 'pageNumber' | 'imageUrl', value: string | number) => {
        const newPages = [...pages];
        if (field === 'pageNumber') {
            newPages[index][field] = Number(value);
        } else {
            newPages[index][field] = value as string;
        }
        setPages(newPages);
    };

    const handleSavePages = async () => {
        if (!resource) return;
        setIsSaving(true);
        try {
            const sortedPages = [...pages].sort((a, b) => a.pageNumber - b.pageNumber);
            await updateResourcePages(resource.id, sortedPages);
            toast({ title: "Success", description: "Book pages have been saved successfully." });
        } catch (error) {
            console.error("Error saving pages:", error);
            toast({ title: "Error", description: "Could not save the pages.", variant: "destructive" });
        } finally {
            setIsSaving(false);
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
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Manage Book Pages</CardTitle>
                        <CardDescription>Add, remove, and reorder pages by specifying a page number and image URL.</CardDescription>
                    </div>
                    <Button onClick={handleSavePages} disabled={isSaving}>
                        <Save className="mr-2 h-4 w-4"/>
                        {isSaving ? 'Saving...' : 'Save Pages'}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                     {(pages || []).length > 0 ? (
                        <div className="space-y-4">
                            {pages.map((page, index) => (
                                <div key={index} className="flex items-end gap-4 p-4 border rounded-lg">
                                    <div className="grid gap-2" style={{width: '100px'}}>
                                        <Label htmlFor={`page-num-${index}`}>Page No.</Label>
                                        <Input 
                                            id={`page-num-${index}`}
                                            type="number" 
                                            value={page.pageNumber} 
                                            onChange={(e) => handlePageChange(index, 'pageNumber', e.target.value)}
                                            className="font-mono"
                                        />
                                    </div>
                                    <div className="grid gap-2 flex-1">
                                        <Label htmlFor={`page-url-${index}`}>Image URL</Label>
                                        <Input
                                            id={`page-url-${index}`}
                                            type="url"
                                            placeholder="https://example.com/image.png"
                                            value={page.imageUrl}
                                            onChange={(e) => handlePageChange(index, 'imageUrl', e.target.value)}
                                        />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemovePage(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-8">No pages added for this book yet. Click below to start.</p>
                    )}
                     <Button variant="outline" onClick={handleAddPage} className="w-full border-dashed">
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Add Page
                    </Button>
                </CardContent>
            </Card>

        </div>
    )
}
