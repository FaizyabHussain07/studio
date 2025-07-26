'use client';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from 'react';
import { getCourses, getSubmissionsByAssignment, getStudentUsers, deleteAssignment } from "@/lib/services";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AssignmentForm } from "@/components/forms/assignment-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ManageAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const coursesData = await getCourses();
            setCourses(coursesData);
            const students = await getStudentUsers();
            setStudentCount(students.length);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };
    fetchInitialData();
  }, []);
  
  useEffect(() => {
    setLoading(true);
    const unsubAssignments = onSnapshot(collection(db, 'assignments'), async (snapshot) => {
        const assignmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Ensure courses and studentCount are available before processing
        const currentCourses = await getCourses();
        const students = await getStudentUsers();
        setCourses(currentCourses);
        setStudentCount(students.length);

        if (currentCourses.length > 0) {
            const assignmentsWithDetails = await Promise.all(assignmentsData.map(async (assignment) => {
              const course = currentCourses.find(c => c.id === assignment.courseId);
              const submissions = await getSubmissionsByAssignment(assignment.id);
              return {
                ...assignment,
                courseName: course ? course.name : "Unknown Course",
                submissionsCount: `${submissions.length}/${students.length}`,
              };
            }));
            setAssignments(assignmentsWithDetails);
        } else {
             setAssignments(assignmentsData.map(a => ({...a, courseName: 'N/A', submissionsCount: 'N/A'})));
        }
        setLoading(false);
    });

    return () => unsubAssignments();
  }, []);

  const handleEdit = (assignment) => {
      setSelectedAssignment(assignment);
      setIsFormOpen(true);
  }

  const handleCreate = () => {
      setSelectedAssignment(null);
      setIsFormOpen(true);
  }
  
  const handleDelete = async (assignmentId) => {
    try {
        await deleteAssignment(assignmentId);
        toast({ title: "Success", description: "Assignment deleted successfully." });
    } catch (error) {
        console.error("Failed to delete assignment", error);
        toast({ title: "Error", description: "Could not delete assignment.", variant: "destructive" });
    }
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Manage Assignments</h1>
        <p className="text-muted-foreground">Oversee all assignments, check submissions, and provide grades.</p>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <AssignmentForm courses={courses} assignment={selectedAssignment} onFinished={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
           <div className="flex items-center justify-between gap-4 flex-wrap">
             <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search assignments..." className="pl-8 w-full sm:w-auto" />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             <Button onClick={handleCreate}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Assignment
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
                  <TableHead>Due Date</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center">Loading assignments...</TableCell></TableRow>
                ) : assignments.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center">No assignments found.</TableCell></TableRow>
                ) : (
                  assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.title}</TableCell>
                      <TableCell>{assignment.courseName}</TableCell>
                      <TableCell>{assignment.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{assignment.submissionsCount}</Badge>
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
                            <DropdownMenuItem onClick={() => handleEdit(assignment)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/admin/assignments/${assignment.id}/submissions`}>View Submissions</Link>
                            </DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive cursor-pointer">Delete</DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the assignment and all associated submissions.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(assignment.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
