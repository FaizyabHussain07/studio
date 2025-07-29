
'use client';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, StickyNote, Download, Link as LinkIcon, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo } from 'react';
import { getStudentUsers, deleteNote } from "@/lib/services";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NoteForm } from "@/components/forms/note-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ManageNotesPage() {
  const [notes, setNotes] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
        try {
            const studentsData = await getStudentUsers();
            setStudents(studentsData);
        } catch (error) {
            console.error("Error fetching students:", error);
            toast({ title: "Error", description: "Could not load students.", variant: "destructive" });
        }
    };
    fetchStudents();

    const unsubNotes = onSnapshot(collection(db, 'notes'), snapshot => {
        setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
    });
    
    return () => unsubNotes();
  }, [toast]);
  
  const processedNotes = useMemo(() => {
    return notes.map(note => {
      const assignedCount = note.assignedStudentIds?.length || 0;
      return {
        ...note,
        assignedCount,
        studentNames: note.assignedStudentIds?.map(id => students.find(s => s.id === id)?.name || 'Unknown').join(', ')
      };
    });
  }, [notes, students]);

  const handleEdit = (note) => {
      setSelectedNote(note);
      setIsFormOpen(true);
  }

  const handleCreate = () => {
      setSelectedNote(null);
      setIsFormOpen(true);
  }
  
  const handleDelete = async (noteId) => {
    try {
        await deleteNote(noteId);
        toast({ title: "Success", description: "Note deleted successfully." });
    } catch (error) {
        console.error("Failed to delete note", error);
        toast({ title: "Error", description: "Could not delete note.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Manage Notes</h1>
        <p className="text-muted-foreground">Create, distribute, and manage notes for your students.</p>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>{selectedNote ? 'Edit Note' : 'Create New Note'}</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create or update a note.
                </DialogDescription>
            </DialogHeader>
            <NoteForm students={students} note={selectedNote} onFinished={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
           <div className="flex items-center justify-between gap-4 flex-wrap">
             <h2 className="text-xl font-semibold">All Notes</h2>
             <Button onClick={handleCreate}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Note
             </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Content Type</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center">Loading notes...</TableCell></TableRow>
                ) : processedNotes.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={4} className="text-center py-12">
                        <StickyNote className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mt-4">No Notes Yet</h3>
                        <p className="text-muted-foreground mt-2">Get started by creating your first note for students.</p>
                        <Button onClick={handleCreate} className="mt-6">
                            <PlusCircle className="mr-2 h-4 w-4" /> Create Note
                        </Button>
                     </TableCell>
                  </TableRow>
                ) : (
                  processedNotes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell className="font-medium">
                        <p>{note.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{note.description}</p>
                      </TableCell>
                      <TableCell>
                        {note.fileDataUrl ? (
                            <div className="flex items-center gap-2">
                                <Download className="h-4 w-4 text-primary"/>
                                <span>File</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <LinkIcon className="h-4 w-4 text-accent"/>
                                <span>URL</span>
                            </div>
                        )}
                      </TableCell>
                       <TableCell>
                         <div className="flex items-center gap-2">
                            <Users className="h-4 w-4"/>
                            <span title={note.studentNames}>{note.assignedCount} student(s)</span>
                         </div>
                       </TableCell>
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
                            <DropdownMenuItem onClick={() => handleEdit(note)}>Edit</DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive cursor-pointer">Delete</DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete this note. This action cannot be undone.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(note.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
