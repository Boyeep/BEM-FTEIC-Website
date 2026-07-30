import type { Metadata } from "next";
import { notFound } from "next/navigation";

import KabinetDivisionPageContent from "@/features/kabinet/components/KabinetDivisionPageContent";
import {
  KABINET_DIVISIONS,
  getKabinetDivisionBySlug,
} from "@/features/kabinet/data";
import { createCanonicalMetadataFromSegments } from "@/lib/seo";

interface KabinetDivisionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return KABINET_DIVISIONS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: KabinetDivisionPageProps): Promise<Metadata> {
  const resolved = await params;
  const division = getKabinetDivisionBySlug(resolved.slug);

  if (!division) {
    return {};
  }

  return createCanonicalMetadataFromSegments("kabinet", resolved.slug);
}

export default async function KabinetDivisionPage({
  params,
}: KabinetDivisionPageProps) {
  const division = getKabinetDivisionBySlug((await params).slug);

  if (!division) {
    notFound();
  }

  return <KabinetDivisionPageContent division={division} />;
}
