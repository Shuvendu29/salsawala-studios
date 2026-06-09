/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
    // Use unoptimized for Firebase Hosting static export
    // Set to false when using Vercel (handles optimization automatically)
    unoptimized: process.env.NEXT_EXPORT === 'true',
  },
  // Uncomment below for Firebase Hosting static export:
  // output: 'export',
}

module.exports = nextConfig
