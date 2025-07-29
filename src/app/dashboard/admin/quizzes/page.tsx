
'use client';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, GraduationCap } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo } from 'react';
import { getCourses, deleteQuiz } from "@/lib/services";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuizForm } from "@/components/forms/quiz-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Quiz = {
    id: string;
    title: string;
    courseId: string;
    externalUrl: string;
};

type Course = {
    id: string;
    name?: string;
};

export default function ManageQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const { toast } = useToast();

   useEffect(() => {
    const unsubCourses = onSnapshot(collection(db, 'courses'), snapshot => {
        setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
    });

    const unsubQuizzes = onSnapshot(collection(db, 'quizzes'), snapshot => {
        setQuizzes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz)));
        setLoading(false);
    });

    return () => {
        unsubCourses();
        unsubQuizzes();
    };
  }, []);

  const processedQuizzes = useMemo(() => {
    return quizzes.map(quiz => {
      const course = courses.find(c => c.id === quiz.courseId);
      return {
        ...quiz,
        courseName: course ? course.name : "Unknown Course",
      };
    }).filter(q => q.courseName !== "Unknown Course");
  }, [quizzes, courses]);


  const handleEdit = (quiz: Quiz) => {
      setSelectedQuiz(quiz);
      setIsFormOpen(true);
  }

  const handleCreate = () => {
      setSelectedQuiz(null);
      setIsFormOpen(true);
  }
  
  const handleDelete = async (quizId: string) => {
    try {
        await deleteQuiz(quizId);
        toast({ title: "Success", description: "Quiz deleted successfully." });
    } catch (error) {
        console.error("Failed to delete quiz", error);
        toast({ title: "Error", description: "Could not delete quiz.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Manage Quizzes</h1>
        <p className="text-muted-foreground">Create, edit, and oversee all quizzes for your courses.</p>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{selectedQuiz ? 'Edit Quiz' : 'Create New Quiz'}</DialogTitle>
                <DialogDescription>
                  Fill in the details below. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <QuizForm courses={courses} quiz={selectedQuiz} onFinished={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
           <div className="flex items-center justify-between">
             <h2 className="text-xl font-semibold">All Quizzes</h2>
             <Button onClick={handleCreate} variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Quiz
             </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center">Loading quizzes...</TableCell></TableRow>
                ) : processedQuizzes.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center">No quizzes found.</TableCell></TableRow>
                ) : (
                  processedQuizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell className="font-medium">{quiz.title}</TableCell>
                      <TableCell>{quiz.courseName}</TableCell>
                      <TableCell>
                        <a href={quiz.externalUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Take Quiz
                        </a>
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
                            <DropdownMenuItem onClick={() => handleEdit(quiz)}>Edit</DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive cursor-pointer">Delete</DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete the quiz. This action cannot be undone.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(quiz.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
