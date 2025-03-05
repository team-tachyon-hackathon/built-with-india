/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable type checking during build for faster builds
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    // Similarly disable ESLint during build
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    // Add any other Next.js config options here
  }
  
  module.exports = nextConfig