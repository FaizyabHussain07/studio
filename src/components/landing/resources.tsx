

'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Download, ArrowRight, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { getResources } from "@/lib/services";
import { Resource } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const resourcesData = await getResources();
        setResources(resourcesData.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <section id="resources" className="bg-background py-20 md:py-32">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Digital Library & Resources</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access essential Islamic texts and learning materials. Read online or download PDFs to study anytime, anywhere.
          </p>
        </div>

        {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="flex flex-col">
                        <CardHeader className="p-0">
                            <Skeleton className="aspect-video w-full" />
                        </CardHeader>
                        <CardContent className="p-6 flex-grow space-y-2">
                             <Skeleton className="h-6 w-3/4" />
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-5/6" />
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                            <Skeleton className="h-10 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        ) : resources.length === 0 ? (
           <Card className="text-center py-16">
             <CardTitle>The Library is Currently Empty</CardTitle>
             <CardDescription className="mt-2">Check back soon for new books and resources.</CardDescription>
           </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <Card key={resource.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="p-0">
                  <Link href={`/resources/${resource.id}`} className="relative aspect-video bg-secondary">
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
        )}

        <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="/resources">
                    View All Resources <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
