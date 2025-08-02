import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        domains: ['assets.aceternity.com', "img.freepik.com"], // Add your hostname here
        // Or, for Next.js 13 and newer, use 'remotePatterns' for more flexibility
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.aceternity.com',
                port: '',
                pathname: '/pro/**', // Optional: if images are within a specific path
            },
            {
                protocol: "https",
                hostname: "img.freepik.com",
                port: "",
                pathname: "/free-vector/abstract-background-with-colorful-shapes_23-2148983554.jpg"
            }
        ],
    },
    webpack(config, { dev, isServer }) {
        // Only run why-did-you-render in development mode and on the client side
        if (dev && !isServer) {
            const originalEntry = config.entry;

            config.entry = async () => {
                const wdrPath = path.resolve(__dirname, './scripts/whyDidYouRender.js');
                const entries = await originalEntry();

                // Ensure wdyr.js is the first entry in the main bundle
                if (entries['main.js'] && !entries['main.js'].includes(wdrPath)) {
                    entries['main.js'].unshift(wdrPath);
                }

                return entries;
            };
        }
        return config;
    },
};

export default nextConfig;
