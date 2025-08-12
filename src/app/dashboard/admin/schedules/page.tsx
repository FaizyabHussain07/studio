
'use client';

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Calendar, User, BookOpen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo } from 'react';
import { getStudentUsers, getCourses, deleteSchedule } from "@/lib/services";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScheduleForm } from "@/components/forms/schedule-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from 'date-fns';

type Schedule = {
  id: string;
  studentId: string;
  courseId: string;
  classDate: string;
  classTime: string;
  title?: string;
};

type Student = {
  id: string;
  name?: string;
};

type Course = {
  id: string;
  name?: string;
};

export default function ManageSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStaticData = async () => {
        try {
            const [studentsData, coursesData] = await Promise.all([
                getStudentUsers(),
                getCourses(),
            ]);
            setStudents(studentsData as Student[]);
            setCourses(coursesData as Course[]);
        } catch (error) {
            console.error("Error fetching static data:", error);
            toast({ title: "Error", description: "Could not load students or courses.", variant: "destructive" });
        }
    };
    fetchStaticData();

    const q = query(collection(db, 'schedules'), orderBy('classDate', 'desc'));
    const unsubSchedules = onSnapshot(q, snapshot => {
        setSchedules(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Schedule)));
        setLoading(false);
    });
    
    return () => unsubSchedules();
  }, [toast]);
  
  const processedSchedules = useMemo(() => {
    return schedules.map(schedule => {
      const student = students.find(s => s.id === schedule.studentId);
      const course = courses.find(c => c.id === schedule.courseId);
      return {
        ...schedule,
        studentName: student?.name || "Unknown Student",
        courseName: course?.name || "Unknown Course",
      };
    }).filter(s => s.studentName !== "Unknown Student" && s.courseName !== "Unknown Course");
  }, [schedules, students, courses]);

  const handleEdit = (schedule: Schedule) => {
      setSelectedSchedule(schedule);
      setIsFormOpen(true);
  }

  const handleCreate = () => {
      setSelectedSchedule(null);
      setIsFormOpen(true);
  }
  
  const handleDelete = async (scheduleId: string) => {
    try {
        await deleteSchedule(scheduleId);
        toast({ title: "Success", description: "Schedule deleted successfully." });
    } catch (error) {
        console.error("Failed to delete schedule", error);
        toast({ title: "Error", description: "Could not delete schedule.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Manage Class Schedules</h1>
        <p className="text-muted-foreground">Schedule, update, and manage all student classes.</p>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>{selectedSchedule ? 'Edit Class Schedule' : 'Create New Class Schedule'}</DialogTitle>
                <DialogDescription>
                  Fill in the details below to schedule a class for a student.
                </DialogDescription>
            </DialogHeader>
            <ScheduleForm 
                students={students} 
                courses={courses}
                schedule={selectedSchedule} 
                onFinished={() => setIsFormOpen(false)} 
            />
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
           <div className="flex items-center justify-between gap-4 flex-wrap">
             <h2 className="text-xl font-semibold">All Scheduled Classes</h2>
             <Button onClick={handleCreate}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Schedule a Class
             </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center">Loading schedules...</TableCell></TableRow>
                ) : processedSchedules.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={5} className="text-center py-12">
                        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mt-4">No Classes Scheduled</h3>
                        <p className="text-muted-foreground mt-2">Get started by scheduling your first class.</p>
                        <Button onClick={handleCreate} className="mt-6">
                            <PlusCircle className="mr-2 h-4 w-4" /> Schedule a Class
                        </Button>
                     </TableCell>
                  </TableRow>
                ) : (
                  processedSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">
                        <p>{schedule.title || "Class"}</p>
                      </TableCell>
                      <TableCell>{format(new Date(schedule.classDate), 'PPP')} at {schedule.classTime}</TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground"/>
                            <span>{schedule.studentName}</span>
                         </div>
                       </TableCell>
                       <TableCell>
                         <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground"/>
                            <span>{schedule.courseName}</span>
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
                            <DropdownMenuItem onClick={() => handleEdit(schedule)}>Edit</DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive cursor-pointer">Delete</DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete this scheduled class. This action cannot be undone.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(schedule.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
