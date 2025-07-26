
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { createCourse, updateCourse } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export function CourseForm({ course, onFinished }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: course?.name || "",
      description: course?.description || "",
      imageUrl: course?.imageUrl || "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (course) {
        await updateCourse(course.id, data);
        toast({ title: "Success", description: "Course updated successfully." });
      } else {
        await createCourse(data);
        toast({ title: "Success", description: "Course created successfully." });
      }
      onFinished();
    } catch (error) {
      console.error("Failed to save course:", error);
      toast({ title: "Error", description: "Could not save course.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{course ? 'Edit Course' : 'Create New Course'}</DialogTitle>
        <DialogDescription>
          Fill in the details below. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Quranic Studies 101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the course..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
        </form>
      </Form>
    </>
  );
}
