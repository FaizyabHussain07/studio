
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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
    <section id="contact" className="bg-secondary/50 py-20 md:py-32">
      <div className="container">
        <Card className="max-w-2xl mx-auto shadow-lg border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl md:text-4xl">Contact Us</CardTitle>
            <CardDescription className="text-lg">
              Have a question or feedback? Drop us a line!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Formsubmit.co settings */}
              <input type="hidden" name="_next" value="https://faizyab-al-quran.vercel.app/" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_subject" value="New Contact Form Submission" />
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Enter your name" required disabled={loading}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Enter your email" required disabled={loading}/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Enter your message" className="min-h-[120px]" required disabled={loading}/>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
