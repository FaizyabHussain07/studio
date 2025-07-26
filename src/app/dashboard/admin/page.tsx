'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, BookCopy, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getUsers, getCourses, getAssignments } from "@/lib/services"; // Assuming a getSubmissions function exists

export default function AdminDashboardPage() {
  const [stats, setStats] = useState([
    { title: "Total Students", value: "0", icon: Users },
    { title: "Total Courses", value: "0", icon: BookCopy },
    { title: "Total Submissions", value: "0", icon: CheckSquare },
  ]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [users, courses, assignments] = await Promise.all([
          getUsers(),
          getCourses(),
          getAssignments(), // In a real app, this should be getSubmissions()
        ]);

        const studentCount = users.filter(u => u.role === 'student').length;
        const courseCount = courses.length;
        // Placeholder for submission count
        const submissionCount = assignments.length; 

        setStats([
          { title: "Total Students", value: studentCount.toString(), icon: Users },
          { title: "Total Courses", value: courseCount.toString(), icon: BookCopy },
          { title: "Total Submissions", value: submissionCount.toString(), icon: CheckSquare },
        ]);

        // Placeholder for recent submissions
        // setRecentSubmissions(...) 

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

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
           {/* Recent submissions table will be implemented once submission logic is complete */}
          <p className="text-center text-muted-foreground">No recent submissions to display.</p>
        </CardContent>
      </Card>
    </div>
  );
}
