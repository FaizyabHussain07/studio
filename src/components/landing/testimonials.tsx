import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ali Khan",
    role: "Student",
    quote: "The structured courses and dedicated instructors have profoundly deepened my understanding of the Quran. It's an invaluable resource for any serious student.",
    avatar: "/WhatsApp_Image_2025-07-07_at_16.40.56_083d1ca9-removebg-preview.png"
  },
  {
    name: "Fatima Ahmed",
    role: "Student",
    quote: "I love the flexibility of the platform. I can access my lessons and assignments anytime, which fits perfectly with my busy schedule. The user interface is so intuitive!",
    avatar: "/WhatsApp_Image_2025-07-07_at_16.40.56_083d1ca9-removebg-preview.png"
  },
  {
    name: "Zainab Omar",
    role: "Student",
    quote: "Faizyab Al-Quran has been a blessing. The interactive assignments and timely feedback from the admin have made my learning journey engaging and effective.",
    avatar: "/WhatsApp_Image_2025-07-07_at_16.40.56_083d1ca9-removebg-preview.png"
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="container py-20 md:py-32">
      <div className="text-center space-y-4 mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">What Our Students Say</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Hear from members of our community about their learning experience.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="p-6 shadow-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-accent fill-current" />)}
              </div>
              <blockquote className="text-muted-foreground italic border-l-2 border-primary pl-4">
                "{testimonial.quote}"
              </blockquote>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
