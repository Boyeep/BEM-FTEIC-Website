import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EventPageContent from "@/features/event/components/EventPageContent";
import {
  EVENT_DEPARTMENTS,
  getEventDepartmentBySlug,
} from "@/features/event/department";
import { createCanonicalMetadataFromSegments } from "@/lib/seo";

interface EventDepartmentPageProps {
  params: Promise<{
    department: string;
  }>;
}

export function generateStaticParams() {
  return EVENT_DEPARTMENTS.map((item) => ({ department: item.slug }));
}

export async function generateMetadata({
  params,
}: EventDepartmentPageProps): Promise<Metadata> {
  const resolved = await params;
  const department = getEventDepartmentBySlug(resolved.department);

  if (!department) {
    return {};
  }

  return createCanonicalMetadataFromSegments("event", resolved.department);
}

export default async function EventDepartmentPage({
  params,
}: EventDepartmentPageProps) {
  const department = getEventDepartmentBySlug((await params).department);

  if (!department) {
    notFound();
  }

  return <EventPageContent initialDepartment={department.category} />;
}
