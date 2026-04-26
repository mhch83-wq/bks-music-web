"use client";

import { useEffect } from "react";
import HeroMinimalLayout from "./HeroMinimalLayout";

interface HeroProps {
  onActiveBgChange?: (bgId: string) => void;
  currentHeroId?: string;
  pageVersion?: string;
  hideBackground?: boolean;
}

export default function Hero({ onActiveBgChange, pageVersion }: HeroProps) {
  useEffect(() => {
    onActiveBgChange?.("hero1");
  }, [onActiveBgChange]);

  return (
    <section
      id="home"
      className="relative z-0 h-[100dvh] w-full overflow-hidden bg-black [height:-webkit-fill-available]"
    >
      <HeroMinimalLayout
        footerTextVisible={true}
        logoVisible={true}
        textOpacity={1}
        pageVersion={pageVersion ?? "v3"}
      />
    </section>
  );
}
