'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookText, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { getCourses, getAssignments } from "@/lib/services";
import { auth } from "@/lib/firebase";

export default function StudentDashboardPage() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        // Redirect to login or handle unauthenticated state
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const coursesData = await getCourses();
        const assignmentsData = await getAssignments();

        // This is a placeholder, you should filter courses/assignments for the current user
        setCourses(coursesData.slice(0, 3).map(c => ({...c, progress: Math.floor(Math.random() * 100)})));
        setAssignments(assignmentsData.slice(0,2));
        // Add quiz fetching logic here if needed
        setQuizzes([]);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, {user?.displayName || 'Student'}!</h1>
        <p className="text-muted-foreground">Here's an overview of your academic progress.</p>
      </div>

      <section>
        <h2 className="text-2xl font-bold font-headline mb-4">My Courses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={course.progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">{course.progress}% complete</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/student/courses/${course.id}`}>
                    Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Tabs defaultValue="assignments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assignments">Upcoming Assignments</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>
          <TabsContent value="assignments">
            <Card>
              <CardContent className="p-6 space-y-4">
                {assignments.map(assignment => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 rounded-md border">
                    <div className="flex items-center gap-4">
                      <FileText className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                      </div>
                    </div>
                    <Button asChild variant="secondary" size="sm">
                       <Link href={`/dashboard/student/assignments/${assignment.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="quizzes">
            <Card>
              <CardContent className="p-6 space-y-4">
                 <p className="text-center text-muted-foreground">No quizzes available yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
