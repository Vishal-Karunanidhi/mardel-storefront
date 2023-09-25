/** @type {import('next').NextConfig} */
const customWebpackConfig = require('./webpack.custom.config');
const { ALLOWED_DOMAINS } = process.env;

const nextConfig = {
  reactStrictMode: true,
  env: {},
  assetPrefix: process.env.ASSET_PREFIX,
  images: {
    domains: ALLOWED_DOMAINS ? JSON.parse(ALLOWED_DOMAINS) : []
  },
  webpack: (config, properties) => {
    const { buildId, dev, isServer, defaultLoaders, webpack } = properties;
    return customWebpackConfig(config, properties);
  },
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
