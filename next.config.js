/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      //接口请求 前缀带上/utestapi/
      {
        source: `/utestapi/:path*`,
        destination: `https://utestapi.ulearning.cn/:path*`,
      },
      {
        source: `/courseapi/:path*`,
        destination: `https://courseapi.ulearning.cn/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
