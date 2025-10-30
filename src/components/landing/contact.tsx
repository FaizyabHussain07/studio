
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useState } from "react";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    
    try {
      const response = await fetch("https://formsubmit.co/faizyab.al.quran@gmail.com", {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        (event.target as HTMLFormElement).reset();
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
       toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
  }

  return (
    <section id="contact" className="bg-primary text-primary-foreground py-20 md:py-32">
      <div className="container text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Begin Your Qur’anic Journey Today!</h2>
        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mt-4">
          Join hundreds of learners on Faizyab Al-Quran and experience structured, meaningful, and modern Islamic education.
        </p>
        <Button asChild size="lg" className="mt-8 bg-background text-foreground hover:bg-background/90">
            <Link href="/signup">Start Free Trial</Link>
        </Button>
      </div>
    </section>
  );
}
