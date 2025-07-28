'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { createUser } from '@/lib/services';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
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
        courses: [],
        photoURL: user.photoURL
      });
      
      toast({
        title: "Account Created!",
        description: "Welcome! Redirecting you to your dashboard...",
      });

      if (role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/student');
      }

    } catch (error) {
      console.error("Failed to sign up:", error);
      toast({
        title: "Sign-up Failed",
        description: error.message || "This email might already be in use. Please try another one.",
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
            <Image src="/logo-circle.png" alt="Faizyab Al-Quran Logo" width={80} height={80} />
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
            <CardDescription>Join our learning community today.</CardDescription>
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
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
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
  );
}
