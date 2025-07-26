
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Paperclip, Upload, File, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getAssignment, getCourse, createSubmission, getStudentSubmissionForAssignment, uploadFile } from "@/lib/services";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Textarea } from "@/components/ui/textarea";

export default function AssignmentDetailPage({ params }: { params: { id:string } }) {
  const [assignmentData, setAssignmentData] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [file, setFile] = useState(null);
  const [textSubmission, setTextSubmission] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !params.id) return;

    const fetchInitialData = async () => {
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
    fetchInitialData();
    
    // Listen for real-time updates on submission
    const unsubSubmission = getStudentSubmissionForAssignment(user.uid, params.id, (sub) => {
        setSubmission(sub);
        if (sub?.textSubmission) {
            setTextSubmission(sub.textSubmission);
        }
    });

    return () => unsubSubmission();

  }, [params.id, user]);
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  const handleSubmission = async () => {
    if (!user || !assignmentData || (!file && !textSubmission)) {
        toast({ title: "Submission empty", description: "Please provide a file or text to submit.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let fileUrl = null;
      let fileName = null;
      if (file) {
          fileUrl = await uploadFile(file, (progress) => {
            setUploadProgress(progress);
          });
          fileName = file.name;
      }

      await createSubmission({
          assignmentId: assignmentData.id,
          studentId: user.uid,
          submissionDate: new Date().toISOString(),
          status: 'Submitted',
          fileUrl: fileUrl,
          fileName: fileName,
          textSubmission: textSubmission
      });
      toast({ title: "Success", description: "Assignment submitted successfully!" });
      // Real-time listener will update the submission state
    } catch(error) {
        console.error("Submission failed", error);
        toast({ title: "Error", description: "Failed to submit assignment.", variant: "destructive" });
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
                          {submission.fileUrl && (
                            <div>
                               <h4 className="font-semibold mb-2">Your Submitted File:</h4>
                                <div className="border rounded-lg p-3 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                      <File className="h-5 w-5"/>
                                      <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline">{submission.fileName}</a>
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
                      {isSubmitting && file && (
                          <div className="space-y-2">
                              <Progress value={uploadProgress} />
                              <p className="text-sm text-muted-foreground text-center">{Math.round(uploadProgress)}% uploaded...</p>
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

