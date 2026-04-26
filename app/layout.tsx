import type { Metadata } from "next";
import "./globals.css";
import { bebasNeue, interTight, montserrat, outfit } from "./fonts";

export const metadata: Metadata = {
  title: "BKS Music | Songwriting, production, publishing & talent development",
  description: "Professional music production and publishing",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="min-h-full bg-black"
      style={{ backgroundColor: "#000000", colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
        <link rel="preload" href="https://fonts.cdnfonts.com/css/gobold" as="style" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/gobold" />
      </head>
      <body
        className={`${montserrat.variable} ${bebasNeue.variable} ${outfit.variable} ${interTight.variable} min-h-[100dvh] bg-black font-sans antialiased text-white`}
        style={{ backgroundColor: "#000000", color: "#ffffff", margin: 0, padding: 0 }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
