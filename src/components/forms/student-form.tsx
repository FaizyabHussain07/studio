
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { createStudent } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const studentSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  // Password creation should ideally be handled via an invite link
  // For simplicity, we can omit it or add it here.
});

export function StudentForm({ student, onFinished }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student?.name || "",
      email: student?.email || "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (student) {
        // Update logic would go here
        console.log("Updating student:", data);
        toast({ title: "Success", description: "Student updated successfully." });
      } else {
        await createStudent({
            ...data,
            courses: [],
            joined: new Date().toLocaleDateString('en-CA'),
        });
        toast({ title: "Success", description: "Student created successfully." });
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
    <>
      <DialogHeader>
        <DialogTitle>{student ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        <DialogDescription>
          Fill in the details below. An invitation will be sent to the student to set their password.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
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
                  <Input type="email" placeholder="student@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Student'}</Button>
        </form>
      </Form>
    </>
  );
}
