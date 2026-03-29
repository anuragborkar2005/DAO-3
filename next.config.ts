import type { NextConfig } from "next";

const nextConfig = {
  //@ts-expect-error Due to config any type
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
