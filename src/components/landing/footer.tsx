
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
      fill="currentColor"
      {...props}
    >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.885-.002 2.024.63 3.891 1.697 5.661l.33 1.014-1.2 4.375 4.463-1.164.99-.311z"/>
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
