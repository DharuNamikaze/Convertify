import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle ffmpeg packages — loaded via CDN at runtime
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        { "@ffmpeg/ffmpeg": "FFmpegWASM" },
      ];
    }
    return config;
  },
};

export default nextConfig;
