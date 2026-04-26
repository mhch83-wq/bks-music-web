"use client";

import { useEffect, useState } from "react";
import DesktopHome from "@/components/desktop/DesktopHome";
import MobileHome from "@/components/mobile/MobileHome";

export default function Home() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const updateDevice = () => setIsDesktop(window.innerWidth >= 768);
    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  if (isDesktop === null) {
    return <main className="min-h-[100dvh] bg-black" />;
  }

  return isDesktop ? <DesktopHome /> : <MobileHome />;
}
