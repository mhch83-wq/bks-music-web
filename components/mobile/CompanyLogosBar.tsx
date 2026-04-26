"use client";

import { useEffect, useState } from "react";
import { companyLogos } from "@/lib/companyLogos";

function LogoImage({ src, idx }: { src: string; idx: number }) {
  const isAtresmedia = idx === 6 || src.includes("atresmedia");
  const isUltraMusic = idx === 8 || src.includes("image_2025-10-20");
  const isMediaset = idx === 7 || src.includes("TL5") || src.includes("mediaset");
  const isMovistarPlus = idx === 9 || src.includes("movistar") || src.includes("Movistar");
  const shouldApplyFilter = !isAtresmedia && !isUltraMusic && !isMediaset;

  return (
    <div className="relative flex-shrink-0 h-6 w-10 sm:h-7 sm:w-12 opacity-80">
      <img
        src={src}
        alt={`Company logo ${idx + 1}`}
        className="w-full h-full object-contain"
        style={
          isMediaset
            ? {
                filter: "brightness(0) invert(1)",
                imageRendering: "-webkit-optimize-contrast",
              }
            : isMovistarPlus
              ? { filter: "brightness(0) invert(1)" }
              : shouldApplyFilter
                ? { filter: "brightness(0) invert(1)" }
                : { filter: "invert(1)" }
        }
      />
    </div>
  );
}

export default function CompanyLogosBar() {
  const row1 = companyLogos.slice(0, 5);
  const row2 = companyLogos.slice(5, 10);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 1700);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="w-full bg-black py-4 px-4 -mt-8" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.9s ease-out" }}>
      <div className="flex flex-col gap-1.5 items-center">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          {row1.map((src, i) => (
            <LogoImage key={i} src={src} idx={i} />
          ))}
        </div>
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          {row2.map((src, i) => (
            <LogoImage key={i} src={src} idx={i + 5} />
          ))}
        </div>
      </div>
    </div>
  );
}
