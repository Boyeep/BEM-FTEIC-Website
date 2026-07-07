import siteConfig from "../../site.config.json";

const PRODUCTION_SITE_URL = siteConfig.productionSiteUrl;
const LEGACY_SITE_HOSTNAMES = new Set(siteConfig.legacyHostnames);

export const SITE_NAME = "BEM-FTEIC ITS";
export const SITE_DESCRIPTION =
  "BEM FAKULTAS TEKNOLOGI ELEKTRO DAN INFORMATIKA CERDAS ITS.";

export function resolveSiteUrl(siteUrl?: string | null) {
  if (!siteUrl) {
    return PRODUCTION_SITE_URL;
  }

  try {
    const normalizedUrl = new URL(siteUrl);

    if (LEGACY_SITE_HOSTNAMES.has(normalizedUrl.hostname.toLowerCase())) {
      return PRODUCTION_SITE_URL;
    }

    return normalizedUrl.origin;
  } catch {
    return PRODUCTION_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl(
  process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL,
);

export const CANONICAL_HOSTNAME = new URL(PRODUCTION_SITE_URL).hostname;
export const REDIRECT_HOSTNAMES = new Set(LEGACY_SITE_HOSTNAMES);
