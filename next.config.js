/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  images: {
    domains: [],
  },
  // Disable source maps in production to hide source code
  productionBrowserSourceMaps: false,
  
  // Simplified webpack config - avoid custom plugins causing build issues
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Disable source maps completely in production
      config.devtool = false
      
      // Use default Next.js minification - safer than custom plugin
      config.optimization = {
        ...config.optimization,
        minimize: true,
        sideEffects: false,
      }
    }
    return config
  },
  
  // Custom headers to hide framework info
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Server',
            value: 'Next.js'
          },
          {
            key: 'X-Powered-By',
            value: 'Next.js'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig