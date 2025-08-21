"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How do I reserve a study seat in the library?",
    answer: "Use our online reservation system to view available seats in real-time and book your spot. You can reserve up to 3 days in advance through your student portal."
  },
  {
    question: "What's the maximum reservation duration?",
    answer: "Standard reservations are for 4-hour blocks. Extended sessions may be available during exam periods - check the academic calendar for details."
  },
  {
    question: "Can I cancel or modify my reservation?",
    answer: "Yes, reservations can be modified or canceled up to 1 hour before your scheduled time through your account dashboard."
  },
  {
    question: "What happens if I'm late for my reservation?",
    answer: "Seats are held for 15 minutes past the reservation time. After that, the seat becomes available to other students."
  },
  {
    question: "Are group study spaces available?",
    answer: "Yes, we offer bookable group study rooms with capacity for 4-8 students. These can be reserved through the same system with a minimum of 2 group members."
  },
  {
    question: "Is the system accessible for students with disabilities?",
    answer: "Absolutely. We prioritize accessible seating and offer dedicated support through our accessibility services team. Contact us for personalized assistance."
  }
];

export function FAQSection() {
  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Answers to common questions about seat reservations and library usage
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="text-left hover:no-underline py-4 text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}