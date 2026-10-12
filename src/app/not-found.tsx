import Link from "next/link";
import { Compass } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_65%)]" />
      <Logo className="mb-10" />
      <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Compass className="size-6" aria-hidden />
      </div>
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">We couldn&apos;t find that page</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The link may be broken or the page may have moved. Let&apos;s get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/services">Browse services</Link>
        </Button>
      </div>
    </main>
  );
}
