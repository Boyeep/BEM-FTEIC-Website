import type { Metadata } from "next";

import HomePageContent from "@/features/homepage/components/HomePageContent";
import { createCanonicalMetadata } from "@/lib/seo";

export const metadata: Metadata = createCanonicalMetadata("/");

export default function Home() {
  return <HomePageContent />;
}
