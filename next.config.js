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

// Desarrollo: solo IPs exactas (wildcards 192.168.*.* no funcionan en Next y bloquean el móvil).
// Sin ALLOWED_DEV_ORIGINS → no definimos allowedDevOrigins (modo aviso, no bloquea).
if (process.env.NODE_ENV !== 'production') {
  const fromList = (process.env.ALLOWED_DEV_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const fromSingle = process.env.ALLOWED_DEV_ORIGIN ? [process.env.ALLOWED_DEV_ORIGIN] : []
  const lanIps = [...new Set([...fromList, ...fromSingle])]
  if (lanIps.length > 0) {
    nextConfig.allowedDevOrigins = ['127.0.0.1', 'localhost', ...lanIps]
  }
}

module.exports = nextConfig
