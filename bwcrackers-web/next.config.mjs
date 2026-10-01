/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Product photos are uploaded through server actions (resized on the server).
  experimental: { serverActions: { bodySizeLimit: '10mb' } },
  serverExternalPackages: ['sharp'],
};

export default nextConfig;
