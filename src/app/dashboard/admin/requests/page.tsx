

'use client';

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { getPendingEnrollmentRequests, getCourse } from "@/lib/services";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowRight, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CourseForm } from "@/components/forms/course-form";
import { getStudentUsers, getCourses } from "@/lib/services";

type Request = {
    studentId: string;
    studentName: string;
    studentEmail: string;
    courseId: string;
    courseName: string;
    requestDate: string;
};

type Student = {
    id: string;
    name: string;
};

type Course = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    enrolledStudentIds: string[];
    completedStudentIds: string[];
};

export default function ManageRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);

  const fetchAllData = useCallback(async () => {
    try {
        const [students, pendingRequests] = await Promise.all([
            getStudentUsers(),
            getPendingEnrollmentRequests()
        ]);
        setAllStudents(students as Student[]);
        setRequests(pendingRequests as Request[]);
    } catch (e) {
        console.error("Failed to fetch data:", e);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAllData();
    
    const studentsQuery = query(collection(db, "users"), where("role", "==", "student"));
    const coursesQuery = collection(db, "courses");

    const unsubStudents = onSnapshot(studentsQuery, fetchAllData);
    const unsubCourses = onSnapshot(coursesQuery, fetchAllData);

    return () => {
      unsubStudents();
      unsubCourses();
    };
  }, [fetchAllData]);
  
  const handleApprove = async (request: Request) => {
    // We need to fetch the latest course data to ensure we have the most up-to-date student lists
    const courseToEdit = await getCourse(request.courseId);
    
    if (courseToEdit) {
        // The CourseForm will handle moving the student from pending to enrolled.
        // We just need to pass the course data and the student who made the request.
        setSelectedCourse(courseToEdit as Course);
        setCurrentRequest(request); // Pass the request context
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
            <CourseForm 
                course={selectedCourse} 
                students={allStudents} 
                onFinished={() => setIsFormOpen(false)}
                requestingStudentId={currentRequest?.studentId}
            />
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests ({requests.length})</CardTitle>
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
