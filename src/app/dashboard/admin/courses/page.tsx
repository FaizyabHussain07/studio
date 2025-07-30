
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, PlusCircle, Search, Users, FileText, BookOpen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback } from "react";
import { deleteCourse } from "@/lib/services";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CourseForm } from "@/components/forms/course-form";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const isValidImageUrl = (url: string | undefined | null): url is string => {
    if (!url || typeof url !== 'string') return false;
    return url.startsWith('/') || url.startsWith('https://');
}

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const coursesUnsub = onSnapshot(collection(db, 'courses'), (coursesSnapshot) => {
        setCourses(coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
    }, (error) => {
        console.error("Error fetching courses:", error);
        toast({ title: "Error", description: "Could not load courses.", variant: "destructive" });
        setLoading(false);
    });

    const studentsQuery = query(collection(db, "users"), where("role", "==", "student"));
    const studentsUnsub = onSnapshot(studentsQuery, (studentsSnapshot) => {
        setStudents(studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
        console.error("Error fetching students:", error);
        toast({ title: "Error", description: "Could not load students.", variant: "destructive" });
    });

    const assignmentsUnsub = onSnapshot(collection(db, 'assignments'), snapshot => {
        setAssignments(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    });

    const quizzesUnsub = onSnapshot(collection(db, 'quizzes'), snapshot => {
      setQuizzes(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    });

    return () => {
        coursesUnsub();
        studentsUnsub();
        assignmentsUnsub();
        quizzesUnsub();
    }
  }, [toast]);
  
  const coursesWithDetails = useMemo(() => {
    return courses.map(course => {
        const studentCount = (course.enrolledStudentIds?.length || 0);
        const assignmentCount = assignments.filter(a => a.courseId === course.id).length;
        const quizCount = quizzes.filter(q => q.courseId === course.id).length;
        
        return {
            ...course,
            studentCount,
            assignmentCount,
            quizCount,
        };
    });
  }, [courses, assignments, quizzes]);


  const handleEdit = (course: any) => {
    setSelectedCourse(course);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedCourse(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    try {
        await deleteCourse(courseId);
        toast({ title: "Success", description: "Course deleted successfully." });
    } catch(error: any) {
        console.error("Failed to delete course:", error);
        toast({ title: "Error", description: "Could not delete course.", variant: "destructive" });
    }
  };
  
  const onFormFinished = () => {
      setIsFormOpen(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Manage Courses</h1>
        <p className="text-muted-foreground">Create, edit, and manage all academic and Quranic courses.</p>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{selectedCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
                <DialogDescription>
                  Fill in the details below. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <CourseForm course={selectedCourse} students={students} onFinished={onFormFinished}/>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative w-full sm:w-auto sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-8" />
          </div>
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Course
          </Button>
      </div>

      {loading ? <p className="text-center text-muted-foreground py-8">Loading courses...</p> : (
        coursesWithDetails.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
             <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
             <h3 className="text-xl font-semibold mt-4">No courses created yet.</h3>
             <p className="text-muted-foreground mt-2">Get started by adding your first course.</p>
             <Button onClick={handleCreate} className="mt-6">
                 <PlusCircle className="mr-2 h-4 w-4" /> Add Course
             </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {coursesWithDetails.map(course => {
                const imageUrl = isValidImageUrl(course.imageUrl) ? course.imageUrl : 'https://placehold.co/600x400.png';
                return (
                  <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="p-0">
                      <div className="relative aspect-video">
                        <Image 
                          src={imageUrl}
                          alt={course.name}
                          fill
                          className="rounded-t-lg object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          data-ai-hint={course.dataAiHint || ''}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow p-6 space-y-4">
                       <div className="flex items-start justify-between">
                          <div>
                              <CardTitle className="font-headline text-xl">{course.name}</CardTitle>
                              <CardDescription className="mt-1 line-clamp-3">{course.description}</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEdit(course)}>Edit Course</DropdownMenuItem>
                              <DropdownMenuItem>Manage Students</DropdownMenuItem>
                              <DropdownMenuItem>View Assignments</DropdownMenuItem>
                               <DropdownMenuItem>View Quizzes</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive cursor-pointer">Delete Course</DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the course and all associated data, including assignments, quizzes, and submissions.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(course.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                       </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4 bg-secondary/50">
                      <div className="flex items-center gap-1.5" title={`${course.studentCount} Student(s)`}>
                          <Users className="h-4 w-4" />
                          <span>{course.studentCount}</span>
                      </div>
                       <div className="flex items-center gap-1.5" title={`${course.assignmentCount} Assignment(s)`}>
                          <FileText className="h-4 w-4" />
                          <span>{course.assignmentCount}</span>
                       </div>
                       <div className="flex items-center gap-1.5" title={`${course.quizCount} Quizz(es)`}>
                          <FileText className="h-4 w-4" />
                          <span>{course.quizCount}</span>
                       </div>
                    </CardFooter>
                  </Card>
                )
            })}
          </div>
        )
      )}
    </div>
  );
}
