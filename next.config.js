/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    // Desactivar optimización para export estático
    unoptimized: true,
  },
}

module.exports = nextConfig








