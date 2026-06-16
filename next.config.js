/** @type {import('next').NextConfig} */
const isGHPages = process.env.NEXT_EXPORT === 'true'
const repoName = 'salsawala-studios'

const nextConfig = {
  output: isGHPages ? 'export' : undefined,
  basePath: isGHPages ? `/${repoName}` : '',
  assetPrefix: isGHPages ? `/${repoName}/` : '',
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
    unoptimized: isGHPages,
  },
}

module.exports = nextConfig
