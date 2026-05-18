"use client";

import { useLayoutEffect, useState } from "react";
import DesktopHome from "@/components/desktop/DesktopHome";
import MobileHome from "@/components/mobile/MobileHome";

export default function Home() {
  // Mobile-first: nunca un <main> vacío (pantalla negra) esperando a useEffect.
  const [isDesktop, setIsDesktop] = useState(false);

  useLayoutEffect(() => {
    const updateDevice = () => setIsDesktop(window.innerWidth >= 768);
    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  return isDesktop ? <DesktopHome /> : <MobileHome />;
}
