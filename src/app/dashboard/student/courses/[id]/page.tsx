'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { getCourse, getAssignmentsByCourse } from "@/lib/services";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [courseData, setCourseData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const course = await getCourse(params.id);
        if (course) {
          const courseAssignments = await getAssignmentsByCourse(params.id);
          setCourseData({...course, progress: 75}); // Placeholder progress
          setAssignments(courseAssignments);
        } else {
          // Handle course not found
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [params.id]);

  if (loading || !courseData) {
    return <div>Loading course details...</div>;
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
            {assignments.map(assignment => (
              <li key={assignment.id} className="flex items-center justify-between p-4 hover:bg-secondary/50">
                <div className="flex items-center gap-4">
                  <FileText className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant={
                        assignment.status === 'Graded' ? 'default' : 
                        assignment.status === 'Submitted' ? 'secondary' : 'outline'
                    }>
                        {assignment.status || 'Pending'}
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                       <Link href={`/dashboard/student/assignments/${assignment.id}`}>View</Link>
                    </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
