
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const teachers = [
  {
    name: "Hafiz Faizyab Hussain",
    title: "Expert in Quran & Islamic Studies Specialist",
    experience: "5+ years experience",
    certifications: ["Tajweed Expert", "Expert Quran Memorization", "Advanced Islamic Studies Specialist"],
    avatar: "https://i.ibb.co/XrvLDkcg/Generated-Image-September-27-2025-9-05-AM-min.png",
  },
  {
    name: "Hafiz Adeeb Kazmi",
    title: "Expert in Quran & Tarjuma",
    experience: "3+ Years Experience",
    certifications: ["Tarjuma Specialist", "Advanced Tajweed Expert", "Islamic Studies"],
    avatar: "https://i.ibb.co/PGY9Nn0/Whats-App-Image-2025-11-01-at-5-23-09-AM.jpg",
  },
];

const Teachers = React.memo(function Teachers() {
  return (
    <section id="teachers" className="bg-secondary/50 py-20 md:py-32">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Meet Our Instructors</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our teachers are certified scholars and Qur’an tutors dedicated to your spiritual and academic growth.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teachers.map((teacher, index) => (
            <Card key={index} className="flex flex-col sm:flex-row items-center gap-6 p-6 shadow-sm hover:shadow-lg transition-shadow">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarImage src={teacher.avatar} alt={teacher.name} />
                <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <CardTitle className="font-headline text-xl">{teacher.name}</CardTitle>
                <CardDescription className="text-primary font-medium">{teacher.title}</CardDescription>
                <div className="mt-4 space-y-2">
                    {teacher.certifications.map(cert => (
                        <div key={cert} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">{cert}</span>
                        </div>
                    ))}
                     <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">{teacher.experience}</span>
                    </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="lg">Become a Tutor</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Apply to be a Tutor</DialogTitle>
                        <DialogDescription>
                            If you are a qualified teacher, we'd love to hear from you. Fill out the form below to apply.
                        </DialogDescription>
                    </DialogHeader>
                    <form 
                        action="https://formsubmit.co/faizyab.al.quran@gmail.com" 
                        method="POST" 
                        encType="multipart/form-data"
                        className="space-y-4 py-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" placeholder="Enter your full name" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="qualifications">Qualifications & Experience</Label>
                            <Textarea id="qualifications" name="qualifications" placeholder="Briefly describe your teaching background..." required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="cv">Upload CV/Resume</Label>
                            <Input id="cv" name="attachment" type="file" required accept=".pdf,.doc,.docx" />
                        </div>
                        
                        {/* formsubmit.co settings */}
                        <input type="hidden" name="_subject" value="New Tutor Application!" />
                        <input type="hidden" name="_next" value="https://faizyab-al-quran.vercel.app/" />

                        <Button type="submit" className="w-full">
                           <Send className="mr-2 h-4 w-4" /> Submit Application
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>

      </div>
    </section>
  );
});

export default Teachers;
