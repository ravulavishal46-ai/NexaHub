export const siteConfig = {
  name: "NexaHub",
  tagline: "Your Services. Simplified.",
  description:
    "NexaHub is a smart service management platform: discover services, submit requests and track progress in one place.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Fictional contact details for the prototype. */
  contactEmail: "hello@nexahub.example",
};

export const marketingNav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
