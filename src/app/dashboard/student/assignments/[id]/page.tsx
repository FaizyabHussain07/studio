

'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Paperclip, Upload, File, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getAssignment, getCourse, createSubmission, getStudentSubmissionForAssignment } from "@/lib/services";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { onAuthStateChanged } from "firebase/auth";
import { Textarea } from "@/components/ui/textarea";

export default function AssignmentDetailPage({ params }: { params: { id:string } }) {
  const { id } = params;
  const [assignmentData, setAssignmentData] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [file, setFile] = useState(null);
  const [textSubmission, setTextSubmission] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !id) return;

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const assignment = await getAssignment(id);
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
    fetchInitialData();
    
    const unsubSubmission = getStudentSubmissionForAssignment(user.uid, id, (sub) => {
        setSubmission(sub);
        if (sub?.textSubmission) {
            setTextSubmission(sub.textSubmission);
        }
    });

    return () => unsubSubmission();

  }, [id, user]);
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  const fileToDataUrl = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
  }

  const handleSubmission = async () => {
    if (!user || !assignmentData || (!file && !textSubmission.trim())) {
        toast({ title: "Submission empty", description: "Please provide a file or text to submit.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);

    try {
      let fileDataUrl = null;
      let fileName = null;
      if (file) {
          fileDataUrl = await fileToDataUrl(file);
          fileName = file.name;
      }
      
      if (!assignmentData.courseId) {
        throw new Error("Course ID is missing from assignment data.");
      }

      await createSubmission({
          assignmentId: id,
          studentId: user.uid,
          submissionDate: new Date().toISOString(),
          status: 'Submitted',
          fileDataUrl: fileDataUrl,
          fileName: fileName,
          textSubmission: textSubmission,
          courseId: assignmentData.courseId,
      });
      toast({ title: "Success", description: "Assignment submitted successfully!" });
    } catch(error) {
        console.error("Submission failed", error);
        toast({ title: "Error", description: `Failed to submit assignment. ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
      setFile(null);
    }
  }

  if (loading || !assignmentData) {
    return <div className="flex justify-center items-center h-full">Loading assignment details...</div>;
  }
  
  const status = submission?.status || 'Pending';

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" asChild className="mb-4">
            <Link href={`/dashboard/student/courses/${assignmentData.courseId}`}>
                <ArrowLeft className="mr-2 h-4 w-4"/> Back to {courseName}
            </Link>
        </Button>
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
                 <p className="text-sm text-primary font-medium">{courseName}</p>
                 <h1 className="text-3xl font-bold font-headline">{assignmentData.title}</h1>
                 <p className="text-muted-foreground mt-1">Due Date: {assignmentData.dueDate}</p>
            </div>
            <Badge variant={status === 'Graded' ? 'default' : status === 'Submitted' ? 'secondary' : 'outline'} className="text-lg px-4 py-2">{status}</Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{assignmentData.instructions}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                    {assignmentData.attachments?.map(file => (
                        <Button key={file.name} variant="outline" asChild>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                                <Paperclip className="mr-2 h-4 w-4"/>
                                {file.name}
                            </a>
                        </Button>
                    )) || <p className="text-muted-foreground">No attachments for this assignment.</p>}
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Your Submission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {status !== 'Pending' ? (
                      <div>
                          <p className="text-muted-foreground mb-4">You have already submitted this assignment.</p>
                           {submission.textSubmission && (
                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2">Your Text Submission:</h4>
                                    <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md whitespace-pre-wrap">{submission.textSubmission}</p>
                                </div>
                           )}
                          {submission.fileDataUrl && (
                            <div>
                               <h4 className="font-semibold mb-2">Your Submitted File:</h4>
                                <div className="border rounded-lg p-3 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                      <File className="h-5 w-5"/>
                                      <a href={submission.fileDataUrl} target="_blank" rel="noopener noreferrer" download={submission.fileName} className="text-sm font-medium hover:underline">{submission.fileName}</a>
                                  </div>
                                </div>
                            </div>
                          )}
                      </div>
                  ) : (
                    <>
                      <Textarea 
                        placeholder="Type your response here..."
                        value={textSubmission}
                        onChange={(e) => setTextSubmission(e.target.value)}
                        disabled={isSubmitting}
                      />
                      <div className="relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
                          <Upload className="h-10 w-10 text-muted-foreground mb-2"/>
                          <p className="text-muted-foreground">Drag & drop or</p>
                          <Button variant="link" className="p-0 h-auto">
                              <label htmlFor="file-upload" className="cursor-pointer">
                                  click to browse for a file
                              </label>
                          </Button>
                          <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={isSubmitting}/>
                      </div>
                      {file && (
                          <div className="border rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden">
                               <File className="h-5 w-5 flex-shrink-0"/>
                               <span className="text-sm truncate">{file.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setFile(null)} disabled={isSubmitting}>
                                <X className="h-4 w-4" />
                            </Button>
                          </div>
                      )}
                      <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} onClick={handleSubmission} disabled={isSubmitting}>
                          {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                      </Button>
                    </>
                  )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
