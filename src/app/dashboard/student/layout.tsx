'use client'

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
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


const studentNav = [
  { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
  { name: "My Courses", href: "/dashboard/student", icon: BookOpen },
  { name: "Assignments", href: "#", icon: ClipboardList },
  { name: "Quizzes", href: "#", icon: Puzzle },
];

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  }

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
                    <AvatarImage src={user?.photoURL} />
                    <AvatarFallback>{user?.displayName?.substring(0,2).toUpperCase() || 'ST'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                     <span className="text-sm font-semibold">{user?.displayName || 'Student User'}</span>
                     <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
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
