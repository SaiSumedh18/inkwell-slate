import type { NextConfig } from "next";

// GitHub Pages serves the site as static files under /<repo-name>.
const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isPages && {
    output: "export",
    basePath: "/my-website",
    images: { unoptimized: true },
  }),
  cacheComponents: !isPages, // not supported by static export
  partialPrefetching: !isPages,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
