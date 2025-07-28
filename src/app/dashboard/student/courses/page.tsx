
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import { onSnapshot, doc, collection, query, where, documentId } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
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
    
    const unsubUser = onSnapshot(userDocRef, (userDoc) => {
        const userData = userDoc.data();
        const courseEnrollments = userData?.courses || []; // Array of {courseId, status}

        if (courseEnrollments.length > 0) {
            const courseIds = courseEnrollments.map(c => c.courseId);
            const coursesQuery = query(collection(db, 'courses'), where(documentId(), 'in', courseIds));
            
            const unsubCourses = onSnapshot(coursesQuery, (coursesSnap) => {
                const coursesData = coursesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                const coursesWithStatus = coursesData.map(course => {
                    const enrollment = courseEnrollments.find(e => e.courseId === course.id);
                    return { ...course, status: enrollment?.status || 'enrolled' };
                });
                setCourses(coursesWithStatus);
                setLoading(false);
            });

            return () => unsubCourses();
        } else {
            setCourses([]);
            setLoading(false);
        }
    }, (error) => {
        console.error("Error listening to user document:", error);
        setLoading(false);
    });

    return () => unsubUser();
  }, [user]);

  if (loading) {
    return <div className="text-center p-8">Loading your courses...</div>;
  }
  
  const enrolledCourses = courses.filter(c => c.status === 'enrolled');
  const completedCourses = courses.filter(c => c.status === 'completed');

  const CourseCard = ({ course }) => (
    <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <div className="relative aspect-video">
            <Image
              src={course.imageUrl || "/quran img 5.jpg"}
              fill
              alt={course.name}
              className="rounded-t-lg object-cover"
            />
        </div>
         <Badge className="absolute top-2 right-2 capitalize" variant={course.status === 'completed' ? 'default' : 'secondary'}>{course.status}</Badge>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-xl mb-2">{course.name}</CardTitle>
        <CardDescription className="line-clamp-3">{course.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0 mt-auto bg-card border-t">
        <Button asChild variant="default" className="w-full mt-4">
          <Link href={`/dashboard/student/courses/${course.id}`}>
            Go to Course <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Courses</h1>
        <p className="text-muted-foreground">Here are all the courses you are currently enrolled in.</p>
      </div>

       <Tabs defaultValue="enrolled" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
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
                    <CardDescription className="mt-2">You are not enrolled in any active courses. Please contact your administrator to get started.</CardDescription>
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
