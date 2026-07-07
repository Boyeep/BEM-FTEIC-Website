import type { Metadata } from "next";

import BlogPage from "@/features/blog/components/BlogPage";
import { createCanonicalMetadata } from "@/lib/seo";

export const metadata: Metadata = createCanonicalMetadata("/blog");

export default function BlogIndexPage() {
  return <BlogPage />;
}
