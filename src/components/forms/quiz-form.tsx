
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createQuiz, updateQuiz } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const quizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  instructions: z.string().optional(),
  courseId: z.string().min(1, "Please select a course"),
  externalUrl: z.string().url("Please enter a valid URL"),
});

export function QuizForm({ courses, quiz, onFinished }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: quiz?.title || "",
      instructions: quiz?.instructions || "",
      courseId: quiz?.courseId || "",
      externalUrl: quiz?.externalUrl || "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (quiz) {
        await updateQuiz(quiz.id, data);
        toast({ title: "Success", description: "Quiz updated successfully." });
      } else {
        await createQuiz(data);
        toast({ title: "Success", description: "Quiz created successfully." });
      }
      onFinished();
    } catch (error) {
      console.error("Failed to save quiz:", error);
      toast({ title: "Error", description: "Could not save quiz.", variant: "destructive" });
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
                <FormLabel>Quiz Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mid-term Exam" {...field} />
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
                <FormLabel>Instructions (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Provide instructions for the quiz..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="externalUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>External URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://forms.gle/example" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Quiz'}</Button>
        </form>
      </Form>
  );
}
