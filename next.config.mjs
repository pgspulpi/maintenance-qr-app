/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add basePath if deploying to GitHub Pages subdirectory
  // Uncomment and set your repository name if deploying to a subdirectory
  // basePath: process.env.GITHUB_ACTIONS ? '/maintenance-qr-app' : '',
}

export default nextConfig
