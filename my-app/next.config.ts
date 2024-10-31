import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    NEXT_PUBLIC_OPENAI_ORG_ID: process.env.NEXT_PUBLIC_OPENAI_ORG_ID,
  },
};

export default nextConfig;
