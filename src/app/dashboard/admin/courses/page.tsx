'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, PlusCircle, Search, Users, FileText } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getCourses, getAssignmentsByCourse, getStudentCountForCourse } from "@/lib/services";

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const courseData = await getCourses();
        const coursesWithDetails = await Promise.all(
          courseData.map(async (course) => {
            const assignments = await getAssignmentsByCourse(course.id);
            const studentCount = await getStudentCountForCourse(course.id);
            return { 
              ...course, 
              assignmentCount: assignments.length,
              studentCount: studentCount
            };
          })
        );
        setCourses(coursesWithDetails);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Manage Courses</h1>
        <p className="text-muted-foreground">Create, edit, and manage all academic and Quranic courses.</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative w-full sm:w-auto sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-8" />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Course
          </Button>
      </div>

      {loading ? <p className="text-center text-muted-foreground">Loading courses...</p> : (
        courses.length === 0 ? (
          <p className="text-center text-muted-foreground">No courses created yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map(course => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader className="p-0">
                  <Image 
                    src="https://placehold.co/600x400.png"
                    alt={course.name}
                    width={600}
                    height={400}
                    className="rounded-t-lg object-cover aspect-video"
                    data-ai-hint="education learning"
                  />
                </CardHeader>
                <CardContent className="flex-grow p-6 space-y-4">
                   <div className="flex items-start justify-between">
                      <div>
                          <CardTitle className="font-headline text-xl">{course.name}</CardTitle>
                          <CardDescription className="mt-1">{course.description}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit Course</DropdownMenuItem>
                          <DropdownMenuItem>Manage Students</DropdownMenuItem>
                          <DropdownMenuItem>View Assignments</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete Course</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                  <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.studentCount} Student{course.studentCount !== 1 ? 's' : ''}</span>
                  </div>
                   <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{course.assignmentCount} Assignment{course.assignmentCount !== 1 ? 's' : ''}</span>
                   </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
}
