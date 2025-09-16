

'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { useState, useEffect } from "react";
import { getResources } from "@/lib/services";
import { Resource } from "@/lib/types";

export default function ResourcesPage() {
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

                {loading ? <p className="text-center">Loading library...</p> : (
                  resources.length === 0 ? (
                    <Card className="text-center p-12">
                      <h3 className="text-xl font-semibold">Library is Empty</h3>
                      <p className="text-muted-foreground mt-2">No books have been added yet. Please check back later.</p>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {resources.map((resource) => (
                          <Card key={resource.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                          <CardHeader className="p-0">
                              <div className="relative aspect-video bg-secondary">
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
                  )
                )}
            </div>
            </section>
        </main>
        <Footer />
    </div>
  );
}
