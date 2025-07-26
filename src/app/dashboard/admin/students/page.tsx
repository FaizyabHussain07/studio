import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const students = [
  { id: "1", name: "Ayesha Khan", email: "ayesha.k@example.com", courses: 3, joined: "2023-01-15" },
  { id: "2", name: "Bilal Ahmed", email: "bilal.a@example.com", courses: 2, joined: "2023-02-20" },
  { id: "3", name: "Fatima Ali", email: "fatima.a@example.com", courses: 4, joined: "2023-03-10" },
  { id: "4", name: "Omar Hassan", email: "omar.h@example.com", courses: 1, joined: "2023-04-05" },
  { id: "5", name: "Zainab Malik", email: "zainab.m@example.com", courses: 3, joined: "2023-05-12" },
];

export default function ManageStudentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Manage Students</h1>
        <p className="text-muted-foreground">View, add, edit, or remove student profiles.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
             <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-8" />
             </div>
             <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Student
             </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Courses Enrolled</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                     <div className="flex items-center gap-3">
                        <Avatar>
                           <AvatarImage src={`https://placehold.co/40x40.png?text=${student.name.charAt(0)}`} />
                           <AvatarFallback>{student.name.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                           <p>{student.name}</p>
                           <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell>{student.courses}</TableCell>
                  <TableCell>{student.joined}</TableCell>
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
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
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
