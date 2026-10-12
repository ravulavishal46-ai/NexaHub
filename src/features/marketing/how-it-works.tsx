import { ClipboardCheck, MessageSquareText, Search, Workflow } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "./section-heading";

const steps = [
  {
    icon: Search,
    title: "Discover",
    body: "Browse the catalog, compare what's included and review illustrative pricing before you commit.",
  },
  {
    icon: MessageSquareText,
    title: "Request",
    body: "Describe your requirements, pick a preferred date and add any notes in a short guided form.",
  },
  {
    icon: Workflow,
    title: "Track",
    body: "Follow your request from Pending to In progress to Completed, with a timeline of every update.",
  },
  {
    icon: ClipboardCheck,
    title: "Review",
    body: "Every finished request stays in your history, so details are easy to find later.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="how-title"
          eyebrow="How NexaHub works"
          title="From need to done in four clear steps"
          description="No phone tag or lost emails. Every request follows the same transparent path."
        />
        <div className="relative mt-16">
          <div
            aria-hidden
            className="absolute top-6 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
          />
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              <Reveal delay={i * 0.08}>
                <div className="relative z-10 flex size-12 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm">
                  <step.icon className="size-5" aria-hidden />
                </div>
                <p className="mt-6 font-mono text-xs text-muted-foreground">Step {i + 1}</p>
                <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </Reveal>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
