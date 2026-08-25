import type { NextConfig } from "next";

/* GitHub Pages serves a static tree with no Node process behind it, so the
   production build has to be a static export. Every route here is static and
   every image is a local file we already sized ourselves, so nothing is lost.

   BASE_PATH is set by the deploy workflow: a project site lives under
   /SunlightSuppliesWeb/, a custom domain would live at the root. */
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    /* See image-loader.ts — `unoptimized` would drop the basePath. */
    loader: "custom",
    loaderFile: "./image-loader.ts",
  },
};

export default nextConfig;
