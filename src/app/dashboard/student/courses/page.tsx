

'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getStudentCoursesWithProgress, getStudentAssignmentsWithStatus, getStudentCourses } from "@/lib/services";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import { collection, onSnapshot, query, where, documentId } from "firebase/firestore";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Listen to changes in the user document to get course IDs
    const unsubUser = onSnapshot(doc(db, "users", user.uid), async (userDoc) => {
      setLoading(true);
      const userData = userDoc.data();
      const courseIds = userData?.courses || [];

      if (courseIds.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }
      
      const studentCourses = await getStudentCoursesWithProgress(user.uid);
      setCourses(studentCourses);
      setLoading(false);

    });

    return () => unsubUser();
  }, [user]);

  if (loading) {
    return <div className="text-center p-8">Loading your courses...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Courses</h1>
        <p className="text-muted-foreground">Here are all the courses you are currently enrolled in.</p>
      </div>

      {courses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map(course => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader className="p-0">
                <Image
                  src={course.imageUrl || "https://placehold.co/600x400.png"}
                  width={600}
                  height={400}
                  alt={course.name}
                  className="rounded-t-lg object-cover aspect-video"
                  data-ai-hint="learning online course"
                />
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
        <Card className="text-center p-12">
          <CardTitle>No Courses Yet</CardTitle>
          <CardDescription className="mt-2">You are not enrolled in any courses. Please contact your administrator to get started.</CardDescription>
        </Card>
      )}
    </div>
  );
}
