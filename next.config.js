/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep visited portal pages in the browser's router cache for 30s, so switching back to a
  // tab you just opened is instant. Saving anything (server actions) clears it, and chat,
  // notifications and tasks update live over realtime anyway.
  experimental: { staleTimes: { dynamic: 30, static: 180 } },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.thum.io', pathname: '/**' },
      { protocol: 'https', hostname: 'api.microlink.io', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
}

module.exports = nextConfig
