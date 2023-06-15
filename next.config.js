/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      //接口请求 前缀带上/api-text/
      {
        source: `/api/:path*`,
        destination: `https://utestapi.ulearning.cn/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
