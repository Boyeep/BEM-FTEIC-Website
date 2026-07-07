import type { Metadata } from "next";

import KabinetStrukturPageContent from "@/features/kabinet/components/KabinetStrukturPageContent";
import { createCanonicalMetadata } from "@/lib/seo";

export const metadata: Metadata = createCanonicalMetadata("/kabinet/struktur");

export default function KabinetStrukturPage() {
  return <KabinetStrukturPageContent />;
}
