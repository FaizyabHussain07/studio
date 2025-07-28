
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, FileText, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getStudentCoursesWithProgress, getStudentAssignmentsWithStatus, getStudentQuizzes } from "@/lib/services";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import { onSnapshot, collection, query, where, doc } from "firebase/firestore";

export default function StudentDashboardPage() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const fetchData = async () => {
      try {
        const [studentCourses, studentAssignments, studentQuizzes] = await Promise.all([
          getStudentCoursesWithProgress(user.uid),
          getStudentAssignmentsWithStatus(user.uid),
          getStudentQuizzes(user.uid)
        ]);
        
        setCourses(studentCourses);
        setAssignments(studentAssignments);
        setQuizzes(studentQuizzes);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

    // Re-fetch all data when any of these collections change.
    // This is a simple but effective way to keep the dashboard up-to-date.
    const userDocRef = doc(db, 'users', user.uid);
    const unsubs = [
        onSnapshot(userDocRef, fetchData),
        onSnapshot(collection(db, 'courses'), fetchData),
        onSnapshot(collection(db, 'assignments'), fetchData),
        onSnapshot(query(collection(db, 'submissions'), where("studentId", "==", user.uid)), fetchData),
        onSnapshot(collection(db, 'quizzes'), fetchData)
    ];
    
    return () => {
      unsubs.forEach(unsub => unsub());
    };

  }, [user]);

  const upcomingAssignments = assignments
    .filter(a => a.status === 'Pending' || a.status === 'Missing')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);
  
  const topCourses = courses.slice(0, 3);

  if (loading) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, {user?.displayName || 'Student'}!</h1>
        <p className="text-muted-foreground">Here's an overview of your academic progress.</p>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold font-headline">My Courses</h2>
            <Button variant="link" asChild><Link href="/dashboard/student/courses">View All</Link></Button>
        </div>
        
        {topCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCourses.map(course => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={course.imageUrl || "/course-placeholder.jpg"}
                      fill
                      alt={course.name}
                      className="rounded-t-lg object-cover"
                      data-ai-hint="book course"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <CardTitle className="font-headline text-xl mb-2">{course.name}</CardTitle>
                  <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex-col items-start gap-2 border-t mt-auto">
                    <div className="w-full">
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                    </div>
                  <Button asChild variant="default" className="w-full mt-2">
                    <Link href={`/dashboard/student/courses/${course.id}`}>
                      Go to Course <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center p-8">
            <CardTitle>No Courses Yet</CardTitle>
            <CardDescription>You are not enrolled in any courses. Please contact your administrator.</CardDescription>
          </Card>
        )}
      </section>

      <section>
        <Tabs defaultValue="assignments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assignments">Upcoming Assignments</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>
          <TabsContent value="assignments">
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {upcomingAssignments.length > 0 ? upcomingAssignments.map(assignment => (
                    <li key={assignment.id} className="flex items-center justify-between p-4 hover:bg-secondary/50">
                      <div className="flex items-center gap-4">
                        <FileText className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-semibold">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">Due: {new Date(assignment.dueDate).toLocaleDateString()} | Course: {assignment.courseName}</p>
                        </div>
                      </div>
                      <Button asChild variant="secondary" size="sm">
                         <Link href={`/dashboard/student/assignments/${assignment.id}`}>View</Link>
                      </Button>
                    </li>
                  )) : (
                    <p className="text-center text-muted-foreground p-6">No upcoming assignments. You're all caught up!</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="quizzes">
            <Card>
              <CardContent className="p-0">
                 <ul className="divide-y">
                  {quizzes.length > 0 ? quizzes.map(quiz => (
                    <li key={quiz.id} className="flex items-center justify-between p-4 hover:bg-secondary/50">
                      <div className="flex items-center gap-4">
                        <HelpCircle className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-semibold">{quiz.title}</h3>
                          <p className="text-sm text-muted-foreground">Course: {quiz.courseName}</p>
                        </div>
                      </div>
                      <Button asChild variant="secondary" size="sm">
                         <a href={quiz.externalUrl} target="_blank" rel="noopener noreferrer">Take Quiz</a>
                      </Button>
                    </li>
                  )) : (
                    <p className="text-center text-muted-foreground p-6">No quizzes available yet.</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
