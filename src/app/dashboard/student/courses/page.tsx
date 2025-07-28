
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { getStudentCoursesWithProgress } from "@/lib/services";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import { onSnapshot, doc, collection, query, where } from "firebase/firestore";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
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
    const unsubUser = onSnapshot(userDocRef, async (userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const courseIds = userData.courses || [];
        if (courseIds.length > 0) {
          const coursesQuery = query(collection(db, 'courses'), where(doc.id, 'in', courseIds));
          const coursesSnap = await getDocs(coursesQuery);
          const coursesData = coursesSnap.docs.map(d => ({id: d.id, ...d.data()}));
          setCourses(coursesData);
        } else {
          setCourses([]);
        }
      }
      setLoading(false);
    });

    const unsubs = [unsubUser];

    const setupCourseListeners = async () => {
        const userDoc = await getDoc(userDocRef);
        const courseIds = userDoc.data()?.courses || [];

        if (courseIds.length > 0) {
            unsubs.push(onSnapshot(query(collection(db, "assignments"), where('courseId', 'in', courseIds)), (snap) => {
                setAssignments(snap.docs.map(d => ({id: d.id, ...d.data()})));
            }));
            unsubs.push(onSnapshot(query(collection(db, "submissions"), where('studentId', '==', user.uid), where('courseId', 'in', courseIds)), (snap) => {
                setSubmissions(snap.docs.map(d => d.data()));
            }));
        }
    };
    setupCourseListeners();

    return () => unsubs.forEach(unsub => unsub());

  }, [user]);

  const coursesWithProgress = useMemo(() => {
    return courses.map(course => {
        const courseAssignments = assignments.filter(a => a.courseId === course.id);
        if (courseAssignments.length === 0) return { ...course, progress: 0 };
        
        const courseSubmissions = submissions.filter(s => courseAssignments.some(a => a.id === s.assignmentId));
        const completedCount = courseSubmissions.filter(s => s.status === 'Submitted' || s.status === 'Graded').length;
        
        const progress = Math.round((completedCount / courseAssignments.length) * 100);
        return { ...course, progress };
    });
  }, [courses, assignments, submissions]);


  if (loading) {
    return <div className="text-center p-8">Loading your courses...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Courses</h1>
        <p className="text-muted-foreground">Here are all the courses you are currently enrolled in.</p>
      </div>

      {coursesWithProgress.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {coursesWithProgress.map(course => (
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
