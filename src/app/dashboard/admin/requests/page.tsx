
'use client';

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getPendingEnrollmentRequests, getCourse, getUser } from "@/lib/services";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { ArrowRight, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CourseForm } from "@/components/forms/course-form";
import { getStudentUsers, getCourses } from "@/lib/services";


export default function ManageRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
        setLoading(true);
        const [students, courses] = await Promise.all([
            getStudentUsers(),
            getCourses()
        ]);
        setAllStudents(students);
        setAllCourses(courses);
    }
    fetchInitialData();

    // Listen to changes in the users collection to update requests in real-time
    const q = query(collection(db, "users"), where("role", "==", "student"));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
        const pendingRequests = await getPendingEnrollmentRequests();
        setRequests(pendingRequests);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const handleApprove = (request) => {
    const courseToEdit = allCourses.find(c => c.id === request.courseId);
    
    if (courseToEdit) {
        // We want to add the new student to the enrolled list, without removing existing ones.
        const updatedCourse = {
            ...courseToEdit,
            enrolledStudentIds: [...(courseToEdit.enrolledStudentIds || []), request.studentId],
            // Ensure we don't have the student in pending list anymore.
            // This is handled by the updateUserCourses logic which reconstructs from enrolled/completed lists.
        };
        setSelectedCourse(updatedCourse);
        setIsFormOpen(true);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Manage Enrollment Requests</h1>
        <p className="text-muted-foreground">Review and approve student requests to join courses.</p>
      </div>
      
       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Approve Enrollment</DialogTitle>
                <DialogDescription>
                  Review the student and course, then save changes to confirm enrollment.
                </DialogDescription>
            </DialogHeader>
            <CourseForm course={selectedCourse} students={allStudents} onFinished={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>
            The following students have requested to enroll in a course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course Requested</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading requests...</TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                        <div className="py-12 flex flex-col items-center">
                             <UserCheck className="h-12 w-12 text-muted-foreground"/>
                             <h3 className="text-xl font-semibold mt-4">All Caught Up!</h3>
                             <p className="text-muted-foreground mt-2">There are no pending enrollment requests.</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={`${request.studentId}-${request.courseId}`}>
                      <TableCell className="font-medium">
                        <p>{request.studentName}</p>
                        <p className="text-sm text-muted-foreground">{request.studentEmail}</p>
                      </TableCell>
                      <TableCell>{request.courseName}</TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleApprove(request)}>
                          Review & Approve <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
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
