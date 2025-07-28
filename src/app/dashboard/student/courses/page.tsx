
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import { onSnapshot, doc, collection, query, where, documentId } from "firebase/firestore";

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
    const unsubs: (() => void)[] = [];

    const userUnsub = onSnapshot(userDocRef, (userDoc) => {
        const userData = userDoc.data();
        const courseIds = userData?.courses || [];

        // Unsubscribe from previous course listeners if they exist
        unsubs.forEach(unsub => unsub());
        unsubs.length = 0; // Clear the array

        if (courseIds.length > 0) {
            const coursesQuery = query(collection(db, 'courses'), where(documentId(), 'in', courseIds));
            unsubs.push(onSnapshot(coursesQuery, (coursesSnap) => {
                setCourses(coursesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                setLoading(false);
            }));

            const assignmentsQuery = query(collection(db, "assignments"), where('courseId', 'in', courseIds));
            unsubs.push(onSnapshot(assignmentsQuery, (snap) => {
                setAssignments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            }));
            
            const submissionsQuery = query(collection(db, "submissions"), where('studentId', '==', user.uid), where('courseId', 'in', courseIds));
            unsubs.push(onSnapshot(submissionsQuery, (snap) => {
                setSubmissions(snap.docs.map(d => ({id: d.id, ...d.data()})));
            }));

        } else {
            setCourses([]);
            setAssignments([]);
            setSubmissions([]);
            setLoading(false);
        }
    });

    unsubs.push(userUnsub);

    return () => unsubs.forEach(unsub => unsub());
  }, [user]);

  const coursesWithProgress = useMemo(() => {
    return courses.map(course => {
        const courseAssignments = assignments.filter(a => a.courseId === course.id);
        if (courseAssignments.length === 0) return { ...course, progress: 0 };
        
        const completedSubmissions = submissions.filter(s => {
            const assignment = courseAssignments.find(a => a.id === s.assignmentId);
            return assignment && (s.status === 'Submitted' || s.status === 'Graded');
        });
        
        const progress = Math.round((completedSubmissions.length / courseAssignments.length) * 100);
        return { ...course, progress: isNaN(progress) ? 0 : progress };
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
            <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative aspect-video">
                    <Image
                      src={course.imageUrl || "/course-placeholder.jpg"}
                      fill
                      alt={course.name}
                      className="rounded-t-lg object-cover"
                      data-ai-hint="learning online course"
                    />
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="font-headline text-xl mb-2">{course.name}</CardTitle>
                <CardDescription className="line-clamp-3">{course.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex-col items-start gap-2 border-t mt-auto bg-secondary/50">
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
        <Card className="text-center p-12 bg-card">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <CardTitle className="mt-4">No Courses Yet</CardTitle>
          <CardDescription className="mt-2">You are not enrolled in any courses. Please contact your administrator to get started.</CardDescription>
        </Card>
      )}
    </div>
  );
}
