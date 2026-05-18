"use client";

import { useEffect, useState } from "react";
import { companyLogos } from "@/lib/companyLogos";

function LogoImage({ src, idx }: { src: string; idx: number }) {
  const isAtresmedia = idx === 7 || src.includes("atresmedia");
  const isUltraMusic = idx === 9 || src.includes("image_2025-10-20");
  const isMediaset = idx === 8 || src.includes("TL5") || src.includes("mediaset");
  const isMovistarPlus = idx === 10 || src.includes("movistar") || src.includes("Movistar");
  const isOnerpm = idx === 11 || src.includes("onerpm");
  const isVirgin = idx === 5 || src.includes("virgin");
  const shouldApplyFilter = !isAtresmedia && !isUltraMusic && !isMediaset && !isOnerpm && !isVirgin;

  const sizeClass = isOnerpm
    ? "h-[18px] w-11 sm:h-5 sm:w-12"
    : isMovistarPlus
      ? "h-4 w-7 sm:h-[18px] sm:w-8"
      : "h-6 w-10 sm:h-7 sm:w-12";

  return (
    <div className={`relative flex-shrink-0 opacity-80 ${sizeClass}`}>
      <img
        src={src}
        alt={`Company logo ${idx + 1}`}
        className="h-full w-full object-contain"
        style={
          isOnerpm
            ? { filter: "invert(1)", mixBlendMode: "screen", opacity: 0.85 }
            : isVirgin
              ? { filter: "brightness(0) invert(1)", opacity: 0.8, transform: "scale(1.04)" }
              : isMediaset
                ? {
                    filter: "brightness(0) invert(1)",
                    imageRendering: "-webkit-optimize-contrast",
                  }
                : isMovistarPlus
                  ? { filter: "brightness(0) invert(1)" }
                  : shouldApplyFilter
                    ? { filter: "brightness(0) invert(1)" }
                    : { filter: "invert(1)", opacity: 0.75 }
        }
      />
    </div>
  );
}

export default function CompanyLogosBar() {
  const row1 = companyLogos.slice(0, 6);
  const row2 = companyLogos.slice(6);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 1700);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="w-full bg-black px-4 py-4 -mt-8" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.9s ease-out" }}>
      <div className="mx-auto flex w-full flex-col items-center gap-1.5">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {row1.map((src, i) => (
            <LogoImage key={i} src={src} idx={i} />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {row2.map((src, i) => (
            <LogoImage key={i} src={src} idx={i + 6} />
          ))}
        </div>
      </div>
    </div>
  );
}
