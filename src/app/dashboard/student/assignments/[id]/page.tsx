'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Paperclip, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { getAssignment, getCourse, createSubmission } from "@/lib/services";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function AssignmentDetailPage({ params }: { params: { id:string } }) {
  const [assignmentData, setAssignmentData] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAssignmentData = async () => {
      setLoading(true);
      try {
        const assignment = await getAssignment(params.id);
        if (assignment) {
          setAssignmentData(assignment);
          const course = await getCourse(assignment.courseId);
          setCourseName(course?.name || "Course");
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignmentData();
  }, [params.id]);
  
  const handleSubmission = async () => {
    if (!user || !assignmentData) return;
    try {
        await createSubmission({
            assignmentId: assignmentData.id,
            studentId: user.uid,
            submissionDate: new Date().toISOString(),
            status: 'Submitted',
            // Add file/link data here
        });
        toast({ title: "Success", description: "Assignment submitted successfully!" });
        // Potentially update assignment status locally or refetch
    } catch(error) {
        console.error("Submission failed", error);
        toast({ title: "Error", description: "Failed to submit assignment.", variant: "destructive" });
    }
  }

  if (loading || !assignmentData) {
    return <div>Loading assignment...</div>;
  }
  
  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" asChild className="mb-4">
            <Link href={`/dashboard/student/courses/${assignmentData.courseId}`}>
                <ArrowLeft className="mr-2 h-4 w-4"/> Back to {courseName}
            </Link>
        </Button>
        <div className="flex items-center justify-between">
            <div>
                 <p className="text-sm text-primary font-medium">{courseName}</p>
                 <h1 className="text-3xl font-bold font-headline">{assignmentData.title}</h1>
                 <p className="text-muted-foreground mt-1">Due Date: {assignmentData.dueDate}</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">{assignmentData.status || 'Pending'}</Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{assignmentData.instructions}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                    {assignmentData.attachments?.map(file => (
                        <Button key={file.name} variant="outline" asChild>
                            <Link href={file.url}>
                                <Paperclip className="mr-2 h-4 w-4"/>
                                {file.name}
                            </Link>
                        </Button>
                    )) || <p className="text-muted-foreground">No attachments.</p>}
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Your Submission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2"/>
                        <p className="text-muted-foreground">Drag & drop files here or</p>
                        <Button variant="link" className="p-0 h-auto">click to browse</Button>
                    </div>
                    <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} onClick={handleSubmission}>Submit Assignment</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
