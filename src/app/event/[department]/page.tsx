import { notFound } from "next/navigation";

import EventPageContent from "@/features/event/components/EventPageContent";
import {
  EVENT_DEPARTMENTS,
  getEventDepartmentBySlug,
} from "@/features/event/department";

interface EventDepartmentPageProps {
  params: {
    department: string;
  };
}

export function generateStaticParams() {
  return EVENT_DEPARTMENTS.map((item) => ({ department: item.slug }));
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
