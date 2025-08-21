
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
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
            <form action="https://formsubmit.co/faizyab.al.quran@gmail.com" method="POST" className="space-y-4">
              {/* Formspree settings */}
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_next" value="https://faizyab-al-quran.app-prototyper.app/landing/thank-you" />
              <input type="hidden" name="_autoresponse" value="Thank you for contacting Faizyab Al-Quran! We have received your message and will get back to you shortly." />
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Enter your name" required/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Enter your email" required/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Enter your message" className="min-h-[120px]" required/>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
