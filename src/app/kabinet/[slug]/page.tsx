import { notFound } from "next/navigation";

import KabinetDivisionPageContent from "@/features/kabinet/components/KabinetDivisionPageContent";
import {
  getKabinetDivisionBySlug,
  KABINET_DIVISIONS,
} from "@/features/kabinet/data";

interface KabinetDivisionPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return KABINET_DIVISIONS.map((item) => ({ slug: item.slug }));
}

export default function KabinetDivisionPage({
  params,
}: KabinetDivisionPageProps) {
  const division = getKabinetDivisionBySlug(params.slug);

  if (!division) {
    notFound();
  }

  return <KabinetDivisionPageContent division={division} />;
}
