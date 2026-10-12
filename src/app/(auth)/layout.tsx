import { CheckCircle2, Info } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const points = [
  "Browse a catalog of clearly described services",
  "Submit requests in a short guided form",
  "Track every request with a live status timeline",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,560px)] xl:grid-cols-[1fr_640px]">
      <div className="flex flex-col">
        <header className="flex h-16 items-center justify-between px-4 sm:px-8">
          <Logo />
          <ThemeToggle />
        </header>
        <main id="main" className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-[400px]">{children}</div>
        </main>
        <footer className="px-4 pb-6 text-center text-xs text-muted-foreground sm:px-8">
          <p className="mx-auto flex max-w-md items-start justify-center gap-1.5">
            <Info className="mt-px size-3.5 shrink-0" aria-hidden />
            Frontend prototype: these screens don&apos;t create real accounts, verify passwords or
            store credentials.
          </p>
        </footer>
      </div>

      <aside className="relative hidden overflow-hidden bg-navy text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="bg-grid absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
        <div className="absolute -right-24 -bottom-24 size-96 rounded-full bg-primary/40 blur-3xl" aria-hidden />
        <div className="absolute top-1/3 -left-20 size-72 rounded-full bg-teal/30 blur-3xl" aria-hidden />
        <p className="relative text-sm font-medium text-slate-300">Your Services. Simplified.</p>
        <div className="relative">
          <h2 className="text-4xl leading-tight font-semibold tracking-tight">
            One place for every service request.
          </h2>
          <ul className="mt-8 space-y-4">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-slate-200">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-300" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <p className="text-sm text-slate-300">
            Real sign-in will use Supabase Authentication with server-side checks and row-level
            security, added in a later phase.
          </p>
        </div>
      </aside>
    </div>
  );
}
