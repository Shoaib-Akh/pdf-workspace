/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/contacts-us', destination: '/', permanent: true },
      { source: '/faq', destination: '/blog', permanent: true },
    ];
  },
};
module.exports = nextConfig;
