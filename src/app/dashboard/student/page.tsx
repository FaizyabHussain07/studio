import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookText, FileText } from "lucide-react";

const courses = [
  { id: 'quran-101', name: "Quranic Studies 101", progress: 75, description: "Fundamentals of Tajweed and recitation." },
  { id: 'islamic-hist', name: "Islamic History", progress: 40, description: "From the time of the Prophet (PBUH) to the Ottoman Empire." },
  { id: 'arabic-lang', name: "Arabic Language Beginners", progress: 60, description: "Learn the basics of Arabic grammar and vocabulary." },
];

const assignments = [
  { id: 'tajweed-hw', course: "Quranic Studies 101", title: "Tajweed Exercise 5", dueDate: "2024-08-15", status: "Pending" },
  { id: 'history-essay', course: "Islamic History", title: "Essay on the Caliphates", dueDate: "2024-08-20", status: "Pending" },
];

const quizzes = [
  { id: 'vocab-quiz', course: "Arabic Language Beginners", title: "Vocabulary Quiz 3", dueDate: "2024-08-12" },
];

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, Student!</h1>
        <p className="text-muted-foreground">Here's an overview of your academic progress.</p>
      </div>

      <section>
        <h2 className="text-2xl font-bold font-headline mb-4">My Courses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={course.progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">{course.progress}% complete</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/student/courses/${course.id}`}>
                    Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Tabs defaultValue="assignments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assignments">Upcoming Assignments</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>
          <TabsContent value="assignments">
            <Card>
              <CardContent className="p-6 space-y-4">
                {assignments.map(assignment => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 rounded-md border">
                    <div className="flex items-center gap-4">
                      <FileText className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">{assignment.course} &bull; Due: {assignment.dueDate}</p>
                      </div>
                    </div>
                    <Button asChild variant="secondary" size="sm">
                       <Link href={`/dashboard/student/assignments/${assignment.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="quizzes">
            <Card>
              <CardContent className="p-6 space-y-4">
                {quizzes.map(quiz => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 rounded-md border">
                     <div className="flex items-center gap-4">
                      <BookText className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">{quiz.title}</h3>
                        <p className="text-sm text-muted-foreground">{quiz.course} &bull; Due: {quiz.dueDate}</p>
                      </div>
                    </div>
                    <Button asChild variant="default" size="sm">
                       <Link href="#">Start Quiz</Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
