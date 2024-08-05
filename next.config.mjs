import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        serverComponentsExternalPackages: ["@coral-xyz/anchor"],
    },
    images: {
        remotePatterns:[
            {
                hostname:"dd.dexscreener.com"
            },
            {
                hostname:"cdn.dexscreener.com"
            }
        ]
    }
};

export default withNextVideo(nextConfig);