/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Browser router cache. dynamic: pages you visited stay instant for 30s. static: the main
  // menu pages (Home, Messages, Tasks, Meetings) are fully prefetched in the background and
  // reused for up to 60s, so a tap opens them immediately. Saving anything (server actions)
  // clears the cache, and chat, notifications and tasks also update live over realtime.
  experimental: { staleTimes: { dynamic: 30, static: 60 } },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.thum.io', pathname: '/**' },
      { protocol: 'https', hostname: 'api.microlink.io', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
}

module.exports = nextConfig
