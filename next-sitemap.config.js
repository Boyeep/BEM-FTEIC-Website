/** @type {import('next-sitemap').IConfig} */
const {
  legacyHostnames,
  productionSiteUrl,
  robotsDisallowPaths,
  sitemapExcludePaths,
} = require("./site.config.json");

const legacySiteHostnames = new Set(legacyHostnames);

const resolveSiteUrl = (rawSiteUrl) => {
  if (!rawSiteUrl) {
    return productionSiteUrl;
  }

  try {
    const normalizedUrl = new URL(rawSiteUrl);

    if (legacySiteHostnames.has(normalizedUrl.hostname.toLowerCase())) {
      return productionSiteUrl;
    }

    return normalizedUrl.origin;
  } catch {
    return productionSiteUrl;
  }
};

const siteUrl = resolveSiteUrl(
  process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL,
);

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: sitemapExcludePaths,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: robotsDisallowPaths,
      },
    ],
  },
};
