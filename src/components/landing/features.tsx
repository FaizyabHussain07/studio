
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookCopy, ClipboardCheck, LayoutDashboard, Bell, PenSquare, ShieldCheck, UserCheck, Accessibility, Globe } from "lucide-react";

const features = [
  {
    icon: <UserCheck className="w-10 h-10 text-primary" />,
    title: "Certified Teachers",
    description: "Learn from experienced and qualified instructors dedicated to your success.",
  },
  {
    icon: <LayoutDashboard className="w-10 h-10 text-primary" />,
    title: "Personalized Learning",
    description: "Courses and guidance structured for every individual's skill level and pace.",
  },
  {
    icon: <ClipboardCheck className="w-10 h-10 text-primary" />,
    title: "Modern LMS",
    description: "Intuitive and powerful dashboards for both students and administrators.",
  },
  {
    icon: <Accessibility className="w-10 h-10 text-primary" />,
    title: "Accessible Anytime",
    description: "Study online from any device, anywhere in the world, at your convenience.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    title: "Affordable Plans",
    description: "High-quality education with flexible and transparent pricing for every learner.",
  },
  {
    icon: <BookCopy className="w-10 h-10 text-primary" />,
    title: "Digital Library",
    description: "Access a rich collection of Islamic books and learning resources anytime.",
  },
];

export default function Features() {
  return (
    <section id="features" className="container py-20 md:py-32">
      <div className="text-center space-y-4 mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Why Choose Faizyab Al-Quran?</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Our platform is packed with features designed to create a seamless and effective learning experience for everyone involved.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                {feature.icon}
              </div>
              <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardDescription className="mt-2 text-base">
              {feature.description}
            </CardDescription>
          </Card>
        ))}
      </div>
    </section>
  );
}
