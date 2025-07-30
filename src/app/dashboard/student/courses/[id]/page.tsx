

'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { FileText, ArrowLeft, CheckCircle2, XCircle, FileWarning } from "lucide-react";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, query, where, doc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { Course, Assignment as AssignmentType } from "@/lib/types";
import { VariantProps } from "class-variance-authority";


type Submission = {
    id: string;
    assignmentId: string;
    status: 'Graded' | 'Submitted' | 'Needs Revision';
};

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];


export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const unsubCourse = onSnapshot(doc(db, "courses", id), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setCourseData({ id: docSnapshot.id, ...docSnapshot.data() } as Course);
      } else {
        setCourseData(null);
        console.error("Course not found");
      }
      setLoading(false);
    });
    
    const assignmentsQuery = query(collection(db, "assignments"), where("courseId", "==", id));
    const unsubAssignments = onSnapshot(assignmentsQuery, (snapshot) => {
        const assignmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AssignmentType));
        setAssignments(assignmentsData);
    });

    return () => {
        unsubCourse();
        unsubAssignments();
    };

  }, [id]);

  useEffect(() => {
    if (!user || assignments.length === 0) {
      if (assignments.length === 0) setSubmissions([]);
      return;
    };
    
    const assignmentIds = assignments.map(a => a.id);
    if (assignmentIds.length === 0) {
        setSubmissions([]);
        return;
    }
    
    const submissionsQuery = query(collection(db, "submissions"), where("studentId", "==", user.uid), where('assignmentId', 'in', assignmentIds));
    
    const unsubSubmissions = onSnapshot(submissionsQuery, (snapshot) => {
        setSubmissions(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Submission)));
    });

    return () => unsubSubmissions();
  }, [user, assignments])
  
  
  const getStatusInfo = (assignment: AssignmentType): { icon: JSX.Element; badge: BadgeVariant; badgeText: string } => {
    const submission = submissions.find(s => s.assignmentId === assignment.id);

    if (submission) {
        switch (submission.status) {
            case 'Graded':
                return { icon: <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />, badge: 'default', badgeText: 'Graded' };
            case 'Submitted':
                return { icon: <CheckCircle2 className="h-6 w-6 text-blue-500 flex-shrink-0" />, badge: 'secondary', badgeText: 'Submitted' };
            case 'Needs Revision':
                return { icon: <FileWarning className="h-6 w-6 text-yellow-500 flex-shrink-0" />, badge: 'outline', badgeText: 'Revision' };
            default:
                return { icon: <CheckCircle2 className="h-6 w-6 text-blue-500 flex-shrink-0" />, badge: 'secondary', badgeText: 'Submitted' };
        }
    }
    
    if (new Date() > new Date(assignment.dueDate)) {
        return { icon: <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />, badge: 'destructive', badgeText: 'Missing' };
    }
    
    return { icon: <FileText className="h-6 w-6 text-primary flex-shrink-0" />, badge: 'outline', badgeText: 'Pending' };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full p-8">Loading course details...</div>;
  }
  
  if (!courseData) {
     return <div className="flex flex-col items-center justify-center h-full p-8">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">This course may have been deleted.</p>
          <Button asChild>
            <Link href="/dashboard/student/courses">
                <ArrowLeft className="mr-2 h-4 w-4"/> Back to My Courses
            </Link>
          </Button>
      </div>;
  }
  
  const courseStatus = courseData.completedStudentIds?.includes(user?.uid || '') 
    ? 'Completed' 
    : courseData.enrolledStudentIds?.includes(user?.uid || '') 
    ? 'In Progress' 
    : 'Not Enrolled';

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard/student/courses">
                <ArrowLeft className="mr-2 h-4 w-4"/> Back to My Courses
            </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">{courseData.name}</h1>
        <p className="text-muted-foreground mt-2">{courseData.description}</p>
      </div>
      
       <Card>
        <CardHeader>
          <CardTitle>Course Status</CardTitle>
        </CardHeader>
        <CardContent>
          {courseStatus === 'In Progress' && (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
              <p className="text-md text-muted-foreground">You are currently enrolled. Keep up the great work!</p>
            </div>
          )}
          {courseStatus === 'Completed' && (
             <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <p className="text-md text-muted-foreground">Congratulations! You have completed this course.</p>
            </div>
          )}
           {courseStatus === 'Not Enrolled' && (
             <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <p className="text-md text-muted-foreground">You are not currently enrolled in this course.</p>
             </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Assignments</CardTitle>
          <CardDescription>Here are all the assignments for this course. Keep track of deadlines and submission statuses.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {assignments.length > 0 ? assignments.map(assignment => {
              const { icon, badge, badgeText } = getStatusInfo(assignment);
              return (
                <li key={assignment.id} className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {icon}
                    <div>
                      <h3 className="font-semibold">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                      <Badge variant={badge} className="w-24 justify-center">
                          {badgeText}
                      </Badge>
                      <Button asChild variant="outline" size="sm">
                         <Link href={`/dashboard/student/assignments/${assignment.id}`}>View</Link>
                      </Button>
                  </div>
                </li>
              )
            }) : (
              <p className="p-6 text-center text-muted-foreground">No assignments have been added to this course yet.</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
