
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, FileText, CheckCircle, Clock, BadgeCheck, Sparkles, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { getStudentCoursesWithProgress, getStudentAssignmentsWithStatus, getStudentQuizzes, getUser } from "@/lib/services";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import { onSnapshot, collection, query, where, doc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { User as UserType, Course as CourseType, Assignment, Quiz } from "@/lib/types";

// Helper to check for valid image URLs
const isValidImageUrl = (url: string | undefined | null): url is string => {
    if (!url || typeof url !== 'string') return false;
    return url.startsWith('/') || url.startsWith('https://');
};


export default function StudentDashboardPage() {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<UserType | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
      } else {
          // Fetch DB user initially to check enrollment status
          const userDoc = await getUser(currentUser.uid);
          setDbUser(userDoc);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const fetchData = async () => {
      try {
        const [userDoc, studentCourses, studentAssignments, studentQuizzes] = await Promise.all([
          getUser(user.uid),
          getStudentCoursesWithProgress(user.uid),
          getStudentAssignmentsWithStatus(user.uid),
          getStudentQuizzes(user.uid)
        ]);
        
        setDbUser(userDoc);
        setCourses(studentCourses as CourseType[]);
        setAssignments(studentAssignments as Assignment[]);
        setQuizzes(studentQuizzes as Quiz[]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

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
  
  const topCourses = courses.filter(c => c.status === 'enrolled').slice(0, 3);
  
  const isPending = dbUser && (!dbUser.courses || dbUser.courses.every(c => c.status === 'pending'));

  if (loading) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }
  
  if (isPending) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Card className="w-full max-w-2xl text-center shadow-lg">
                <CardHeader>
                    <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-3 rounded-full w-fit">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <CardTitle className="font-headline text-3xl mt-4">Thank You for Enrolling!</CardTitle>
                    <CardDescription className="text-lg">
                        Your enrollment request has been sent. You will gain access to your dashboard as soon as an administrator approves it.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-left bg-secondary p-6 rounded-lg">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Clock className="h-5 w-5"/> What Happens Next?</h3>
                        <ol className="list-decimal list-inside text-muted-foreground mt-2 space-y-1">
                            <li>Your request is now pending admin approval.</li>
                            <li>You will receive a notification once approved.</li>
                            <li>Your **3-day free trial** will begin automatically.</li>
                        </ol>
                    </div>
                     <div className="text-left bg-secondary p-6 rounded-lg">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Sparkles className="h-5 w-5"/> Our Plans</h3>
                        <p className="text-muted-foreground mt-2">After your trial, you can choose a plan that suits you. We offer flexible options:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className="border p-4 rounded-md">
                                <h4 className="font-bold flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-primary"/> One-Time Payment</h4>
                                <p className="text-sm text-muted-foreground">Pay for your course once and get lifetime access.</p>
                            </div>
                            <div className="border p-4 rounded-md">
                               <h4 className="font-bold flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/> Monthly Subscription</h4>
                                <p className="text-sm text-muted-foreground">Enjoy continuous learning with a flexible monthly plan.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                 <CardFooter className="flex-col gap-4">
                     <p className="text-sm text-muted-foreground">
                        While you wait, feel free to browse our courses.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/student/browse-courses">
                            Browse All Courses
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
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
            {topCourses.map(course => {
                const imageUrl = isValidImageUrl(course.imageUrl) ? course.imageUrl : 'https://placehold.co/600x400.png';
                return (
                  <Card key={course.id} className="flex flex-col">
                    <CardHeader className="p-0 relative">
                      <div className="relative w-full aspect-video">
                        <Image
                          src={imageUrl}
                          fill
                          alt={course.name}
                          className="rounded-t-lg object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                       <Badge className="absolute top-2 right-2 capitalize" variant={'secondary'}>{course.status}</Badge>
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                      <CardTitle className="font-headline text-xl mb-2">{course.name}</CardTitle>
                      <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 mt-auto bg-card border-t">
                      <Button asChild variant="default" className="w-full mt-4">
                        <Link href={`/dashboard/student/courses/${course.id}`}>
                          View Course <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
            })}
          </div>
        ) : (
          <Card className="text-center p-8">
            <CardTitle>No Courses Yet</CardTitle>
            <CardDescription>You are not enrolled in any courses. Please contact your administrator.</CardDescription>
          </Card>
        )}
      </section>

      <section className="grid md:grid-cols-2 gap-8">
         <div>
             <h2 className="text-2xl font-bold font-headline mb-4">Upcoming Assignments</h2>
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
         </div>
         <div>
            <h2 className="text-2xl font-bold font-headline mb-4">Quizzes</h2>
            <Card>
              <CardContent className="p-0">
                 <ul className="divide-y">
                  {quizzes.slice(0, 3).map(quiz => (
                    <li key={quiz.id} className="flex items-center justify-between p-4 hover:bg-secondary/50">
                      <div className="flex items-center gap-4">
                        <FileText className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-semibold">{quiz.title}</h3>
                          <p className="text-sm text-muted-foreground">Course: {quiz.courseName}</p>
                        </div>
                      </div>
                      <Button asChild variant="secondary" size="sm">
                         <a href={quiz.externalUrl} target="_blank" rel="noopener noreferrer">Take Quiz</a>
                      </Button>
                    </li>
                  ))}
                   {quizzes.length === 0 && (
                     <p className="text-center text-muted-foreground p-6">No quizzes available yet.</p>
                   )}
                </ul>
              </CardContent>
            </Card>
         </div>
      </section>
    </div>
  );
}
