import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, BookOpen, ClipboardList, Puzzle, LogOut, User } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const studentNav = [
  { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
  { name: "My Courses", href: "#", icon: BookOpen },
  { name: "Assignments", href: "#", icon: ClipboardList },
  { name: "Quizzes", href: "#", icon: Puzzle },
];

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {studentNav.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton href={item.href} tooltip={item.name}>
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/100x100.png" />
                    <AvatarFallback>SH</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                     <span className="text-sm font-semibold">Student User</span>
                     <span className="text-xs text-muted-foreground">student@example.com</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/login" tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
          <SidebarTrigger/>
          <Button variant="ghost" size="icon">
              <User />
          </Button>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
