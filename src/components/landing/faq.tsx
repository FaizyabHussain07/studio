import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do I enroll in a course?",
    answer: "Simply register for an account and then browse the available courses in your student dashboard. From there, you can send an enrollment request to the administrator.",
  },
  {
    question: "Is the platform mobile-friendly?",
    answer: "Yes, Faizyab Al-Quran is fully responsive and designed to work seamlessly on desktops, tablets, and smartphones, so you can learn on any device.",
  },
  {
    question: "Can I track my progress?",
    answer: "Absolutely. The student dashboard provides a clear overview of your course progress and assignment submission statuses in real-time, helping you stay organized and motivated.",
  },
   {
    question: "What kind of support is available?",
    answer: "We offer dedicated support to all our users. Depending on your plan, you can access email, WhatsApp, or even direct teacher support for any questions you may have.",
  },
];

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
        }
    }))
};


export default function Faq() {
  return (
    <section id="faq" className="container py-20 md:py-32">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="text-center space-y-4 mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
