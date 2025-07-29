
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createUser, updateUser } from "@/lib/services";

const studentCreateSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const studentUpdateSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
});


export function StudentForm({ student, onFinished }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(student ? studentUpdateSchema : studentCreateSchema),
    defaultValues: {
      name: student?.name || "",
      email: student?.email || "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (student) {
        // NOTE: Firebase Auth email updates are sensitive and should be done via a dedicated flow
        // for security reasons (e.g., sending a verification link).
        // Here, we only update the Firestore record.
        await updateUser(student.id, {
            name: data.name,
        });
        toast({ title: "Success", description: "Student updated successfully." });

      } else {
        // This is a placeholder for a more robust user creation flow.
        // In a real app, you would use Firebase Functions to create the user in Auth.
        // This client-side approach is for demonstration and might have limitations.
        const tempId = `temp_${Date.now()}`;
        await createUser({
            uid: tempId, // This will be updated when the user is created in Auth
            name: data.name,
            email: data.email,
            role: 'student',
            joined: new Date().toLocaleDateString('en-CA'),
            courses: [],
            photoURL: ''
        });

        toast({ title: "Success", description: `Student profile for ${data.name} created. You must now create their authentication account separately with the same email and password.` });
      }
      onFinished();
    } catch (error) {
      console.error("Failed to save student:", error);
      toast({ title: "Error", description: "Could not save student. Email may already be in use.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} disabled={loading}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="student@example.com" {...field} disabled={loading || !!student}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           {!student && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temporary Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={loading}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
           )}
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Student'}</Button>
        </form>
      </Form>
  );
}
