import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Eye, HeartHandshake, Layers, Lock, Sparkles } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "Why NexaHub exists, the principles behind it, and where the platform is heading.",
};

const principles = [
  { icon: Eye, title: "Clarity over noise", body: "Every request has one status and one timeline. No guessing, no chasing." },
  { icon: Lock, title: "Privacy by default", body: "People see only what they're permitted to see. Access is designed in, not bolted on." },
  { icon: HeartHandshake, title: "Respect for time", body: "Short forms, sensible defaults and fewer clicks between a need and a result." },
  { icon: Layers, title: "Built to grow", body: "A modular foundation that can support more services, teams and workflows." },
];

const roadmap = [
  { phase: "Now", title: "Frontend prototype", body: "The complete interface with fictional data, so the experience can be reviewed end to end." },
  { phase: "Next", title: "Secure backend", body: "Supabase database, authentication, row-level security and server-side admin checks." },
  { phase: "Then", title: "Launch readiness", body: "Automated tests, monitoring and deployment to production hosting." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,black,transparent)]" />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="text-sm font-semibold text-primary">About NexaHub</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
            Getting help should feel <span className="text-gradient-brand">simple.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Requesting a service often means scattered emails, unclear pricing and no idea what
            happens next. NexaHub brings it all into one calm, transparent place — for the people
            asking for help and the teams providing it.
          </p>
        </div>
      </section>

      <section aria-labelledby="mission-title" className="border-y border-border bg-card py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Compass className="size-5" aria-hidden />
            </span>
            <h2 id="mission-title" className="mt-5 text-3xl font-semibold tracking-tight">
              Our mission
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Connect people with the services they need through a single experience that is easy
              to use, honest about what to expect, and respectful of their data.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-2xl border border-border bg-background p-8">
            <Sparkles className="size-5 text-teal" aria-hidden />
            <p className="mt-4 text-xl leading-relaxed font-medium tracking-tight">
              &ldquo;Your Services. Simplified.&rdquo; is more than a tagline — it&apos;s the test
              every screen in NexaHub has to pass.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="principles-title" className="text-center text-3xl font-semibold tracking-tight">
            The principles we design by
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06} className="rounded-2xl border border-border bg-card p-6">
                <p.icon className="size-5 text-primary" aria-hidden />
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="roadmap-title" className="border-t border-border bg-card py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 id="roadmap-title" className="text-3xl font-semibold tracking-tight">
            Where we are today
          </h2>
          <p className="mt-3 text-muted-foreground">
            NexaHub is being built in clear, reviewable phases.
          </p>
          <ol className="mt-10 space-y-4">
            {roadmap.map((r) => (
              <li key={r.title} className="flex gap-5 rounded-2xl border border-border bg-background p-6">
                <span className="h-fit rounded-full bg-primary/10 px-2.5 py-1 font-mono text-xs font-semibold text-primary">
                  {r.phase}
                </span>
                <div>
                  <h3 className="font-semibold">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/services">
                Explore services <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
