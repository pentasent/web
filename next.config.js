/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: '/app',
        destination: '/',
        permanent: true,
      },
      {
        source: '/help',
        destination: '/contact',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig;
