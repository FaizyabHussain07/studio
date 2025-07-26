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
                    <AvatarImage src="https://placehold.co/100x100.png" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                     <span className="text-sm font-semibold">Syed Faizyab</span>
                     <span className="text-xs text-muted-foreground">Admin</span>
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
