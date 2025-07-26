'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { getAssignment, getSubmissionsByAssignment, getUser, getCourse } from "@/lib/services";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { updateSubmissionStatus } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";

export default function ViewSubmissionsPage({ params }: { params: { id: string }}) {
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const assignmentData = await getAssignment(params.id);
        setAssignment(assignmentData);

        if (assignmentData) {
            const courseData = await getCourse(assignmentData.courseId);
            setCourse(courseData);
            
            const submissionsData = await getSubmissionsByAssignment(params.id);
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
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleStatusChange = async (submissionId, newStatus) => {
    try {
        await updateSubmissionStatus(submissionId, newStatus);
        setSubmissions(prev => prev.map(s => s.id === submissionId ? {...s, status: newStatus} : s));
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
        {loading ? (
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
           <CardDescription>Review the files submitted by students and update their status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attachment</TableHead>
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
                       <TableCell>
                        {sub.fileUrl ? (
                           <Button variant="outline" size="sm" asChild>
                               <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer">
                                   <Download className="mr-2 h-4 w-4"/>
                                   View File
                               </a>
                           </Button>
                        ) : (
                            <span className="text-muted-foreground">No file</span>
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
