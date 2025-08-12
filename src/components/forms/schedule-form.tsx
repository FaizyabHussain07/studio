
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createSchedule, updateSchedule, getStudentCourses, getSchedulesByStudent } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const scheduleSchema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  courseId: z.string().min(1, "Please select a course"),
  classDate: z.string().min(1, "Date is required"),
  classTime: z.string().min(1, "Time is required"),
  teacherName: z.string().min(1, "Teacher name is required"),
  classNumber: z.number().min(1),
  title: z.string().optional(),
  platform: z.enum(["Google Meet", "Zoom"]),
  meetingLink: z.string().url("Please enter a valid URL"),
  meetingId: z.string().optional(),
  meetingPassword: z.string().optional(),
});

type ScheduleFormProps = {
    students: any[];
    courses: any[];
    schedule: any | null;
    onFinished: () => void;
};

export function ScheduleForm({ students, courses, schedule, onFinished }: ScheduleFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [studentCourses, setStudentCourses] = useState<any[]>([]);

  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      studentId: schedule?.studentId || "",
      courseId: schedule?.courseId || "",
      classDate: schedule?.classDate ? new Date(schedule.classDate).toISOString().split('T')[0] : "",
      classTime: schedule?.classTime || "",
      teacherName: schedule?.teacherName || "Faizyab Hussain",
      classNumber: schedule?.classNumber || 1,
      title: schedule?.title || "",
      platform: schedule?.platform || "Google Meet",
      meetingLink: schedule?.meetingLink || "",
      meetingId: schedule?.meetingId || "",
      meetingPassword: schedule?.meetingPassword || "",
    },
  });

  const selectedStudentId = form.watch("studentId");
  const selectedCourseId = form.watch("courseId");

  const fetchStudentCourses = useCallback(async (studentId: string) => {
    if (!studentId) {
      setStudentCourses([]);
      form.setValue('courseId', '');
      return;
    }
    const enrolledCourses = await getStudentCourses(studentId);
    const filteredCourses = enrolledCourses.filter(c => c.status === 'enrolled');
    setStudentCourses(filteredCourses);

    if (filteredCourses.length === 1) {
      form.setValue('courseId', filteredCourses[0].id, { shouldValidate: true });
    } else {
       form.setValue('courseId', '');
    }
  }, [form]);

  useEffect(() => {
    if (selectedStudentId) {
        fetchStudentCourses(selectedStudentId);
    }
  }, [selectedStudentId, fetchStudentCourses]);

  useEffect(() => {
    const setInitialCourse = async () => {
        if(schedule?.studentId) {
            await fetchStudentCourses(schedule.studentId);
            form.setValue('courseId', schedule.courseId);
        }
    }
    if(schedule) setInitialCourse();
  }, [schedule, form, fetchStudentCourses]);


  useEffect(() => {
    const setNextClassNumber = async () => {
      if(selectedCourseId && !schedule) { // Only auto-update for new schedules
          const existingSchedules = await getSchedulesByStudent(selectedStudentId);
          const courseSchedules = existingSchedules.filter(s => s.courseId === selectedCourseId);
          form.setValue('classNumber', courseSchedules.length + 1);
          form.setValue('title', `Lesson ${courseSchedules.length + 1}`);
      }
    }
    setNextClassNumber();
  }, [selectedCourseId, selectedStudentId, form, schedule]);


  const onSubmit = async (data: z.infer<typeof scheduleSchema>) => {
    setLoading(true);
    try {
      if (schedule) {
        await updateSchedule(schedule.id, data);
        toast({ title: "Success", description: "Schedule updated successfully." });
      } else {
        await createSchedule(data);
        toast({ title: "Success", description: "Class scheduled successfully." });
      }
      onFinished();
    } catch (error) {
      console.error("Failed to save schedule:", error);
      toast({ title: "Error", description: "Could not save schedule.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };
  
  const platform = form.watch('platform');

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students.map(student => (
                            <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={loading || !selectedStudentId || studentCourses.length === 0}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {studentCourses.map(course => (
                            <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="classDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={loading}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="classTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} disabled={loading}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
           </div>

           <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Title (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Lesson 1: Introduction" {...field} disabled={loading}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="Google Meet">Google Meet</SelectItem>
                           <SelectItem value="Zoom">Zoom</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="meetingLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://meet.google.com/..." {...field} disabled={loading}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          
          {platform === 'Zoom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <FormField
                    control={form.control}
                    name="meetingId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Meeting ID (Optional)</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., 123 456 7890" {...field} disabled={loading}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="meetingPassword"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password (Optional)</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., abcde1" {...field} disabled={loading}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
          )}
          
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Schedule'}</Button>
        </form>
      </Form>
  );
}
