/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /@ffmpeg\/ffmpeg/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    });

    return config;
  },
  experimental: {
    esmExternals: false, // Ensure compatibility with CommonJS
  },
};

module.exports = nextConfig;
