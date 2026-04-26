"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es" className="min-h-full bg-black" style={{ backgroundColor: "#000", colorScheme: "dark" }}>
      <body className="min-h-[100dvh] bg-black p-6 text-white antialiased" style={{ backgroundColor: "#000", color: "#fff" }}>
        <h1 className="text-lg font-semibold">Error al cargar la página</h1>
        <p className="mt-2 text-sm text-white/80">{error?.message ?? "Error desconocido"}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded bg-white px-4 py-2 text-sm font-medium text-black"
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
