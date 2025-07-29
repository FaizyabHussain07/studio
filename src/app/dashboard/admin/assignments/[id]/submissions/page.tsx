

'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Download, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { getAssignment, getCourse, updateSubmissionStatus } from "@/lib/services";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUser } from "@/lib/services";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define a type for the page props
type ViewSubmissionsPageProps = {
  params: {
    id: string;
  };
};

export default function ViewSubmissionsPage({ params }: ViewSubmissionsPageProps) {
  const { id } = params;
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    const fetchStaticData = async () => {
      setLoading(true);
      try {
        const assignmentData = await getAssignment(id);
        setAssignment(assignmentData);

        if (assignmentData) {
            const courseData = await getCourse(assignmentData.courseId);
            setCourse(courseData);
        }
      } catch (error) {
        console.error("Error fetching static data:", error);
      }
    };
    fetchStaticData();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    
    const q = query(collection(db, 'submissions'), where('assignmentId', '==', id));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
        setLoading(true);
        try {
            const submissionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const submissionsWithStudentInfo = await Promise.all(
                submissionsData.map(async (sub) => {
                    const student = await getUser(sub.studentId);
                    return {
                        ...sub,
                        studentName: student?.name || 'Unknown Student',
                        studentEmail: student?.email || 'N/A'
                    }
                })
            );
            setSubmissions(submissionsWithStudentInfo);
        } catch (error) {
            console.error("Error fetching submissions real-time:", error);
        } finally {
            setLoading(false);
        }
    });

    return () => unsubscribe();

  }, [id]);


  const handleStatusChange = async (submissionId, newStatus) => {
    try {
        await updateSubmissionStatus(submissionId, newStatus);
        toast({ title: "Status Updated", description: "The submission status has been changed."});
    } catch (error) {
        console.error("Failed to update status", error);
        toast({ title: "Error", description: "Could not update the submission status.", variant: "destructive"});
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard/admin/assignments">
                <ArrowLeft className="mr-2 h-4 w-4"/> Back to Assignments
            </Link>
        </Button>
        {loading && !assignment ? (
             <h1 className="text-3xl font-bold font-headline">Loading submissions...</h1>
        ) : (
            <div>
                <p className="text-sm text-primary font-medium">{course?.name}</p>
                <h1 className="text-3xl font-bold font-headline">Submissions for: {assignment?.title}</h1>
                <p className="text-muted-foreground mt-1">Review student submissions and provide grades.</p>
            </div>
        )}
      </div>

      <Card>
        <CardHeader>
           <CardTitle>All Submissions ({submissions.length})</CardTitle>
           <CardDescription>Review the files and text submitted by students and update their status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center">Loading submissions...</TableCell></TableRow>
                ) : submissions.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center">No submissions yet.</TableCell></TableRow>
                ) : (
                  submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">
                        <p>{sub.studentName}</p>
                        <p className="text-sm text-muted-foreground">{sub.studentEmail}</p>
                      </TableCell>
                      <TableCell>{sub.submissionDate ? new Date(sub.submissionDate).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>
                         <Badge variant={sub.status === 'Graded' ? 'default' : 'secondary'}>{sub.status}</Badge>
                      </TableCell>
                       <TableCell className="flex items-center gap-2">
                        {sub.fileDataUrl && (
                           <Button variant="outline" size="sm" asChild>
                               <a href={sub.fileDataUrl} target="_blank" rel="noopener noreferrer" download={sub.fileName}>
                                   <Download className="mr-2 h-4 w-4"/>
                                   View File
                               </a>
                           </Button>
                        )}
                        {sub.textSubmission && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <MessageSquare className="mr-2 h-4 w-4"/>
                                        View Text
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Text Submission from {sub.studentName}</DialogTitle>
                                        <DialogDescription>
                                            The student submitted the following text alongside their file.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4 p-4 bg-secondary rounded-md whitespace-pre-wrap">
                                        {sub.textSubmission}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                        {!sub.fileDataUrl && !sub.textSubmission && (
                             <span className="text-muted-foreground">No submission</span>
                        )}
                       </TableCell>
                      <TableCell className="text-right">
                         <Select onValueChange={(value) => handleStatusChange(sub.id, value)} defaultValue={sub.status}>
                             <SelectTrigger className="w-[120px]">
                                 <SelectValue placeholder="Change status"/>
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="Submitted">Submitted</SelectItem>
                                 <SelectItem value="Graded">Graded</SelectItem>
                                 <SelectItem value="Needs Revision">Needs Revision</SelectItem>
                             </SelectContent>
                         </Select>
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
