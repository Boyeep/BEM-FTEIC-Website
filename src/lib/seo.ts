import type { Metadata } from "next";

function encodeCanonicalSegment(segment: string) {
  return encodeURIComponent(segment.trim());
}

export function buildCanonicalPath(...segments: string[]) {
  const normalizedSegments = segments
    .flatMap((segment) => segment.split("/"))
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map(encodeCanonicalSegment);

  return normalizedSegments.length > 0
    ? `/${normalizedSegments.join("/")}`
    : "/";
}

export function createCanonicalMetadata(
  pathname: string,
): Pick<Metadata, "alternates"> {
  const normalizedPath =
    pathname === "/"
      ? "/"
      : `/${pathname}`.replace(/\/{2,}/g, "/").replace(/\/$/, "");

  return {
    alternates: {
      canonical: normalizedPath,
    },
  };
}

export function createCanonicalMetadataFromSegments(...segments: string[]) {
  return createCanonicalMetadata(buildCanonicalPath(...segments));
}
