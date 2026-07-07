import type { Metadata } from "next";

import GaleriPageContent from "@/features/galeri/components/GaleriPageContent";
import { createCanonicalMetadata } from "@/lib/seo";

export const metadata: Metadata = createCanonicalMetadata("/galeri");

export default function GaleriPage() {
  return <GaleriPageContent />;
}
