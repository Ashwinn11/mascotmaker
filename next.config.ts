import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@neplex/vectorizer", "onnxruntime-node", "@imgly/background-removal-node", "sharp"],
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  outputFileTracingIncludes: {
    "**": [
      "./node_modules/onnxruntime-node/bin/napi-v3/linux/x64/*",
      "./node_modules/onnxruntime-node/bin/napi-v3/linux/arm64/*"
    ],
  },
  outputFileTracingExcludes: {
    "**": [
      "./node_modules/onnxruntime-node/bin/napi-v3/win32/**/*",
      "./node_modules/onnxruntime-node/bin/napi-v3/darwin/**/*"
    ],
  },
};

export default nextConfig;
