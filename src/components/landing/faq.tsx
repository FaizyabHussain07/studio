import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Who is considered an admin?",
    answer: "The user with the email 'syedfaizyabhussain07@gmail.com' is automatically granted admin privileges. All other registered users will have student accounts.",
  },
  {
    question: "Is the platform mobile-responsive?",
    answer: "Yes, Faizyab Al-Quran is designed to be fully responsive, providing a seamless experience on desktops, tablets, and smartphones.",
  },
  {
    question: "What kind of assignments can be created?",
    answer: "Admins can create assignments that include descriptions, attached files (like PDFs and images), and external links. Students can submit their work through file uploads or by providing links.",
  },
  {
    question: "How are quizzes handled?",
    answer: "Quizzes can be launched via external links (e.g., Google Forms) or built directly within the platform in future updates. This provides flexibility in how assessments are conducted.",
  },
   {
    question: "Can students track their progress?",
    answer: "Absolutely. The student dashboard provides a clear overview of course progress, assignment submission statuses, and upcoming deadlines to help students stay organized and on track.",
  },
];


export default function Faq() {
  return (
    <section id="faq" className="container py-20 md:py-32">
      <div className="text-center space-y-4 mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
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
