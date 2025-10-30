
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { createUser, addPendingEnrollment, getCourses } from '@/lib/services';
import { useToast } from "@/hooks/use-toast";
import { useState, Suspense, useEffect } from "react";
import { Logo } from "@/components/logo";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Course } from "@/lib/types";

function SignUpComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseIdFromQuery = searchParams.get('courseId');
  const courseName = searchParams.get('courseName');

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  useEffect(() => {
    // Only fetch courses if the user is signing up without a pre-selected course
    if (!courseIdFromQuery) {
        const fetchCourses = async () => {
            const coursesData = await getCourses();
            setAllCourses(coursesData);
        };
        fetchCourses();
    }
  }, [courseIdFromQuery]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const courseIdToEnroll = courseIdFromQuery || selectedCourseId;
    
    if (!courseIdToEnroll) {
        toast({
            title: "Course Selection Required",
            description: "Please select a course to enroll in.",
            variant: "destructive"
        });
        setLoading(false);
        return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });

      const role = email === 'syedfaizyabhussain07@gmail.com' ? 'admin' : 'student';
      
      const joinedDate = new Date();

      await createUser({
        uid: user.uid,
        name,
        email,
        role,
        joined: joinedDate.toLocaleDateString('en-CA'), // YYYY-MM-DD format
        courses: [], // Start with empty courses array
        photoURL: user.photoURL
      });
      
      if (role === 'student' && courseIdToEnroll) {
          await addPendingEnrollment(user.uid, courseIdToEnroll, joinedDate);
          
          const enrolledCourseName = courseName || allCourses.find(c => c.id === courseIdToEnroll)?.name;

          toast({
              title: "Request Sent!",
              description: `Your request to enroll in "${enrolledCourseName}" has been sent for approval.`
          })
      } else {
         toast({
            title: "Account Created!",
            description: "Welcome! Redirecting you to your dashboard...",
         });
      }

      if (role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/student');
      }

    } catch (error) {
      console.error("Failed to sign up:", error);
      toast({
        title: "Sign-up Failed",
        description: typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message
          : "An unknown error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center mb-6">
            <Logo showText={false} />
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
            <CardDescription>
                {courseName ? `To enroll in "${courseName}", please create an account.` : "Join our learning community today."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="Syed Faizyab Hussain" required disabled={loading}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={loading}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required minLength={6} disabled={loading}/>
              </div>
               {!courseIdFromQuery && (
                  <div className="space-y-2">
                    <Label htmlFor="course">Select a Course</Label>
                     <Select onValueChange={setSelectedCourseId} value={selectedCourseId} disabled={loading}>
                        <SelectTrigger id="course">
                            <SelectValue placeholder="Choose a course to enroll in" />
                        </SelectTrigger>
                        <SelectContent>
                            {allCourses.map(course => (
                                <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                            ))}
                        </SelectContent>
                     </Select>
                  </div>
                )}
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up & Enroll'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm">
            <p className="w-full">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-accent hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignUpComponent />
        </Suspense>
    )
}
