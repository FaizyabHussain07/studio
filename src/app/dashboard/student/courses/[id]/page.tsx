import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowLeft } from "lucide-react";

const courseData = {
  id: 'quran-101',
  name: "Quranic Studies 101",
  progress: 75,
  description: "This course covers the fundamentals of Tajweed, including the correct pronunciation of letters, articulation points, and the rules that apply to them. Students will also practice recitation of short surahs.",
  assignments: [
    { id: 'recitation-1', title: "Recitation of Surah Al-Fatiha", dueDate: "2024-07-20", status: "Graded" },
    { id: 'tajweed-hw-4', title: "Tajweed Exercise 4", dueDate: "2024-08-01", status: "Submitted" },
    { id: 'tajweed-hw-5', title: "Tajweed Exercise 5", dueDate: "2024-08-15", status: "Pending" },
    { id: 'mid-term-rec', title: "Mid-term Recitation", dueDate: "2024-08-25", status: "Pending" },
  ]
};

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch courseData based on params.id
  
  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard/student">
                <ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard
            </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">{courseData.name}</h1>
        <p className="text-muted-foreground mt-2">{courseData.description}</p>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
            <Progress value={courseData.progress} className="h-3" />
            <p className="text-md text-muted-foreground mt-2">{courseData.progress}% of course completed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Assignments</CardTitle>
          <CardDescription>Here are all the assignments for this course. Keep track of deadlines and submission statuses.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {courseData.assignments.map(assignment => (
              <li key={assignment.id} className="flex items-center justify-between p-4 hover:bg-secondary/50">
                <div className="flex items-center gap-4">
                  <FileText className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant={
                        assignment.status === 'Graded' ? 'default' : 
                        assignment.status === 'Submitted' ? 'secondary' : 'outline'
                    }>
                        {assignment.status}
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                       <Link href={`/dashboard/student/assignments/${assignment.id}`}>View</Link>
                    </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
