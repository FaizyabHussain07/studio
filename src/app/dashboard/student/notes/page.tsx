

'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StickyNote, Download, Link as LinkIcon, File } from "lucide-react";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";

type Note = {
    id: string;
    name: string;
    description?: string;
    fileDataUrl?: string;
    fileName?: string;
    externalUrl?: string;
};

export default function AllNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    setLoading(true);

    const notesQuery = query(collection(db, "notes"), where('assignedStudentIds', 'array-contains', user.uid));
    const unsubNotes = onSnapshot(notesQuery, (snapshot) => {
        const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
        setNotes(notesData);
        setLoading(false);
    });
    
    return () => unsubNotes();
  }, [user]);


  if (loading) {
    return <div className="text-center p-8">Loading your notes...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Notes</h1>
        <p className="text-muted-foreground">A collection of all notes shared with you by your instructor.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length > 0 ? notes.map(note => (
            <Card key={note.id} className="flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                        <StickyNote className="h-6 w-6 text-primary"/>
                        {note.name}
                    </CardTitle>
                    <CardDescription className="pt-1">{note.description || 'No description provided.'}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow p-6 pt-0">
                   {note.fileDataUrl ? (
                        <div className="border rounded-lg p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <File className="h-6 w-6 flex-shrink-0 text-primary" />
                                <span className="text-sm font-medium truncate" title={note.fileName}>{note.fileName}</span>
                            </div>
                            <Button size="icon" variant="ghost" asChild>
                               <a href={note.fileDataUrl} download={note.fileName}>
                                   <Download />
                               </a>
                            </Button>
                        </div>
                   ) : note.externalUrl ? (
                         <Button asChild className="w-full">
                           <a href={note.externalUrl} target="_blank" rel="noopener noreferrer">
                                <LinkIcon className="mr-2 h-4 w-4"/>
                                View Note
                           </a>
                         </Button>
                   ) : (
                        <p className="text-sm text-muted-foreground">No content attached to this note.</p>
                   )}
                </CardContent>
            </Card>
        )) : (
            <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg bg-card">
                 <StickyNote className="mx-auto h-12 w-12 text-muted-foreground" />
                 <h3 className="text-xl font-semibold mt-4">No Notes Available</h3>
                 <p className="text-muted-foreground mt-2">Your instructor hasn't shared any notes with you yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}
