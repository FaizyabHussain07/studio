
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail, Youtube } from "lucide-react";
import Link from "next/link";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      <path d="M14.05 14.05a2 2 0 0 1-2.83 0L10 12.83l-1.22 1.22a2 2 0 0 1-2.83 0" stroke="none"></path>
    </svg>
);


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
              <a href="mailto:faizyab.al.quran@gmail.com" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://x.com/FaizyabHus74391" aria-label="Twitter" target="_blank">
                <Twitter className="h-5 w-5" />
              </Link>
            </Button>
             <Button variant="ghost" size="icon" asChild>
                <a href="https://www.youtube.com/@FaizyabAlQuran" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <Youtube className="h-5 w-5" />
                </a>
            </Button>
             <Button variant="ghost" size="icon" asChild>
                <a href="https://whatsapp.com/channel/0029Vb1JCt9CBtxIbIs9FJ3p" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <WhatsAppIcon className="h-5 w-5" />
                </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://github.com/FaizyabHussain07/studio" aria-label="GitHub" target="_blank">
                <Github className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://www.linkedin.com/company/faizyab-al-quran/" aria-label="LinkedIn" target="_blank">
                <Linkedin className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
