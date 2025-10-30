
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookCopy, ClipboardCheck, LayoutDashboard, Bell, PenSquare } from "lucide-react";

const features = [
  {
    icon: <LayoutDashboard className="w-10 h-10 text-primary" />,
    title: "Role-Based Dashboards",
    description: "Separate, tailored dashboards for Students and Admins for a focused user experience.",
  },
  {
    icon: <BookCopy className="w-10 h-10 text-primary" />,
    title: "Course Management",
    description: "Admins can easily create, manage, and assign courses to students with just a few clicks.",
  },
  {
    icon: <PenSquare className="w-10 h-10 text-primary" />,
    title: "Assignments & Quizzes",
    description: "Create diverse assignments with file/link submissions and quizzes to assess learning.",
  },
  {
    icon: <Users className="w-10 h-10 text-primary" />,
    title: "User Management",
    description: "Full CRUD control for admins to manage student accounts and enrollments.",
  },
  {
    icon: <ClipboardCheck className="w-10 h-10 text-primary" />,
    title: "Progress Tracking",
    description: "Monitor student submissions and progress in real-time to provide timely feedback.",
  },
  {
    icon: <Bell className="w-10 h-10 text-primary" />,
    title: "Real-time Notifications",
    description: "Keep users informed about new assignments, deadlines, and announcements.",
  },
];

export default function Features() {
  return (
    <section id="features" className="container py-20 md:py-32">
      <div className="text-center space-y-4 mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Why Choose Us?</h2>
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
