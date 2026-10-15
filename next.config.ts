import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["10.78.75.97","https://api.pentasent.com"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/peoples',
        destination: '/people',
        permanent: false,
      },
      {
        source: '/company/employees',
        destination: '/company',
        permanent: false,
      },
      {
        source: '/company/careers/open-role',
        destination: '/company/careers/open-roles',
        permanent: true,
      },
      {
        source: '/company/careers/open-role/:slug*',
        destination: '/company/careers/open-roles/:slug*',
        permanent: true,
      },
      {
        source: '/tracker',
        destination: '/tracker/job-status',
        permanent: true,
      },
      {
        source: '/tracker/support-tracker',
        destination: '/tracker/support-status',
        permanent: true,
      },
      {
        source: '/tracker/support-tracker/:slug*',
        destination: '/tracker/support-status/:slug*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
