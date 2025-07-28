'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Features', href: '#features' },
  { name: 'How it Works', href: '#how-it-works' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
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
              <div className="flex flex-col gap-2">
                 <Button variant="ghost" asChild>
                    <Link href="/login">Sign In</Link>
                 </Button>
                 <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <Link href="/signup">Sign Up</Link>
                 </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
