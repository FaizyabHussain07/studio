
'use client';

import React from 'react';
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail, Youtube, Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


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

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
     xmlns="http://www.w3.org/2000/svg" 
     width="24"
     height="24"
     viewBox="0 0 24 24" 
     {...props}
    >
        <path fill="#2AABEE" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2z"/>
        <path fill="#FFFFFF" d="M9.5,16.7c-0.2,0-0.4-0.1-0.6-0.2l-2.4-1.8c-0.4-0.3-0.5-0.9-0.2-1.3c0.3-0.4,0.9-0.5,1.3-0.2l1.6,1.2l4.8-3.1c0.4-0.3,1-0.1,1.3,0.3c0.3,0.4,0.1,1-0.3,1.3L10.3,16.4C10.1,16.6,9.8,16.7,9.5,16.7z M15,8.4c-0.5,0-1,0.2-1.4,0.6l-3.3,2.4c-0.2,0.1-0.4,0.1-0.6,0l-3.3-2.4C6,8.6,5.5,8.4,5,8.4C4.4,8.4,4,8.8,4,9.3c0,0.2,0.1,0.4,0.2,0.6l3.5,2.5c0.7,0.5,1.6,0.5,2.3,0l3.5-2.5c0.1-0.1,0.2-0.3,0.2-0.6C16,8.8,15.6,8.4,15,8.4z"/>
    </svg>
);


const Footer = React.memo(function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center md:items-start">
              <Logo showText={true} />
              <p className="text-sm text-muted-foreground mt-2 text-center md:text-left">Learning with Faith & Purpose</p>
               <div className="flex items-center gap-2 mt-4">
                <Button variant="ghost" size="icon" asChild className="transition-transform hover:scale-125">
                  <a href="https://www.youtube.com/@FaizyabAlQuran" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                     <Youtube className="text-red-600" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild className="transition-transform hover:scale-125">
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                     <Instagram className="text-pink-600" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild className="transition-transform hover:scale-125">
                  <a href="https://www.facebook.com/people/Faizyab-Al-Quran/61580511984639/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                     <Facebook className="text-blue-600" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild className="transition-transform hover:scale-125">
                   <a href="https://whatsapp.com/channel/0029Vb1JCt9CBtxIbIs9FJ3p" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <WhatsAppIcon />
                  </a>
                </Button>
                 <Button variant="ghost" size="icon" asChild className="transition-transform hover:scale-125">
                   <a href="https://t.me/yourchannel" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                    <TelegramIcon />
                  </a>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:col-span-2 gap-8 text-center md:text-left">
                <div>
                   <h4 className="font-semibold mb-2">Quick Links</h4>
                   <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <Link href="#about" className="hover:text-primary">About</Link>
                        <Link href="#courses" className="hover:text-primary">Courses</Link>
                        <Link href="#pricing" className="hover:text-primary">Pricing</Link>
                   </div>
                </div>
                 <div>
                   <h4 className="font-semibold mb-2">Support</h4>
                   <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <Link href="#faq" className="hover:text-primary">FAQ</Link>
                        <Link href="#contact" className="hover:text-primary">Contact</Link>
                        <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
                   </div>
                </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t pt-6 mt-8">
             <p className="text-sm text-muted-foreground text-center sm:text-left">
                © {new Date().getFullYear()} Faizyab Al-Quran. All rights reserved.
             </p>
          </div>
        </div>
    </footer>
  );
});
export default Footer;
