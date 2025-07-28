import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo showText={true} />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Faizyab Al-Quran. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
