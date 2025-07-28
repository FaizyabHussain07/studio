
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createCourse, updateCourse, updateUserCourses } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { MultiSelect } from "@/components/ui/multi-select";

const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url().optional().or(z.literal('')),
  enrolledStudentIds: z.array(z.string()).optional(),
  completedStudentIds: z.array(z.string()).optional(),
});

export function CourseForm({ course, students, onFinished }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: course?.name || "",
      description: course?.description || "",
      imageUrl: course?.imageUrl || "",
      enrolledStudentIds: course?.enrolledStudentIds || [],
      completedStudentIds: course?.completedStudentIds || [],
    },
  });

  const studentOptions = students.map(student => ({
    value: student.id,
    label: student.name,
  }));
  
  useEffect(() => {
    form.reset({
      name: course?.name || "",
      description: course?.description || "",
      imageUrl: course?.imageUrl || "",
      enrolledStudentIds: course?.enrolledStudentIds || [],
      completedStudentIds: course?.completedStudentIds || [],
    })
  }, [course, form]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const coursePayload = {
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl,
      };
      
      const enrolledIds = data.enrolledStudentIds || [];
      const completedIds = data.completedStudentIds || [];

      if (course) {
        await updateCourse(course.id, coursePayload);
        await updateUserCourses(course.id, enrolledIds, completedIds);
        toast({ title: "Success", description: "Course updated successfully." });
      } else {
        const newCourseId = await createCourse(coursePayload);
        await updateUserCourses(newCourseId, enrolledIds, completedIds);
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
           <FormField
            control={form.control}
            name="enrolledStudentIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enrolled Students</FormLabel>
                <FormControl>
                   <MultiSelect
                        options={studentOptions}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Select students to enroll..."
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="completedStudentIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Completed Students</FormLabel>
                <FormControl>
                   <MultiSelect
                        options={studentOptions}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Select students who have completed..."
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
        </form>
      </Form>
  );
}
