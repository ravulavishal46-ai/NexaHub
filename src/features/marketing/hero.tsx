"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "./hero-visual";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.21, 0.6, 0.35, 1] as const },
});

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            {...fade(0)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs"
          >
            <span className="size-1.5 rounded-full bg-teal" aria-hidden />
            Your Services. Simplified.
          </motion.p>
          <motion.h1
            {...fade(0.08)}
            id="hero-title"
            className="mt-6 text-4xl leading-[1.05] font-semibold tracking-[-0.035em] sm:text-6xl lg:text-[68px]"
          >
            Every service you need,
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient-brand">managed in one place.</span>
          </motion.h1>
          <motion.p
            {...fade(0.16)}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            NexaHub brings discovery, requests and progress tracking together. Find the right
            service, describe what you need, and always know exactly what happens next.
          </motion.p>
          <motion.div {...fade(0.24)} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/services">
                Explore Services <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/#how-it-works">How It Works</Link>
            </Button>
          </motion.div>
          <motion.ul
            {...fade(0.32)}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            {["Clear status at every step", "Works on any device", "Privacy-first design"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-teal" aria-hidden />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="mt-16 sm:mt-20">
          <HeroVisual />
          <p className="mt-12 text-center text-xs text-muted-foreground">
            Illustrative product preview using fictional sample data.
          </p>
        </div>
      </div>
    </section>
  );
}
