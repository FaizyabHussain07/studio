
'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, CheckCircle2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getStudentAssignmentsWithStatus } from "@/lib/services";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Badge } from "@/components/ui/badge";
import { collection, onSnapshot } from "firebase/firestore";

export default function AllAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const studentAssignments = await getStudentAssignmentsWithStatus(user.uid);
        const sortedAssignments = studentAssignments.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        setAssignments(sortedAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Listen for changes that would affect assignments
    const unsubs = [
        onSnapshot(collection(db, 'assignments'), fetchAssignments),
        onSnapshot(collection(db, 'submissions'), fetchAssignments),
        onSnapshot(collection(db, 'courses'), fetchAssignments),
    ];

    fetchAssignments(); // Initial fetch
    
    return () => unsubs.forEach(unsub => unsub());
  }, [user]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Graded':
        return { icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, badge: 'default', text: 'Graded' };
      case 'Submitted':
        return { icon: <CheckCircle2 className="h-5 w-5 text-blue-500" />, badge: 'secondary', text: 'Submitted' };
      case 'Missing':
         return { icon: <XCircle className="h-5 w-5 text-red-500" />, badge: 'destructive', text: 'Missing' };
      default:
        return { icon: <FileText className="h-5 w-5 text-primary" />, badge: 'outline', text: 'Pending' };
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading all assignments...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">All My Assignments</h1>
        <p className="text-muted-foreground">A complete list of all your assignments, past and present.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignments ({assignments.length})</CardTitle>
          <CardDescription>Browse through all assignments from your courses. Click "View" to see details and submit your work.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {assignments.length > 0 ? assignments.map(assignment => {
              const { icon, badge, text } = getStatusInfo(assignment.status);
              return (
                <li key={assignment.id} className="flex flex-wrap items-center justify-between p-4 hover:bg-secondary/50 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    {icon}
                    <div>
                      <h3 className="font-semibold">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Course: <span className="font-medium">{assignment.courseName}</span> | Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={badge} className="w-24 justify-center">{text}</Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/student/assignments/${assignment.id}`}>View</Link>
                    </Button>
                  </div>
                </li>
              )
            }) : (
              <p className="p-8 text-center text-muted-foreground">You don't have any assignments yet.</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
