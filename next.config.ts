import type { NextConfig } from "next";

// GitHub Pages serves the site as static files under /<repo-name>.
const isPages = process.env.GITHUB_PAGES === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "inkwell-slate";

const nextConfig: NextConfig = {
  ...(isPages && {
    output: "export",
    basePath: `/${repoName}`,
    images: { unoptimized: true },
    trailingSlash: true, // emit checkout/index.html so Pages serves /checkout/ cleanly
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
