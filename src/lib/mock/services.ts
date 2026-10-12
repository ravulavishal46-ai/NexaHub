import type { Category, Service } from "@/types";

/**
 * FICTIONAL DEMO DATA.
 * Services, prices and durations below are illustrative examples only.
 */

export const categories: Category[] = [
  {
    id: "home-repairs",
    name: "Home & Repairs",
    description: "Fixes, installs and inspections around the house.",
    icon: "wrench",
  },
  {
    id: "cleaning",
    name: "Cleaning",
    description: "Thorough cleaning for homes and workspaces.",
    icon: "spray",
  },
  {
    id: "it-support",
    name: "IT & Tech Support",
    description: "Devices, networks and data, sorted out.",
    icon: "laptop",
  },
  {
    id: "business",
    name: "Business Services",
    description: "Practical help for small teams and founders.",
    icon: "briefcase",
  },
  {
    id: "moving",
    name: "Moving & Logistics",
    description: "Packing, transport and setup support.",
    icon: "truck",
  },
  {
    id: "coaching",
    name: "Learning & Coaching",
    description: "One-to-one sessions to build new skills.",
    icon: "graduation",
  },
];

const stdProcess = (first: string, second: string) => [
  { title: "Submit your request", description: "Describe what you need and pick a preferred date." },
  { title: "Review & confirmation", description: first },
  { title: "Service delivery", description: second },
  { title: "Wrap-up", description: "You confirm completion and the request moves to your history." },
];

export const services: Service[] = [
  {
    id: "svc-plumbing",
    slug: "plumbing-repair",
    name: "Plumbing Repair",
    categoryId: "home-repairs",
    icon: "wrench",
    shortDescription: "Leaks, clogs and fixture repairs handled by a vetted technician.",
    description:
      "Fix dripping taps, slow drains, running toilets and minor pipe leaks. A technician assesses the issue on arrival, explains the fix and completes most repairs in a single visit.",
    features: [
      "On-site diagnosis before any work starts",
      "Common parts carried on every visit",
      "Clean-up after the job",
      "Written summary of the work done",
    ],
    process: stdProcess(
      "A coordinator confirms the time window and any access details.",
      "The technician diagnoses, agrees the fix with you, and completes the repair.",
    ),
    pricing: { model: "fixed", amount: 89, label: "From $89" },
    duration: "1–2 hours",
    isActive: true,
    featured: true,
    createdAt: "2026-03-02T10:00:00Z",
  },
  {
    id: "svc-electrical",
    slug: "electrical-inspection",
    name: "Electrical Inspection",
    categoryId: "home-repairs",
    icon: "zap",
    shortDescription: "A room-by-room safety check of outlets, switches and panels.",
    description:
      "A structured inspection of your home's visible electrical components, with a clear report of anything that needs attention and recommended next steps.",
    features: [
      "Outlet, switch and breaker panel checks",
      "Prioritised findings report",
      "Photos of any issues found",
      "Recommendations with no obligation",
    ],
    process: stdProcess(
      "We confirm the property size so the right amount of time is booked.",
      "The inspector works through each room and documents findings.",
    ),
    pricing: { model: "fixed", amount: 129, label: "From $129" },
    duration: "2–3 hours",
    isActive: true,
    createdAt: "2026-03-05T10:00:00Z",
  },
  {
    id: "svc-appliance",
    slug: "appliance-installation",
    name: "Appliance Installation",
    categoryId: "home-repairs",
    icon: "plug",
    shortDescription: "Professional setup for washers, dishwashers and wall ovens.",
    description:
      "Get new appliances connected, levelled and tested. Includes removal of packaging and a quick walkthrough of the main settings.",
    features: [
      "Connection and levelling",
      "Function test after install",
      "Packaging removed",
      "Basic usage walkthrough",
    ],
    process: stdProcess(
      "We check the appliance model and confirm any extra fittings needed.",
      "The installer connects, tests and walks you through the appliance.",
    ),
    pricing: { model: "fixed", amount: 75, label: "From $75" },
    duration: "1–2 hours",
    isActive: true,
    createdAt: "2026-04-11T10:00:00Z",
  },
  {
    id: "svc-deep-clean",
    slug: "deep-home-cleaning",
    name: "Deep Home Cleaning",
    categoryId: "cleaning",
    icon: "sparkles",
    shortDescription: "Top-to-bottom cleaning, including kitchens and bathrooms.",
    description:
      "A detailed clean covering hard-to-reach areas, appliances' exteriors, bathrooms, floors and surfaces. Ideal before or after a move, or as a seasonal reset.",
    features: [
      "Kitchen and bathroom detailing",
      "Inside-window and skirting cleaning",
      "Eco-friendly products on request",
      "Checklist-based quality review",
    ],
    process: stdProcess(
      "We confirm the number of rooms and any focus areas.",
      "A two-person team works through a room-by-room checklist.",
    ),
    pricing: { model: "fixed", amount: 149, label: "From $149" },
    duration: "3–5 hours",
    isActive: true,
    featured: true,
    createdAt: "2026-02-18T10:00:00Z",
  },
  {
    id: "svc-office-clean",
    slug: "office-cleaning",
    name: "Office Cleaning",
    categoryId: "cleaning",
    icon: "building",
    shortDescription: "Reliable cleaning for small offices and studios.",
    description:
      "Scheduled or one-off cleaning for workspaces up to a medium-sized office, including desks, kitchens, meeting rooms and restrooms.",
    features: [
      "Flexible after-hours scheduling",
      "Desk and shared-area sanitising",
      "Waste and recycling handling",
      "Consistent team where possible",
    ],
    process: stdProcess(
      "We agree on scope, access and the best time window.",
      "The team cleans to an agreed checklist and logs completion.",
    ),
    pricing: { model: "hourly", amount: 45, label: "$45 / hour" },
    duration: "Varies by space",
    isActive: true,
    createdAt: "2026-05-07T10:00:00Z",
  },
  {
    id: "svc-laptop",
    slug: "laptop-diagnostics",
    name: "Laptop Diagnostics",
    categoryId: "it-support",
    icon: "laptop",
    shortDescription: "Find out why your laptop is slow, noisy or misbehaving.",
    description:
      "A technician runs hardware and software checks, identifies the root cause and recommends a fix. Simple software issues are often resolved during the session.",
    features: [
      "Hardware health checks",
      "Startup and performance review",
      "Malware scan",
      "Plain-English findings report",
    ],
    process: stdProcess(
      "We confirm the device type and whether you prefer remote or on-site.",
      "The technician runs diagnostics and resolves quick fixes on the spot.",
    ),
    pricing: { model: "fixed", amount: 59, label: "From $59" },
    duration: "1 hour",
    isActive: true,
    featured: true,
    createdAt: "2026-01-22T10:00:00Z",
  },
  {
    id: "svc-network",
    slug: "home-network-setup",
    name: "Home Network Setup",
    categoryId: "it-support",
    icon: "wifi",
    shortDescription: "Fast, secure Wi-Fi coverage across your whole home.",
    description:
      "Set up or improve your router, mesh points and network security so every room gets a stable connection, with a guest network if you need one.",
    features: [
      "Coverage walk-through",
      "Router and mesh configuration",
      "Secure passwords and guest network",
      "Speed test before and after",
    ],
    process: stdProcess(
      "We ask about home size and current equipment.",
      "The technician configures equipment and verifies coverage room by room.",
    ),
    pricing: { model: "fixed", amount: 99, label: "From $99" },
    duration: "1–2 hours",
    isActive: true,
    createdAt: "2026-02-03T10:00:00Z",
  },
  {
    id: "svc-backup",
    slug: "data-backup-setup",
    name: "Data Backup Setup",
    categoryId: "it-support",
    icon: "database",
    shortDescription: "Automatic backups so your files are never a single point of failure.",
    description:
      "Configure automatic local and cloud backups for your computers, with a tested restore so you know it works when you need it.",
    features: [
      "Backup plan tailored to your devices",
      "Automatic schedules",
      "Test restore included",
      "Simple how-to guide left behind",
    ],
    process: stdProcess(
      "We review the devices and how much data needs protecting.",
      "The technician sets up backups and verifies a restore.",
    ),
    pricing: { model: "fixed", amount: 79, label: "From $79" },
    duration: "1–2 hours",
    isActive: true,
    createdAt: "2026-06-14T10:00:00Z",
  },
  {
    id: "svc-bookkeeping",
    slug: "bookkeeping-setup",
    name: "Bookkeeping Setup",
    categoryId: "business",
    icon: "calculator",
    shortDescription: "Get your small-business books organised from day one.",
    description:
      "A specialist sets up your chart of accounts, connects your bank feeds and shows you a simple monthly routine to keep things tidy.",
    features: [
      "Chart of accounts setup",
      "Bank feed connection",
      "Invoice and expense templates",
      "Monthly routine walkthrough",
    ],
    process: stdProcess(
      "A short intro call to understand your business.",
      "The specialist configures your books and runs a walkthrough session.",
    ),
    pricing: { model: "quote", label: "Custom quote" },
    duration: "1–2 sessions",
    isActive: true,
    featured: true,
    createdAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "svc-website-audit",
    slug: "website-audit",
    name: "Website Audit",
    categoryId: "business",
    icon: "globe",
    shortDescription: "A practical review of speed, accessibility and clarity.",
    description:
      "Receive a prioritised list of improvements for your website covering performance, accessibility, mobile usability and messaging.",
    features: [
      "Performance and Core Web Vitals review",
      "Accessibility spot-checks",
      "Mobile usability review",
      "Prioritised action list",
    ],
    process: stdProcess(
      "We confirm the site URL and your main goals.",
      "The reviewer audits the site and delivers a report with a short call.",
    ),
    pricing: { model: "fixed", amount: 249, label: "From $249" },
    duration: "3–5 business days",
    isActive: true,
    createdAt: "2026-05-20T10:00:00Z",
  },
  {
    id: "svc-moving",
    slug: "local-moving-assistance",
    name: "Local Moving Assistance",
    categoryId: "moving",
    icon: "truck",
    shortDescription: "Extra hands and a van for moves within the city.",
    description:
      "A two-person crew with a van helps load, transport and unload your belongings for local moves, with basic furniture assembly available.",
    features: [
      "Two-person crew and van",
      "Blankets and straps included",
      "Basic furniture assembly",
      "Hourly billing, no hidden extras",
    ],
    process: stdProcess(
      "We confirm addresses, access and the approximate volume.",
      "The crew loads, moves and unloads, then confirms with you on site.",
    ),
    pricing: { model: "hourly", amount: 110, label: "$110 / hour" },
    duration: "Varies by move",
    isActive: true,
    createdAt: "2026-03-28T10:00:00Z",
  },
  {
    id: "svc-career",
    slug: "career-coaching-session",
    name: "Career Coaching Session",
    categoryId: "coaching",
    icon: "graduation",
    shortDescription: "A focused one-to-one session on your next career step.",
    description:
      "Work through a CV review, interview preparation or a career change plan with an experienced coach in a structured 60-minute session.",
    features: [
      "Pre-session questionnaire",
      "60-minute video session",
      "Action plan sent afterwards",
      "Optional follow-up session",
    ],
    process: stdProcess(
      "We match you with a coach based on your goals.",
      "You meet over video and receive a written action plan.",
    ),
    pricing: { model: "fixed", amount: 65, label: "From $65" },
    duration: "60 minutes",
    isActive: false,
    createdAt: "2026-07-09T10:00:00Z",
  },
];

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(service: Service, limit = 3) {
  const sameCategory = services.filter(
    (s) => s.isActive && s.id !== service.id && s.categoryId === service.categoryId,
  );
  const others = services.filter(
    (s) => s.isActive && s.id !== service.id && s.categoryId !== service.categoryId,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
