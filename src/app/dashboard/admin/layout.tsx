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
import { LayoutDashboard, Users, BookCopy, PenSquare, LogOut, Settings } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


const adminNav = [
  { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Students", href: "/dashboard/admin/students", icon: Users },
  { name: "Courses", href: "/dashboard/admin/courses", icon: BookCopy },
  { name: "Assignments", href: "/dashboard/admin/assignments", icon: PenSquare },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === 'syedfaizyabhussain07@gmail.com') {
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
            {adminNav.map((item) => (
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
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                     <span className="text-sm font-semibold">{user?.displayName || 'Admin'}</span>
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
          <SidebarTrigger />
           <Button variant="ghost" size="icon">
              <Settings />
          </Button>
        </header>
        <main className="p-4 md:p-6 bg-secondary/40 min-h-[calc(100vh-65px)]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
