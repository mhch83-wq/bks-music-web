import type { Metadata } from "next";
import { Montserrat, Outfit } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BKS Music | Songwriting, production, publishing & talent development",
  description: "Professional music production and publishing",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${montserrat.variable} ${outfit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}











