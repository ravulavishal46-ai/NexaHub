import type { AccountStatus, UserProfile } from "@/types";

/**
 * FICTIONAL DEMO PEOPLE.
 * Names are invented and all emails use the reserved example.com domain,
 * so nothing here belongs to a real person.
 */

export const DEMO_USER_ID = "usr-001";

const people: [string, string, AccountStatus][] = [
  ["Alex Morgan", "Lisbon", "active"],
  ["Priya Raman", "Toronto", "active"],
  ["Daniel Okafor", "Manchester", "active"],
  ["Sofia Lindqvist", "Gothenburg", "active"],
  ["Mateo Alvarez", "Valencia", "active"],
  ["Hana Takeda", "Osaka", "invited"],
  ["Liam Gallagher-Shaw", "Dublin", "active"],
  ["Amara Nwosu", "Accra", "active"],
  ["Noah Becker", "Leipzig", "suspended"],
  ["Isla McKenzie", "Edinburgh", "active"],
  ["Ravi Menon", "Pune", "active"],
  ["Chloé Martin", "Lyon", "active"],
  ["Ethan Brooks", "Denver", "invited"],
  ["Yara Haddad", "Amman", "active"],
  ["Lucas Ferreira", "Porto", "active"],
  ["Mei Lin Chou", "Taipei", "active"],
  ["Oliver Grant", "Auckland", "suspended"],
  ["Zara Ahmed", "Birmingham", "active"],
  ["Felix Novak", "Brno", "active"],
  ["Ana Ribeiro", "Recife", "active"],
  ["Kwame Mensah", "Kumasi", "active"],
  ["Elena Petrova", "Varna", "invited"],
  ["Tomás Duarte", "Braga", "active"],
  ["Grace Whitfield", "Bristol", "active"],
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export const users: UserProfile[] = people.map(([name, city, status], i) => {
  const handle = name.toLowerCase().replace(/[^a-z ]/g, "").split(" ").join(".");
  const joinedDay = ((i * 7) % 27) + 1;
  const joinedMonth = (i % 8) + 1;
  return {
    id: `usr-${String(i + 1).padStart(3, "0")}`,
    name,
    email: `${handle}@example.com`,
    phone: i % 3 === 0 ? `+1 555 01${pad(i)}` : undefined,
    city,
    role: i === 1 ? "admin" : "user",
    status,
    joinedAt: `2026-${pad(joinedMonth)}-${pad(joinedDay)}T09:00:00Z`,
    lastActiveAt: `2026-10-${pad(12 - (i % 11))}T${pad(8 + (i % 9))}:15:00Z`,
  };
});

/** Fictional staff members that admins can assign requests to. */
export const staff = [
  "Jordan Lee",
  "Samira Patel",
  "Chris Navarro",
  "Bea Thompson",
  "Unassigned",
] as const;

export function getUser(id: string) {
  return users.find((u) => u.id === id);
}
