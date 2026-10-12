import { Accessibility, Eye, History, LayoutGrid, ShieldCheck, Tags } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

const benefits = [
  {
    icon: Eye,
    title: "Transparent progress",
    body: "Every request has a status and a timeline, so you never have to chase an update.",
  },
  {
    icon: LayoutGrid,
    title: "One organised place",
    body: "Discovery, requests, notifications and history live together instead of across inboxes.",
  },
  {
    icon: Tags,
    title: "Clear pricing labels",
    body: "See a pricing model up front — fixed, hourly or custom quote — before you request.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy by design",
    body: "Built around role-based access, so people only see the records they're permitted to.",
  },
  {
    icon: History,
    title: "Complete history",
    body: "Completed and cancelled requests are kept in your history for easy reference.",
  },
  {
    icon: Accessibility,
    title: "Accessible everywhere",
    body: "Keyboard friendly, screen-reader labelled and responsive from phone to desktop.",
  },
];

export function Benefits() {
  return (
    <section aria-labelledby="benefits-title" className="bg-navy py-20 text-white sm:py-28 dark:bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-teal-300">Why NexaHub</p>
          <h2 id="benefits-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Designed to remove the friction from getting help
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            Thoughtful defaults for the people requesting services and the teams delivering them.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05} className="bg-navy p-7 dark:bg-card">
              <b.icon className="size-5 text-teal-300" aria-hidden />
              <h3 className="mt-5 font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{b.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
