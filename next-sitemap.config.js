/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://bem-fteic-playground.vercel.app", // !CHANGETHIS to your site url (for example: https://example.com)
  generateRobotsTxt: true,
};
