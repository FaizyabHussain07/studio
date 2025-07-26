import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, BookCopy, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { title: "Total Students", value: "150", icon: Users },
  { title: "Total Courses", value: "12", icon: BookCopy },
  { title: "Total Submissions", value: "452", icon: CheckSquare },
];

const recentSubmissions = [
  { id: "1", student: "Ayesha Khan", course: "Quranic Studies 101", assignment: "Tajweed Exercise 5", date: "2024-08-10", status: "Graded" },
  { id: "2", student: "Bilal Ahmed", course: "Islamic History", assignment: "Essay on the Caliphates", date: "2024-08-09", status: "Pending" },
  { id: "3", student: "Fatima Ali", course: "Arabic Language", assignment: "Grammar Worksheet 2", date: "2024-08-09", status: "Graded" },
  { id: "4", student: "Omar Hassan", course: "Quranic Studies 101", assignment: "Surah Al-Fatiha Memorization", date: "2024-08-08", status: "Pending" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your students, courses, and content.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.student}</TableCell>
                  <TableCell>{submission.course}</TableCell>
                  <TableCell>{submission.assignment}</TableCell>
                  <TableCell>{submission.date}</TableCell>
                  <TableCell>
                    <Badge variant={submission.status === 'Graded' ? 'default' : 'secondary'}>{submission.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Review</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
