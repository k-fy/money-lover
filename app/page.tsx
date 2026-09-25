/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false, // Gunakan false untuk temporary redirect
      },
    ];
  },
};

export default nextConfig;
