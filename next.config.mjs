/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'visa.nadra.gov.pk',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

