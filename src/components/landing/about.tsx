
import Link from "next/link";
import { BookText, Goal, Eye } from "lucide-react";
import React from 'react';

const About = React.memo(function About() {
  return (
    <section id="about" className="bg-secondary/50 py-20 md:py-32">
      <div className="container max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">About Faizyab Al-Quran</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Faizyab Al-Quran is an innovative online platform designed to simplify Qur’anic and Islamic education for students and teachers alike. We believe learning should be structured, accessible, and spiritually fulfilling.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start p-6 border rounded-lg bg-card shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <Goal className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-headline text-2xl font-bold">Our Mission</h3>
                <p className="text-muted-foreground mt-2">To provide a single, unified, and powerful Learning Management System (LMS) that seamlessly integrates both sacred and academic streams of education.</p>
            </div>
             <div className="flex flex-col items-center md:items-start p-6 border rounded-lg bg-card shadow-sm">
                 <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <Eye className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-headline text-2xl font-bold">Our Vision</h3>
                <p className="text-muted-foreground mt-2">To empower a global community of learners by making high-quality Islamic and academic knowledge accessible, engaging, and transformative for everyone.</p>
            </div>
        </div>

        <div className="text-center pt-8">
            <blockquote className="border-l-4 border-primary pl-4 italic text-xl md:text-2xl max-w-3xl mx-auto">
                "Our goal is to unite sacred and academic learning under one seamless system."
            </blockquote>
           <Link href="https://www.linkedin.com/in/faizyabhussain/" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground text-lg pt-4 block hover:underline">
            Syed Faizyab Hussain
           </Link>
           <p className="text-sm text-muted-foreground">Founder, Faizyab Al-Quran</p>
        </div>
      </div>
    </section>
  );
});

export default About;
