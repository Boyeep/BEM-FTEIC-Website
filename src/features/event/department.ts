import { EventDepartmentCategory } from "@/features/event/types";

export type EventDepartmentItem = {
  slug: string;
  category: EventDepartmentCategory;
  label: string;
  organizerLabel: string;
  logoSrc: string;
};

export const EVENT_DEPARTMENTS: EventDepartmentItem[] = [
  {
    slug: "fteic",
    category: "FTEIC",
    label: "FTEIC",
    organizerLabel: "BEM FTEIC",
    logoSrc: "/images/event-departemen-logo/logo-bem-fteic.png",
  },
  {
    slug: "teknik-elektro",
    category: "TEKNIK ELEKTRO",
    label: "TEKNIK ELEKTRO",
    organizerLabel: "HIMATEKTRO",
    logoSrc: "/images/event-departemen-logo/logo-hima-teknik-elektro.jpeg",
  },
  {
    slug: "teknik-informatika",
    category: "TEKNIK INFORMATIKA",
    label: "TEKNIK INFORMATIKA",
    organizerLabel: "HMTC",
    logoSrc: "/images/event-departemen-logo/logo-hima-teknik-informatika.jpeg",
  },
  {
    slug: "sistem-informasi",
    category: "SISTEM INFORMASI",
    label: "SISTEM INFORMASI",
    organizerLabel: "HMSI",
    logoSrc: "/images/event-departemen-logo/logo-hima-sistem-informasi.jpeg",
  },
  {
    slug: "teknik-komputer",
    category: "TEKNIK KOMPUTER",
    label: "TEKNIK KOMPUTER",
    organizerLabel: "HIMATEKKOM",
    logoSrc: "/images/event-departemen-logo/logo-hima-teknik-komputer.jpeg",
  },
  {
    slug: "teknik-biomedik",
    category: "TEKNIK BIOMEDIK",
    label: "TEKNIK BIOMEDIK",
    organizerLabel: "HMTB",
    logoSrc: "/images/event-departemen-logo/logo-hima-teknik-biomedik.jpeg",
  },
  {
    slug: "teknologi-informasi",
    category: "TEKNOLOGI INFORMASI",
    label: "TEKNOLOGI INFORMASI",
    organizerLabel: "HMIT",
    logoSrc: "/images/event-departemen-logo/logo-hima-teknologi-informasi.jpeg",
  },
];

export const DEFAULT_EVENT_DEPARTMENT = EVENT_DEPARTMENTS[0];

export const EVENT_NAV_ITEMS = EVENT_DEPARTMENTS.map((item) => ({
  label: item.label,
  href: `/event/${item.slug}`,
}));

export function getEventDepartmentBySlug(slug: string) {
  return EVENT_DEPARTMENTS.find((item) => item.slug === slug);
}

export function getEventDepartmentByCategory(
  category?: EventDepartmentCategory,
) {
  if (!category) {
    return DEFAULT_EVENT_DEPARTMENT;
  }

  return (
    EVENT_DEPARTMENTS.find((item) => item.category === category) ||
    DEFAULT_EVENT_DEPARTMENT
  );
}

export function isEventDepartmentCategory(
  value?: string,
): value is EventDepartmentCategory {
  if (!value) return false;
  return EVENT_DEPARTMENTS.some((item) => item.category === value);
}
