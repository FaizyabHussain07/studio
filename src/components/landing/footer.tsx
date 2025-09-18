
'use client';

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail, Youtube, Briefcase } from "lucide-react";
import Link from "next/link";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
        <path fill="#25D366" d="M19.6,4.4c-1.9-1.9-4.4-2.9-7.1-2.9c-5.5,0-10,4.5-10,10c0,1.8,0.5,3.5,1.4,5.1L2.2,22l5.3-1.4c1.5,0.8,3.2,1.3,4.9,1.3h0c5.5,0,10-4.5,10-10C22.5,8.8,21.5,6.3,19.6,4.4z"/>
        <path fill="#FFFFFF" d="M16.9,14.1c-0.1-0.1-0.4-0.2-0.7-0.4c-0.3-0.2-1.8-0.9-2-1c-0.3-0.1-0.5-0.1-0.7,0.1c-0.2,0.2-0.8,0.9-1,1.1c-0.2,0.2-0.3,0.2-0.6,0.1c-0.3-0.1-1.3-0.5-2.4-1.5c-0.9-0.8-1.5-1.7-1.6-2c-0.1-0.3,0-0.5,0.1-0.6c0.1-0.1,0.2-0.3,0.4-0.4c0.1-0.1,0.2-0.2,0.3-0.4c0.1-0.1,0.1-0.3,0-0.4c-0.1-0.1-0.7-1.7-0.9-2.2c-0.2-0.6-0.5-0.5-0.7-0.5c-0.2,0-0.4,0-0.6,0c-0.2,0-0.6,0.1-0.9,0.4c-0.3,0.3-1.1,1.1-1.1,2.7c0,1.6,1.2,3.1,1.3,3.3c0.1,0.2,2.3,3.5,5.5,4.9c0.8,0.3,1.4,0.5,1.9,0.6c0.8,0.2,1.5,0.1,2.1-0.1c0.6-0.2,1.8-0.8,2.1-1.5c0.3-0.7,0.3-1.4,0.2-1.5C17.3,14.3,17.1,14.2,16.9,14.1z"/>
    </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="#1877F2" stroke="none" />
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
            
          </div>
        </div>
      </div>
    </footer>
  );
}
