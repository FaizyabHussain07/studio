
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Library } from "lucide-react";
import { useState, useEffect } from "react";
import { getResources } from "@/lib/services";
import { Resource } from "@/lib/types";

export default function StudentLibraryPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const resourcesData = await getResources();
        setResources(resourcesData);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);


  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Library</h1>
            <p className="text-muted-foreground">
                Access essential Islamic texts and learning materials. Read online or download PDFs to study anytime, anywhere.
            </p>
        </div>

        {loading ? <p className="text-center">Loading library...</p> : (
            resources.length === 0 ? (
            <Card className="text-center p-12 flex flex-col items-center">
                <Library className="h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle>Library is Empty</CardTitle>
                <CardDescription className="mt-2">No books have been added yet. Please check back later.</CardDescription>
            </Card>
            ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {resources.map((resource) => (
                    <Card key={resource.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <CardHeader className="p-0">
                        <Link href={`/resources/${resource.id}`} target="_blank" className="relative aspect-[3/4] bg-secondary">
                            {resource.coverImageUrl ? (
                            <Image 
                                src={resource.coverImageUrl}
                                alt={resource.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                data-ai-hint={resource.dataAiHint}
                            />
                            ) : (
                            <div className="flex items-center justify-center h-full">
                                <BookOpen className="h-16 w-16 text-muted-foreground"/>
                            </div>
                            )}
                        </Link>
                        </CardHeader>
                    <CardContent className="p-6 flex-grow">
                        <CardTitle className="font-headline text-xl mb-2">{resource.title}</CardTitle>
                        <CardDescription className="line-clamp-3">{resource.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                        <Button asChild className="w-full">
                            <Link href={`/resources/${resource.id}`} target="_blank">
                                <BookOpen className="mr-2 h-4 w-4" />
                                Read Book
                            </Link>
                        </Button>
                    </CardFooter>
                    </Card>
                ))}
            </div>
            )
        )}
    </div>
  );
}
