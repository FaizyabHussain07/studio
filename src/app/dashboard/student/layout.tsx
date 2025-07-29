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
import { LayoutDashboard, BookOpen, ClipboardList, LogOut, User as UserIcon, GraduationCap, StickyNote } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";


const studentNav = [
  { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
  { name: "My Courses", href: "/dashboard/student/courses", icon: BookOpen },
  { name: "All Assignments", href: "/dashboard/student/assignments", icon: ClipboardList },
  { name: "Quizzes", href: "/dashboard/student/quizzes", icon: GraduationCap },
  { name: "Notes", href: "/dashboard/student/notes", icon: StickyNote },
];

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if(currentUser.email === 'syedfaizyabhussain07@gmail.com') {
            router.push('/dashboard/admin');
            return;
        }
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

  if (!user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-center p-2">
            <Logo showText={false}/>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {studentNav.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild
                  isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard/student')}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
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
                    <AvatarImage src={user?.photoURL ?? undefined} />
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
              <UserIcon />
          </Button>
        </header>
        <main className="p-4 md:p-6 bg-secondary/40 min-h-[calc(100vh-65px)]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
