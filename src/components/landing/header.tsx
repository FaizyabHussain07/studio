
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, User, Settings } from 'lucide-react';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { getUser } from '@/lib/services';
import { Skeleton } from '../ui/skeleton';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Features', href: '#features' },
  { name: 'Courses', href: '#courses' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
            const userDoc = await getUser(currentUser.uid);
            setUserRole(userDoc?.role || 'student');
        } else {
            setUserRole(null);
        }
        setLoading(false);
    });

    return () => {
        window.removeEventListener('scroll', handleScroll);
        unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
      await auth.signOut();
  }
  
  const dashboardUrl = userRole === 'admin' ? '/dashboard/admin' : '/dashboard/student';

  const UserProfileButton = () => {
      if (loading) {
          return <Skeleton className="h-10 w-10 rounded-full" />;
      }

      if (user) {
          return (
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                       <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                          <Avatar>
                              <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ''} />
                              <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                       </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                          </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                         <Link href={dashboardUrl}><User className="mr-2 h-4 w-4"/> Dashboard</Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                         <Link href="/dashboard/settings"><Settings className="mr-2 h-4 w-4"/> Profile Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                         <LogOut className="mr-2 h-4 w-4"/> Logout
                      </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
          )
      }

      return (
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/signup">Sign Up</Link>
            </Button>
        </div>
      )
  }

  return (
    <header className={cn("sticky top-0 z-50 w-full transition-colors duration-300", isScrolled ? "bg-background/80 backdrop-blur-sm border-b" : "bg-transparent")}>
      <div className="container flex h-20 items-center justify-between">
        <Logo showText={true} />
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-accent transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>
        
        <UserProfileButton />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-6 p-6">
              <Logo showText={true} />
              <nav className="grid gap-4">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} className="text-lg font-medium hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                ))}
              </nav>
               { !user && (
                 <div className="flex flex-col gap-2">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                 </div>
               )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
