import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, LogIn, GraduationCap } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const steps = [
  {
    icon: <UserPlus className="w-12 h-12 text-primary" />,
    title: "1. Create Account",
    description: "Sign up in seconds to start your learning journey.",
  },
  {
    icon: <LogIn className="w-12 h-12 text-primary" />,
    title: "2. Access Dashboard",
    description: "View your courses, assignments, and progress in one place.",
  },
  {
    icon: <GraduationCap className="w-12 h-12 text-primary" />,
    title: "3. Start Learning",
    description: "Begin your Qur’anic journey immediately with our structured content.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-secondary/50 py-20 md:py-32">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Getting Started Is Easy</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow these simple steps to begin your journey with Faizyab Al-Quran.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
          {steps.map((step, index) => (
             <div key={index} className="relative flex flex-col items-center text-center z-10">
                <div className="bg-background rounded-full p-6 border-2 border-dashed border-primary mb-4">
                    {step.icon}
                </div>
                <h3 className="font-headline text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground mt-2">{step.description}</p>
            </div>
          ))}
        </div>
         <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="/signup">
                    Join Now
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
