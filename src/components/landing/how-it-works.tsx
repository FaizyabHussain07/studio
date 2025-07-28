import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, LogIn, GraduationCap } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="w-12 h-12 text-primary" />,
    title: "1. Create an Account",
    description: "Sign up in seconds. Admins are automatically assigned, while all other users register as students.",
  },
  {
    icon: <LogIn className="w-12 h-12 text-primary" />,
    title: "2. Access Your Dashboard",
    description: "Log in to access your personalized dashboard with tools and information relevant to your role.",
  },
  {
    icon: <GraduationCap className="w-12 h-12 text-primary" />,
    title: "3. Start Learning/Managing",
    description: "Students can access courses and assignments, while admins can start managing the platform.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-secondary/50 py-20 md:py-32">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Getting Started is Easy</h2>
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
      </div>
    </section>
  );
}
