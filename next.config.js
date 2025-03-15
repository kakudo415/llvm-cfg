/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // カスタムドメインを使用するため、basePath と assetPrefix は不要
  basePath: '',
  assetPrefix: '',
}

module.exports = nextConfig
