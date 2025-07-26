import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, PlusCircle, Search, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";

const courses = [
  { id: 'quran-101', name: "Quranic Studies 101", students: 45, assignments: 12, description: "Fundamentals of Tajweed and recitation." },
  { id: 'islamic-hist', name: "Islamic History", students: 32, assignments: 8, description: "From the time of the Prophet (PBUH) to the Ottoman Empire." },
  { id: 'arabic-lang', name: "Arabic Language Beginners", students: 50, assignments: 15, description: "Learn the basics of Arabic grammar and vocabulary." },
  { id: 'fiqh-basics', name: "Fiqh Basics", students: 25, assignments: 5, description: "Introduction to Islamic jurisprudence." },
];

export default function ManageCoursesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Manage Courses</h1>
        <p className="text-muted-foreground">Create, edit, and manage all academic and Quranic courses.</p>
      </div>

      <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-8" />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Course
          </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map(course => (
            <Card key={course.id}>
              <CardHeader>
                <Image 
                  src="https://placehold.co/600x400.png"
                  alt={course.name}
                  width={600}
                  height={400}
                  className="rounded-t-lg object-cover aspect-video mb-4"
                  data-ai-hint="education learning"
                />
                 <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="font-headline">{course.name}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
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
              </CardHeader>
              <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students} Students</span>
                </div>
                 <span>{course.assignments} Assignments</span>
              </CardFooter>
            </Card>
          ))}
        </div>
    </div>
  );
}
