
'use client';

import { Card, CardContent } from "@/components/ui/card";
import Script from "next/script";

export default function Testimonials() {
  return (
    <section id="testimonials" className="container py-20 md:py-32">
      <div className="text-center space-y-4 mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">What Our Students Say</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Hear from members of our community about their learning experience.
        </p>
      </div>
      
      <div data-romw-token="sO6LKNNBZmC0Ug7N8kuhb1Y2KhTgb0w8OvpywPiO2fOPTCWpsS" data-romw-lazy></div>
    
      <Script src="https://reviewsonmywebsite.com/js/v2/embed.js?id=4a24b3ba631386ba5f4ec3ef018ac9ca" type="text/javascript" defer></Script>
      
    </section>
  );
}
