import {
  documentsSubNav,
  mainNav,
  settingsSubNav,
} from "@/lib/config/navigation";
import {
  mockInvoices,
  mockServices,
  mockStaff,
} from "@/lib/mock/data";
import {
  mockCommunications,
} from "@/lib/mock/extended";
import { useDomainStore } from "@/lib/store/domainStore";

export type SearchCategory =
  | "Pages"
  | "Clients"
  | "Employees"
  | "Cases"
  | "Services"
  | "Documents"
  | "Filings"
  | "Invoices"
  | "Communications";

export type SearchHit = {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle?: string;
  href: string;
  keywords: string;
  /** Employee avatar initials when category is Employees. */
  initials?: string;
};

const CATEGORY_ORDER: SearchCategory[] = [
  "Pages",
  "Clients",
  "Employees",
  "Cases",
  "Services",
  "Documents",
  "Filings",
  "Invoices",
  "Communications",
];

const PER_CATEGORY = 8;
const MAX_TOTAL = 40;

function blob(...parts: Array<string | undefined | null>): string {
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function flattenNavPages(): SearchHit[] {
  const seen = new Set<string>();
  const hits: SearchHit[] = [];

  function add(href: string, label: string) {
    if (seen.has(href)) return;
    seen.add(href);
    hits.push({
      id: `page:${href}`,
      category: "Pages",
      title: label,
      href,
      keywords: blob(label, href.replace(/\//g, " ")),
    });
  }

  for (const item of mainNav) {
    if ("children" in item && item.children) {
      for (const child of item.children) {
        add(child.href, child.label);
      }
    } else {
      add(item.href, item.label);
    }
  }

  for (const item of documentsSubNav) {
    add(item.href, item.label === "Repository" ? "Documents" : item.label);
  }

  for (const item of settingsSubNav) {
    add(item.href, item.label);
  }

  return hits;
}

function buildIndex(): SearchHit[] {
  const { clients: storeClients, cases: storeCases, filings: storeFilings, documents: storeDocuments } =
    useDomainStore.getState();
  const pages = flattenNavPages();

  const clients: SearchHit[] = storeClients.map((c) => ({
    id: `client:${c.id}`,
    category: "Clients" as const,
    title: c.name,
    subtitle: [c.clientId, c.type, c.email].filter(Boolean).join(" · "),
    href: `/clients/${c.id}`,
    keywords: blob(c.name, c.clientId, c.email, c.phone, c.type),
  }));

  const employees: SearchHit[] = mockStaff.map((s) => ({
    id: `employee:${s.id}`,
    category: "Employees" as const,
    title: s.name,
    subtitle: [s.employeeId, s.role, s.department].filter(Boolean).join(" · "),
    href: `/employees/${s.id}`,
    keywords: blob(s.name, s.employeeId, s.email, s.role, s.department),
    initials: s.initials,
  }));

  const cases: SearchHit[] = storeCases.map((c) => ({
    id: `case:${c.id}`,
    category: "Cases" as const,
    title: c.matter,
    subtitle: [c.caseId, c.clientName, c.courtName].filter(Boolean).join(" · "),
    href: `/cases/${c.id}`,
    keywords: blob(
      c.matter,
      c.caseId,
      c.caseNumber,
      c.clientName,
      c.courtName
    ),
  }));

  const services: SearchHit[] = mockServices.map((s) => ({
    id: `service:${s.id}`,
    category: "Services" as const,
    title: s.matter,
    subtitle: [s.serviceId, s.clientName].filter(Boolean).join(" · "),
    href: `/cases/services/${s.id}`,
    keywords: blob(s.matter, s.serviceId, s.clientName),
  }));

  const documents: SearchHit[] = storeDocuments.map((d) => ({
    id: `doc:${d.id}`,
    category: "Documents" as const,
    title: d.name,
    subtitle: [d.category, d.caseName ?? d.clientName]
      .filter(Boolean)
      .join(" · "),
    href: `/documents/${d.id}`,
    keywords: blob(d.name, d.category, d.caseName, d.clientName),
  }));

  const filings: SearchHit[] = storeFilings.map((f) => ({
    id: `filing:${f.id}`,
    category: "Filings" as const,
    title: f.filingRef,
    subtitle: [f.caseName, f.court, f.filedBy].filter(Boolean).join(" · "),
    href: `/cases/${f.caseId}?tab=filings&filing=${f.id}`,
    keywords: blob(f.filingRef, f.caseName, f.court, f.filedBy),
  }));

  const invoices: SearchHit[] = mockInvoices.map((inv) => ({
    id: `invoice:${inv.id}`,
    category: "Invoices" as const,
    title: inv.invoiceNumber,
    subtitle: [inv.clientName, inv.caseName].filter(Boolean).join(" · "),
    href: `/billing/invoices/${inv.id}`,
    keywords: blob(inv.invoiceNumber, inv.clientName, inv.caseName),
  }));

  const communications: SearchHit[] = mockCommunications.map((c) => ({
    id: `comm:${c.id}`,
    category: "Communications" as const,
    title: c.subject,
    subtitle: [c.channel, c.caseName ?? c.clientName]
      .filter(Boolean)
      .join(" · "),
    href: "/communications",
    keywords: blob(c.subject, c.caseName, c.clientName, c.channel),
  }));

  return [
    ...pages,
    ...clients,
    ...employees,
    ...cases,
    ...services,
    ...documents,
    ...filings,
    ...invoices,
    ...communications,
  ];
}

const SEARCH_INDEX = buildIndex();

export function runGlobalSearch(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const perCategory = new Map<SearchCategory, number>();
  const results: SearchHit[] = [];

  for (const category of CATEGORY_ORDER) {
    for (const hit of SEARCH_INDEX) {
      if (hit.category !== category) continue;
      if (!hit.keywords.includes(q)) continue;

      const count = perCategory.get(category) ?? 0;
      if (count >= PER_CATEGORY) continue;

      results.push(hit);
      perCategory.set(category, count + 1);

      if (results.length >= MAX_TOTAL) return results;
    }
  }

  return results;
}

export function groupSearchHits(
  hits: SearchHit[]
): Array<{ category: SearchCategory; hits: SearchHit[] }> {
  const groups: Array<{ category: SearchCategory; hits: SearchHit[] }> = [];
  for (const category of CATEGORY_ORDER) {
    const categoryHits = hits.filter((h) => h.category === category);
    if (categoryHits.length > 0) {
      groups.push({ category, hits: categoryHits });
    }
  }
  return groups;
}
