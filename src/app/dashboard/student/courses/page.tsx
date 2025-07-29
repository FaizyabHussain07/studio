
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import { onSnapshot, doc, collection, query, where, documentId } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStudentCourses } from "@/lib/services";


const isValidImageUrl = (url: string | undefined | null): url is string => {
    if (!url || typeof url !== 'string') return false;
    return url.startsWith('/') || url.startsWith('https://');
};

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);
  
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const userDocRef = doc(db, 'users', user.uid);
    
    const fetchCourses = async () => {
        try {
            const studentCourses = await getStudentCourses(user.uid);
            setCourses(studentCourses);
        } catch (error) {
            console.error("Failed to fetch student courses:", error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    }
    
    fetchCourses();

    const unsubUser = onSnapshot(userDocRef, fetchCourses);
    
    return () => {
      unsubUser();
    };
  }, [user]);

  if (loading) {
    return <div className="text-center p-8">Loading your courses...</div>;
  }
  
  const enrolledCourses = courses.filter(c => c.status === 'enrolled');
  const pendingCourses = courses.filter(c => c.status === 'pending');
  const completedCourses = courses.filter(c => c.status === 'completed');

  const CourseCard = ({ course }: { course: any }) => {
    const imageUrl = isValidImageUrl(course.imageUrl) ? course.imageUrl : 'https://placehold.co/600x400.png';
    return (
        <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="p-0 relative">
            <div className="relative aspect-video">
                <Image
                src={imageUrl}
                fill
                alt={course.name}
                className="rounded-t-lg object-cover"
                />
            </div>
            <Badge 
                className="absolute top-2 right-2 capitalize" 
                variant={course.status === 'completed' ? 'default' : course.status === 'pending' ? 'destructive' : 'secondary'}
            >
                {course.status}
            </Badge>
        </CardHeader>
        <CardContent className="p-6 flex-grow">
            <CardTitle className="font-headline text-xl mb-2">{course.name}</CardTitle>
            <CardDescription className="line-clamp-3">{course.description}</CardDescription>
        </CardContent>
        <CardFooter className="p-6 pt-0 mt-auto bg-card border-t">
            {course.status === 'pending' ? (
            <Button variant="secondary" className="w-full mt-4" disabled>
                <Clock className="mr-2 h-4 w-4"/> Awaiting Approval
            </Button>
            ) : (
            <Button asChild variant="default" className="w-full mt-4">
                <Link href={`/dashboard/student/courses/${course.id}`}>
                    View Course <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
            )}
        </CardFooter>
        </Card>
    )
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Courses</h1>
        <p className="text-muted-foreground">Here are all the courses you are currently enrolled in, or awaiting approval for.</p>
      </div>

       <Tabs defaultValue="enrolled" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="enrolled">Enrolled ({enrolledCourses.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingCourses.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedCourses.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="enrolled">
            {enrolledCourses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                    {enrolledCourses.map(course => <CourseCard key={course.id} course={course} />)}
                </div>
             ) : (
                <Card className="text-center p-12 bg-card mt-6">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <CardTitle className="mt-4">No Enrolled Courses</CardTitle>
                    <CardDescription className="mt-2">You are not enrolled in any active courses. Browse the main page to enroll!</CardDescription>
                </Card>
             )}
          </TabsContent>
           <TabsContent value="pending">
            {pendingCourses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                    {pendingCourses.map(course => <CourseCard key={course.id} course={course} />)}
                </div>
             ) : (
                <Card className="text-center p-12 bg-card mt-6">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <CardTitle className="mt-4">No Pending Courses</CardTitle>
                    <CardDescription className="mt-2">You have no pending course enrollments.</CardDescription>
                </Card>
             )}
          </TabsContent>
          <TabsContent value="completed">
            {completedCourses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                    {completedCourses.map(course => <CourseCard key={course.id} course={course} />)}
                </div>
             ) : (
                <Card className="text-center p-12 bg-card mt-6">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <CardTitle className="mt-4">No Completed Courses</CardTitle>
                    <CardDescription className="mt-2">You have not completed any courses yet. Keep up the great work!</CardDescription>
                </Card>
             )}
          </TabsContent>
        </Tabs>
    </div>
  );
}
