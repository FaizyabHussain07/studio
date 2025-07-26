'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, BookCopy, CheckSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { getStudentUsers, getCourses, getSubmissions } from "@/lib/services";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";


export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    students: { title: "Total Students", value: "0", icon: Users },
    courses: { title: "Total Courses", value: "0", icon: BookCopy },
    submissions: { title: "Total Submissions", value: "0", icon: CheckSquare },
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const qStudents = query(collection(db, "users"), where("role", "==", "student"));
    const unsubStudents = onSnapshot(qStudents, (snapshot) => {
      setStats(prev => ({ ...prev, students: {...prev.students, value: snapshot.size.toString()} }));
      setLoading(false);
    });
    
    const qCourses = collection(db, "courses");
    const unsubCourses = onSnapshot(qCourses, (snapshot) => {
      setStats(prev => ({ ...prev, courses: {...prev.courses, value: snapshot.size.toString()} }));
    });

    const qSubmissions = collection(db, "submissions");
    const unsubSubmissions = onSnapshot(qSubmissions, async (snapshot) => {
      setStats(prev => ({ ...prev, submissions: {...prev.submissions, value: snapshot.size.toString()} }));
       const submissionsData = await getSubmissions(5); // Get 5 most recent
       setRecentSubmissions(submissionsData);
    });

    return () => {
      unsubStudents();
      unsubCourses();
      unsubSubmissions();
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">A real-time overview of your learning platform.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(stats).map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
           {loading ? (
             <p className="text-center text-muted-foreground">Loading submissions...</p>
           ) : recentSubmissions.length === 0 ? (
             <p className="text-center text-muted-foreground">No recent submissions to display.</p>
           ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSubmissions.map(sub => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.studentName}</TableCell>
                      <TableCell>{sub.assignmentTitle}</TableCell>
                      <TableCell>{sub.courseName}</TableCell>
                      <TableCell>{sub.submissionDate}</TableCell>
                      <TableCell><Badge variant="outline">{sub.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
