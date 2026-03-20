import Image from "next/image";

import { EventDepartmentItem } from "@/features/event/department";

interface EventHeaderProps {
  department: EventDepartmentItem;
}

export default function EventHeader({ department }: EventHeaderProps) {
  return (
    <header>
      <h1 className="text-5xl font-extrabold text-black">{department.label}</h1>
      <div className="mt-6 flex items-center gap-4">
        <Image
          src={department.logoSrc}
          alt={`Logo ${department.organizerLabel}`}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
        <p className="text-3xl text-black">{department.organizerLabel}</p>
      </div>
    </header>
  );
}
