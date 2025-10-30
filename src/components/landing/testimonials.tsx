
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";


export default function Testimonials() {
  return (
    <section id="testimonials" className="container py-20 md:py-32">
      <div className="text-center space-y-4 mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">What Our Students Say</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Hear from members of our community about their learning experience.
        </p>
      </div>
      <Card className="p-6 md:p-12 bg-secondary/50 border-2 border-dashed">
         <div className="text-center">
            <h3 className="text-2xl font-semibold">Google Reviews Coming Soon!</h3>
            <p className="text-muted-foreground mt-2">
                This section is ready for your live Google Reviews. Please follow the instructions to get your embed code from a third-party widget provider.
            </p>
            <div className="flex justify-center gap-1 text-amber-400 mt-4">
                <Star/>
                <Star/>
                <Star/>
                <Star/>
                <Star/>
            </div>
         </div>
      </Card>
    </section>
  );
}
