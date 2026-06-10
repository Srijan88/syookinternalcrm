import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Anchor the workspace root so Turbopack doesn't scan for lockfiles
    // above the project directory (avoids the multi-lockfile warning).
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
