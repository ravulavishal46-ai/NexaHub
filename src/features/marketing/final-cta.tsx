import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-3xl bg-navy px-6 py-16 text-center text-white sm:px-16 dark:border dark:border-border dark:bg-card">
          <div className="bg-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
          <div className="absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-primary/40 blur-3xl" aria-hidden />
          <div className="relative">
            <h2 id="cta-title" className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to simplify the way you request services?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Create a demo account to explore the dashboard, or start by browsing the catalog.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild className="bg-white text-navy hover:bg-white/90">
                <Link href="/register">
                  Get Started <ArrowRight />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
