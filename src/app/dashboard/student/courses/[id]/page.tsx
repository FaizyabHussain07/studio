'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowLeft, CheckCircle2, Circle, Radio } from "lucide-react";
import { useState, useEffect } from "react";
import { getCourse, getAssignmentsByCourse, getSubmissionsByStudent, getStudentAssignmentStatus } from "@/lib/services";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [courseData, setCourseData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !params.id) return;

    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const course = await getCourse(params.id);
        if (course) {
          const courseAssignments = await getAssignmentsByCourse(params.id);
          const assignmentsWithStatus = await Promise.all(
            courseAssignments.map(async (assignment) => {
              const status = await getStudentAssignmentStatus(user.uid, assignment.id);
              return { ...assignment, status };
            })
          );
          
          const completedCount = assignmentsWithStatus.filter(a => a.status === 'Submitted' || a.status === 'Graded').length;
          const progress = courseAssignments.length > 0 ? (completedCount / courseAssignments.length) * 100 : 0;

          setCourseData({...course, progress: Math.round(progress) });
          setAssignments(assignmentsWithStatus);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [params.id, user]);
  
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Graded':
        return { icon: <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />, badge: 'default' };
      case 'Submitted':
        return { icon: <CheckCircle2 className="h-6 w-6 text-blue-500 flex-shrink-0" />, badge: 'secondary' };
      default:
        return { icon: <FileText className="h-6 w-6 text-primary flex-shrink-0" />, badge: 'outline' };
    }
  };


  if (loading || !courseData) {
    return <div className="flex justify-center items-center h-full">Loading course details...</div>;
  }
  
  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard/student">
                <ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard
            </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">{courseData.name}</h1>
        <p className="text-muted-foreground mt-2">{courseData.description}</p>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
            <Progress value={courseData.progress} className="h-3" />
            <p className="text-md text-muted-foreground mt-2">{courseData.progress}% of course completed</p>
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
              const { icon, badge } = getStatusInfo(assignment.status);
              return (
                <li key={assignment.id} className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    {icon}
                    <div>
                      <h3 className="font-semibold">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                      <Badge variant={badge}>
                          {assignment.status}
                      </Badge>
                      <Button asChild variant="outline" size="sm">
                         <Link href={`/dashboard/student/assignments/${assignment.id}`}>View</Link>
                      </Button>
                  </div>
                </li>
              )
            }) : (
              <p className="p-4 text-center text-muted-foreground">No assignments have been added to this course yet.</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
