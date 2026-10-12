/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // miniatury 360° fotek z Vercel Blob
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
