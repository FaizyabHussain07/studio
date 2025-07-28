
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, PlusCircle, Search, Users, FileText } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { deleteCourse } from "@/lib/services";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CourseForm } from "@/components/forms/course-form";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const unsubs = [
      onSnapshot(query(collection(db, "users"), where("role", "==", "student")), snapshot => {
        setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }),
      onSnapshot(collection(db, 'courses'), snapshot => {
        setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      }),
      onSnapshot(collection(db, 'assignments'), snapshot => {
        setAssignments(snapshot.docs.map(doc => doc.data()));
      }),
      onSnapshot(collection(db, 'quizzes'), snapshot => {
        setQuizzes(snapshot.docs.map(doc => doc.data()));
      }),
    ];

    return () => unsubs.forEach(unsub => unsub());
  }, []);

  const coursesWithDetails = useMemo(() => {
      const assignmentsByCourse = assignments.reduce((acc, assignment) => {
          acc[assignment.courseId] = (acc[assignment.courseId] || 0) + 1;
          return acc;
      }, {});

      const quizzesByCourse = quizzes.reduce((acc, quiz) => {
          acc[quiz.courseId] = (acc[quiz.courseId] || 0) + 1;
          return acc;
      }, {});
      
      return courses.map(course => ({
        ...course,
        assignmentCount: assignmentsByCourse[course.id] || 0,
        quizCount: quizzesByCourse[course.id] || 0,
        studentCount: course.studentIds?.length || 0,
      }));
  }, [courses, assignments, quizzes]);


  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedCourse(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (courseId) => {
    try {
        await deleteCourse(courseId);
        toast({ title: "Success", description: "Course deleted successfully." });
    } catch(error) {
        console.error("Failed to delete course", error);
        toast({ title: "Error", description: "Could not delete course.", variant: "destructive" });
    }
  };

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
            <CourseForm course={selectedCourse} students={students} onFinished={() => setIsFormOpen(false)}/>
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
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
             <h3 className="text-xl font-semibold">No courses created yet.</h3>
             <p className="text-muted-foreground mt-2">Get started by adding your first course.</p>
             <Button onClick={handleCreate} className="mt-4">
                 <PlusCircle className="mr-2 h-4 w-4" /> Add Course
             </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {coursesWithDetails.map(course => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader className="p-0">
                  <Image 
                    src={course.imageUrl || "https://placehold.co/600x400.png"}
                    alt={course.name}
                    width={600}
                    height={400}
                    className="rounded-t-lg object-cover aspect-video"
                    data-ai-hint="education learning"
                  />
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
                                    This action cannot be undone. This will permanently delete the course and all associated data.
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
                <CardFooter className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                  <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.studentCount} Student{course.studentCount !== 1 ? 's' : ''}</span>
                  </div>
                   <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{course.assignmentCount} Assignment{course.assignmentCount !== 1 ? 's' : ''}</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{course.quizCount} Quiz{course.quizCount !== 1 ? 's' : ''}</span>
                   </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
}
