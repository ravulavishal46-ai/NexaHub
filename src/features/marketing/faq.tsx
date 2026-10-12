import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "./section-heading";

export const faqs = [
  {
    q: "What is NexaHub?",
    a: "NexaHub is a service management platform. You can browse services, submit requests, and track each request from submission to completion in one place.",
  },
  {
    q: "Is this a live service?",
    a: "Not yet. This version is a frontend prototype. Services, prices, people and requests are fictional examples, and anything you do is stored only in your own browser.",
  },
  {
    q: "How do I track a request?",
    a: "Open your dashboard and go to My Requests. Each request shows its current status — Pending, In progress, Completed or Cancelled — plus a timeline of every update.",
  },
  {
    q: "Are the prices real?",
    a: "No. Prices are illustrative labels that show how fixed, hourly and custom-quote pricing will appear. Final pricing would be confirmed before any work starts.",
  },
  {
    q: "Who can see my information?",
    a: "The production platform is designed so you can only see your own requests, and only authorised administrators can manage platform records. That access control will be enforced on the server and in the database in a later development phase.",
  },
  {
    q: "Can I cancel a request?",
    a: "Yes. A request that is still pending can be cancelled from its detail page. It then moves to your request history.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 border-t border-border bg-card py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <SectionHeading
          id="faq-title"
          align="left"
          eyebrow="FAQ"
          title="Questions, answered"
          description="Everything you need to know about how NexaHub works today and what comes next."
        />
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
