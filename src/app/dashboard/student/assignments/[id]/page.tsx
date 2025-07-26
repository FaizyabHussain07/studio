import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, FileText, Paperclip, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const assignmentData = {
  id: 'tajweed-hw-5',
  title: "Tajweed Exercise 5",
  course: "Quranic Studies 101",
  dueDate: "2024-08-15",
  status: "Pending",
  instructions: "Please record a 2-minute audio of yourself reciting Surah Al-Ikhlas, focusing on the rules of Qalqalah. Upload the audio file in MP3 format. Additionally, submit a PDF document explaining the Qalqalah rule with five examples from the Quran.",
  attachments: [
    { name: "Qalqalah_Rules.pdf", url: "#" }
  ]
};

export default function AssignmentDetailPage({ params }: { params: { id:string } }) {
  // Fetch assignmentData based on params.id
  
  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard/student/courses/quran-101">
                <ArrowLeft className="mr-2 h-4 w-4"/> Back to Course
            </Link>
        </Button>
        <div className="flex items-center justify-between">
            <div>
                 <p className="text-sm text-primary font-medium">{assignmentData.course}</p>
                 <h1 className="text-3xl font-bold font-headline">{assignmentData.title}</h1>
                 <p className="text-muted-foreground mt-1">Due Date: {assignmentData.dueDate}</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">{assignmentData.status}</Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{assignmentData.instructions}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                    {assignmentData.attachments.map(file => (
                        <Button key={file.name} variant="outline" asChild>
                            <Link href={file.url}>
                                <Paperclip className="mr-2 h-4 w-4"/>
                                {file.name}
                            </Link>
                        </Button>
                    ))}
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Your Submission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2"/>
                        <p className="text-muted-foreground">Drag & drop files here or</p>
                        <Button variant="link" className="p-0 h-auto">click to browse</Button>
                    </div>
                    <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>Submit Assignment</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
