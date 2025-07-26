
'use client';

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createAssignment, updateAssignment } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  instructions: z.string().min(1, "Instructions are required"),
  dueDate: z.string().min(1, "Due date is required"),
  courseId: z.string().min(1, "Please select a course"),
});

export function AssignmentForm({ courses, assignment, onFinished }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: assignment?.title || "",
      instructions: assignment?.instructions || "",
      dueDate: assignment?.dueDate || "",
      courseId: assignment?.courseId || "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (assignment) {
        await updateAssignment(assignment.id, data);
        toast({ title: "Success", description: "Assignment updated successfully." });
      } else {
        await createAssignment(data);
        toast({ title: "Success", description: "Assignment created successfully." });
      }
      onFinished();
    } catch (error) {
      console.error("Failed to save assignment:", error);
      toast({ title: "Error", description: "Could not save assignment.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Chapter 1 Summary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea placeholder="Provide detailed instructions for the assignment..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
