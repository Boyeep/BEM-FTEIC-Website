const isStandaloneBuild = process.env.BUILD_STANDALONE === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isStandaloneBuild ? { output: "standalone" } : {}),
};

module.exports = nextConfig;
