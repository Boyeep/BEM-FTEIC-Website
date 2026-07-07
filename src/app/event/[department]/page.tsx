import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EventPageContent from "@/features/event/components/EventPageContent";
import {
  EVENT_DEPARTMENTS,
  getEventDepartmentBySlug,
} from "@/features/event/department";
import { createCanonicalMetadataFromSegments } from "@/lib/seo";

interface EventDepartmentPageProps {
  params: {
    department: string;
  };
}

export function generateStaticParams() {
  return EVENT_DEPARTMENTS.map((item) => ({ department: item.slug }));
}

export function generateMetadata({
  params,
}: EventDepartmentPageProps): Metadata {
  const department = getEventDepartmentBySlug(params.department);

  if (!department) {
    return {};
  }

  return createCanonicalMetadataFromSegments("event", params.department);
}

export default function EventDepartmentPage({
  params,
}: EventDepartmentPageProps) {
  const department = getEventDepartmentBySlug(params.department);

  if (!department) {
    notFound();
  }

  return <EventPageContent initialDepartment={department.category} />;
}
