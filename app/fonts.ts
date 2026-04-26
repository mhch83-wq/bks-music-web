import { Bebas_Neue, Montserrat, Outfit, Inter_Tight } from "next/font/google";

/** Una sola instancia: `className` aplica la familia real de Next; `variable` expone --font-montserrat para Tailwind. */
export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

/** Línea “Small team. Major sound.” — condensada; `variable` para forzar familia con var() y evitar herencia de Montserrat */
export const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
});

export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["700", "800", "900"],
});

export const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["400", "700", "800", "900"],
});
