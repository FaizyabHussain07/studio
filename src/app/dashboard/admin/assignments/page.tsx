import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const assignments = [
  { id: "1", title: "Tajweed Exercise 5", course: "Quranic Studies 101", dueDate: "2024-08-15", submissions: "35/45" },
  { id: "2", title: "Essay on the Caliphates", course: "Islamic History", dueDate: "2024-08-20", submissions: "20/32" },
  { id: "3", title: "Grammar Worksheet 2", course: "Arabic Language", dueDate: "2024-08-10", submissions: "50/50" },
  { id: "4", title: "Surah Al-Fatiha Memorization", course: "Quranic Studies 101", dueDate: "2024-08-12", submissions: "40/45" },
  { id: "5", title: "Fiqh of Salah", course: "Fiqh Basics", dueDate: "2024-08-18", submissions: "15/25" },
];

export default function ManageAssignmentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Manage Assignments</h1>
        <p className="text-muted-foreground">Oversee all assignments, check submissions, and provide grades.</p>
      </div>

      <Card>
        <CardHeader>
           <div className="flex items-center justify-between gap-4">
             <div className="flex items-center gap-2 w-full max-w-lg">
                <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search assignments..." className="pl-8" />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    <SelectItem value="quran-101">Quranic Studies 101</SelectItem>
                    <SelectItem value="islamic-hist">Islamic History</SelectItem>
                    <SelectItem value="arabic-lang">Arabic Language</SelectItem>
                    <SelectItem value="fiqh-basics">Fiqh Basics</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Assignment
             </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.title}</TableCell>
                  <TableCell>{assignment.course}</TableCell>
                  <TableCell>{assignment.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{assignment.submissions}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Submissions</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
