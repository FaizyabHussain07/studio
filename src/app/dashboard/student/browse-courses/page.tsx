
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Check, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { getCourses, addPendingEnrollment, getUser } from "@/lib/services";
import { Course as CourseType, User as UserType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const isValidImageUrl = (url: string | undefined | null): url is string => {
    if (!url || typeof url !== 'string') return false;
    return url.startsWith('/') || url.startsWith('https://');
};

export default function BrowseCoursesPage() {
  const [allCourses, setAllCourses] = useState<CourseType[]>([]);
  const [student, setStudent] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

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
    
    const fetchAllCourses = async () => {
        try {
            const coursesData = await getCourses();
            setAllCourses(coursesData);
        } catch (error) {
            console.error("Failed to fetch all courses:", error);
        }
    };
    
    fetchAllCourses();

    const unsubCourses = onSnapshot(collection(db, 'courses'), fetchAllCourses);
    const unsubUser = onSnapshot(doc(db, 'users', user.uid), async (doc) => {
        if(doc.exists()) {
            setStudent({ id: doc.id, ...doc.data() } as UserType);
        }
        setLoading(false);
    });
    
    return () => {
      unsubCourses();
      unsubUser();
    };
  }, [user]);
  
  const handleEnrollmentRequest = async (courseId: string, courseName: string) => {
    if(!user) return;
    try {
        await addPendingEnrollment(user.uid, courseId, new Date());
        toast({
            title: "Request Sent!",
            description: `Your request to enroll in "${courseName}" has been sent for approval.`
        });
    } catch (error) {
        console.error("Failed to send enrollment request:", error);
        toast({
            title: "Error",
            description: "Could not send enrollment request. Please try again.",
            variant: "destructive"
        });
    }
  }

  if (loading) {
    return <div className="text-center p-8">Loading available courses...</div>;
  }
  
  const studentCourseIds = student?.courses?.map(c => c.courseId) || [];
  
  const getCourseStatus = (courseId: string) => {
      const studentCourse = student?.courses?.find(c => c.courseId === courseId);
      return studentCourse?.status || 'not-enrolled';
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Browse All Courses</h1>
        <p className="text-muted-foreground">Explore our full catalog of courses and enroll in something new today.</p>
      </div>

       {allCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {allCourses.map(course => {
                 const imageUrl = isValidImageUrl(course.imageUrl) ? course.imageUrl : 'https://placehold.co/600x400.png';
                 const status = getCourseStatus(course.id);
                 
                 return (
                    <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="p-0">
                             <div className="relative aspect-video">
                                <Image
                                src={imageUrl}
                                fill
                                alt={course.name}
                                className="rounded-t-lg object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                data-ai-hint={course.dataAiHint || ''}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 flex-grow">
                            <CardTitle className="font-headline text-xl mb-2">{course.name}</CardTitle>
                            <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                        </CardContent>
                        <CardFooter className="p-6 pt-0 mt-auto bg-card border-t">
                            {status === 'enrolled' ? (
                                <Button asChild className="w-full mt-4" variant="secondary">
                                    <Link href={`/dashboard/student/courses/${course.id}`}>
                                        <Check className="mr-2 h-4 w-4"/> Already Enrolled
                                    </Link>
                                </Button>
                            ) : status === 'pending' ? (
                                <Button className="w-full mt-4" variant="outline" disabled>
                                    <Clock className="mr-2 h-4 w-4"/> Pending Approval
                                </Button>
                            ) : status === 'completed' ? (
                                 <Button asChild className="w-full mt-4" variant="default">
                                    <Link href={`/dashboard/student/courses/${course.id}`}>
                                        View Course
                                    </Link>
                                </Button>
                            ) : (
                                <Button className="w-full mt-4" onClick={() => handleEnrollmentRequest(course.id, course.name)}>
                                    Request to Enroll <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                 )
            })}
          </div>
        ) : (
             <Card className="text-center p-12 bg-card mt-6">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <CardTitle className="mt-4">No Courses Available</CardTitle>
                <CardDescription className="mt-2">It looks like no courses have been created yet. Check back soon!</CardDescription>
            </Card>
        )}
    </div>
  );
}

