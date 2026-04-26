/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Solo usar export en producción (build)
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  images: {
    // Desactivar optimización para export estático
    unoptimized: true,
  },
}

module.exports = nextConfig








