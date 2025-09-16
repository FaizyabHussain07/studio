
'use client';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, BookOpen, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo } from 'react';
import { deleteResource } from "@/lib/services";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ResourceForm } from "@/components/forms/resource-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { Resource } from "@/lib/types";


export default function ManageResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubResources = onSnapshot(collection(db, 'resources'), snapshot => {
        const resourcesData = snapshot.docs.map(doc => {
            const data = doc.data();
            return { 
                id: doc.id, 
                ...data,
                pages: data.pages || [] // Ensure pages is always an array
            } as Resource;
        });
        setResources(resourcesData);
        setLoading(false);
    });
    
    return () => unsubResources();
  }, [toast]);

  const handleEdit = (resource: Resource) => {
      setSelectedResource(resource);
      setIsFormOpen(true);
  }

  const handleCreate = () => {
      setSelectedResource(null);
      setIsFormOpen(true);
  }
  
  const handleDelete = async (resourceId: string) => {
    try {
        await deleteResource(resourceId);
        toast({ title: "Success", description: "Resource deleted successfully." });
    } catch (error) {
        console.error("Failed to delete resource", error);
        toast({ title: "Error", description: "Could not delete resource.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Manage Library Resources</h1>
        <p className="text-muted-foreground">Add, edit, and manage the books in your digital library.</p>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle>{selectedResource ? 'Edit Resource' : 'Create New Resource'}</DialogTitle>
                <DialogDescription>
                  {selectedResource ? 'Edit the book details and manage its pages.' : 'Fill in the details for the book below. You can add pages after creating it.'}
                </DialogDescription>
            </DialogHeader>
            <ResourceForm resource={selectedResource} onFinished={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
           <div className="flex items-center justify-between gap-4 flex-wrap">
             <h2 className="text-xl font-semibold">All Resources</h2>
             <Button onClick={handleCreate}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Book
             </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={3} className="text-center">Loading resources...</TableCell></TableRow>
                ) : resources.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={3} className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mt-4">No Books Added Yet</h3>
                        <p className="text-muted-foreground mt-2">Get started by adding your first book to the library.</p>
                        <Button onClick={handleCreate} className="mt-6">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Book
                        </Button>
                     </TableCell>
                  </TableRow>
                ) : (
                  resources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium flex items-center gap-4">
                        {resource.coverImageUrl ? (
                           <Image src={resource.coverImageUrl} alt={resource.title} width={40} height={50} className="rounded-sm object-cover"/>
                        ) : (
                          <div className="w-10 h-[50px] bg-secondary rounded-sm flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-muted-foreground"/>
                          </div>
                        )}
                        <div>
                            <p>{resource.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{resource.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{Array.isArray(resource.pages) ? resource.pages.length : 0}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(resource)}>Edit</DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive cursor-pointer">Delete</DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete this book and all its pages. This action cannot be undone.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(resource.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
