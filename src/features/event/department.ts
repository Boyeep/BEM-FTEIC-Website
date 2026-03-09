import { EventDepartmentCategory } from "@/features/event/types";

export const EVENT_DEPARTMENTS: {
  slug: string;
  category: EventDepartmentCategory;
  label: string;
}[] = [
  { slug: "fteic", category: "FTEIC", label: "FTEIC" },
  {
    slug: "teknik-elektro",
    category: "TEKNIK ELEKTRO",
    label: "TEKNIK ELEKTRO",
  },
  {
    slug: "teknik-informatika",
    category: "TEKNIK INFORMATIKA",
    label: "TEKNIK INFORMATIKA",
  },
  {
    slug: "sistem-informasi",
    category: "SISTEM INFORMASI",
    label: "SISTEM INFORMASI",
  },
  {
    slug: "teknik-komputer",
    category: "TEKNIK KOMPUTER",
    label: "TEKNIK KOMPUTER",
  },
  {
    slug: "teknik-biomedik",
    category: "TEKNIK BIOMEDIK",
    label: "TEKNIK BIOMEDIK",
  },
  {
    slug: "teknologi-informasi",
    category: "TEKNOLOGI INFORMASI",
    label: "TEKNOLOGI INFORMASI",
  },
];

export const EVENT_NAV_ITEMS = [
  { label: "EVENT", href: "/event" },
  ...EVENT_DEPARTMENTS.map((item) => ({
    label: item.label,
    href: `/event/${item.slug}`,
  })),
];

export function getEventDepartmentBySlug(slug: string) {
  return EVENT_DEPARTMENTS.find((item) => item.slug === slug);
}

export function isEventDepartmentCategory(
  value?: string,
): value is EventDepartmentCategory {
  if (!value) return false;
  return EVENT_DEPARTMENTS.some((item) => item.category === value);
}
