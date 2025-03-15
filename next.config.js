/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/llvm-cfg' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/llvm-cfg/' : '',
}

module.exports = nextConfig
