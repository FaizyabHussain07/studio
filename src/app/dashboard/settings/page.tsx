
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { updateUser, getUser } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getUser(currentUser.uid);
        setDbUser(userDoc);
        form.reset({ name: currentUser.displayName || '' });
      } else {
        setUser(null);
        setDbUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.displayName || '',
    },
  });

  const handleNameUpdate = async (data: z.infer<typeof profileSchema>) => {
    if (!user) return;
    setLoading(true);
    try {
      await updateProfile(user, { displayName: data.name });
      await updateUser(user.uid, { name: data.name });
      toast({ title: 'Success', description: 'Your name has been updated.' });
      setUser({ ...user }); // Trigger re-render
    } catch (error) {
      console.error('Error updating name:', error);
      toast({ title: 'Error', description: 'Could not update your name.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your inbox to reset your password.',
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      toast({
        title: 'Error',
        description: 'Could not send password reset email.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || event.target.files.length === 0 || !user) return;
      
      const file = event.target.files[0];
      setUploading(true);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
          const photoURL = reader.result as string;
          try {
              await updateProfile(user, { photoURL });
              await updateUser(user.uid, { photoURL });

              toast({ title: 'Success', description: 'Profile picture updated successfully.' });
              setUser({ ...user, photoURL }); // Force re-render with new image
          } catch (error) {
              console.error("Error uploading avatar:", error);
              toast({ title: 'Error', description: 'Failed to upload new profile picture.', variant: 'destructive'});
          } finally {
              setUploading(false);
          }
      };
      reader.onerror = (error) => {
          console.error("Error converting file to Data URL:", error);
          toast({ title: 'Error', description: 'Failed to read the image file.', variant: 'destructive'});
          setUploading(false);
      }
  }
  
  const dashboardUrl = dbUser?.role === 'admin' ? '/dashboard/admin' : '/dashboard/student';

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading profile...</div>;
  }

  if (!user) {
    return <div className="flex h-screen items-center justify-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
        <Button variant="ghost" asChild className="mb-4">
            <Link href={dashboardUrl}>
                <ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard
            </Link>
        </Button>
      <h1 className="text-3xl font-bold font-headline mb-8">Profile Settings</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="relative group">
                        <Avatar className="h-32 w-32 mb-4">
                            <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ''}/>
                            <AvatarFallback className="text-4xl">{user.displayName?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <Label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                           {uploading ? 'Uploading...' : 'Change'}
                        </Label>
                        <Input id="avatar-upload" type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} disabled={uploading}/>
                    </div>
                    <h2 className="text-xl font-semibold">{user.displayName}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your name and manage your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                 <form onSubmit={form.handleSubmit(handleNameUpdate)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                               <Input {...field} disabled={loading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div>
                          <Label>Email Address</Label>
                          <Input type="email" value={user.email ?? ''} disabled readOnly className="mt-2 bg-secondary/50"/>
                          <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
                      </div>
                      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
                 </form>
              </Form>
            </CardContent>
          </Card>
           <Card className="mt-8">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                     <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">Click the button to receive a password reset link in your email.</p>
                     </div>
                     <Button variant="outline" onClick={handlePasswordReset} disabled={loading}>{loading ? 'Sending...' : 'Reset Password'}</Button>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
