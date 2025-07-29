
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, BookCopy, CheckSquare, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getSubmissions } from "@/lib/services";
import { onSnapshot, collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Submission = {
    id: string;
    studentName: string;
    assignmentTitle: string;
    courseName: string;
    submissionDate: string;
    status: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    students: { title: "Total Students", value: "0", icon: Users },
    courses: { title: "Total Courses", value: "0", icon: BookCopy },
    submissions: { title: "Total Submissions", value: "0", icon: CheckSquare },
    quizzes: { title: "Total Quizzes", value: "0", icon: HelpCircle }
  });
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialCounts = async () => {
        setLoading(true);
        try {
            const [studentsSnap, coursesSnap, submissionsSnap, quizzesSnap] = await Promise.all([
                getCountFromServer(query(collection(db, "users"), where("role", "==", "student"))),
                getCountFromServer(collection(db, "courses")),
                getCountFromServer(collection(db, "submissions")),
                getCountFromServer(collection(db, "quizzes"))
            ]);

            setStats({
                students: { ...stats.students, value: studentsSnap.data().count.toString() },
                courses: { ...stats.courses, value: coursesSnap.data().count.toString() },
                submissions: { ...stats.submissions, value: submissionsSnap.data().count.toString() },
                quizzes: { ...stats.quizzes, value: quizzesSnap.data().count.toString() }
            });

            const submissionsData = await getSubmissions(5);
            setRecentSubmissions(submissionsData as Submission[]);
        } catch (error) {
            console.error("Error fetching initial counts", error);
        } finally {
            setLoading(false);
        }
    };
    fetchInitialCounts();

    const unsubmissions = [
        onSnapshot(query(collection(db, "users"), where("role", "==", "student")), (snap) => setStats(prev => ({ ...prev, students: {...prev.students, value: snap.size.toString()} }))),
        onSnapshot(collection(db, "courses"), (snap) => setStats(prev => ({ ...prev, courses: {...prev.courses, value: snap.size.toString()} }))),
        onSnapshot(collection(db, "quizzes"), (snap) => setStats(prev => ({ ...prev, quizzes: {...prev.quizzes, value: snap.size.toString()} }))),
        onSnapshot(collection(db, "submissions"), async (snap) => {
            setStats(prev => ({ ...prev, submissions: {...prev.submissions, value: snap.size.toString()} }));
            const submissionsData = await getSubmissions(5);
            setRecentSubmissions(submissionsData as Submission[]);
        })
    ];
    
    return () => unsubmissions.forEach(unsub => unsub());

  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">A real-time overview of your learning platform.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
