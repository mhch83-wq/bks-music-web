"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { montserrat } from "@/app/fonts";
import { companyLogos } from "@/lib/companyLogos";

interface HeroMinimalLayoutProps {
  footerTextVisible?: boolean;
  logoVisible?: boolean;
  textOpacity?: number;
  showTrustedBySection?: boolean;
  pageVersion?: string;
}

export default function HeroMinimalLayout({
  footerTextVisible = true,
  logoVisible = true,
  textOpacity = 1,
  showTrustedBySection = false,
  pageVersion = "v3",
}: HeroMinimalLayoutProps) {
  const [introVisible, setIntroVisible] = useState(false);
  const showSmallTeamTagline = false;

  useEffect(() => {
    let cancelled = false;
    let fallbackTimer: number | null = null;

    const revealIntro = () => {
      if (!cancelled) {
        setIntroVisible(true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("mobile-hero-logo-ready"));
        }
      }
    };

    const waitForLogoFonts = async () => {
      if (typeof document === "undefined" || !("fonts" in document)) {
        fallbackTimer = window.setTimeout(revealIntro, 40);
        return;
      }

      fallbackTimer = window.setTimeout(revealIntro, 900);

      try {
        await Promise.allSettled([
          document.fonts.load("400 1em Gefika"),
          document.fonts.load("700 1em 'Europa Grotesk SH'"),
          document.fonts.load("800 1em 'Europa Grotesk No 2 SH'"),
        ]);
      } finally {
        if (fallbackTimer !== null) {
          window.clearTimeout(fallbackTimer);
          fallbackTimer = null;
        }
        revealIntro();
      }
    };

    waitForLogoFonts();

    return () => {
      cancelled = true;
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <div className="relative z-10 flex h-[100dvh] w-full flex-col overflow-hidden bg-black px-5 pb-8 pt-[5.5rem] [height:-webkit-fill-available] md:px-10 md:pb-10 md:pt-[6.5rem] lg:px-16">
      {/* Video de fondo difuminado */}
      <video
        src="/videos/Carlos Baute Ana Mena - No es para tanto.mov"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={(e) => { e.currentTarget.defaultPlaybackRate = 0.5; e.currentTarget.playbackRate = 0.5; }}
        onLoadedMetadata={(e) => { e.currentTarget.defaultPlaybackRate = 0.5; e.currentTarget.playbackRate = 0.5; }}
        onPlay={(e) => { if (e.currentTarget.playbackRate !== 0.5) e.currentTarget.playbackRate = 0.5; }}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          zIndex: 0,
          transform: 'scale(3.4)',
          transformOrigin: 'center center',
          filter: 'blur(0.2px) brightness(0.42) saturate(0.7) contrast(0.92)',
          opacity: 0.32,
        }}
      />
      {/* Vignette: oscurece bordes para que el texto sea legible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 75%, rgba(0,0,0,0.88) 100%)',
        }}
      />
      {/* Textura LCD RGB + scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              rgba(255, 0, 0, 0.11) 0px,
              rgba(255, 0, 0, 0.11) 1px,
              rgba(0, 255, 0, 0.09) 1px,
              rgba(0, 255, 0, 0.09) 2px,
              rgba(0, 80, 255, 0.11) 2px,
              rgba(0, 80, 255, 0.11) 3px,
              transparent 3px,
              transparent 7px
            ),
            repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.03) 0px,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px,
              transparent 5px
            )
          `,
          opacity: 0.28,
          mixBlendMode: "screen",
        }}
      />
      <div className="relative mx-auto flex w-full max-w-[1920px] flex-1 flex-col" style={{ zIndex: 1 }}>
        {/* Bloque principal: sin opacity condicional (Safari iOS puede dejar 0 tras refresh) */}
        <div className="w-full max-w-[54rem]">
          <div
            style={{
              opacity: introVisible ? 1 : 0,
              transform: introVisible ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
              width: "clamp(18rem, 78vw, 56rem)",
              marginLeft: "-0.04em",
            }}
          >
            <Image
              src="/hero-h-logo.png"
              alt="BKS Music"
              width={1400}
              height={280}
              priority
              className="h-auto w-full select-none"
            />
          </div>

          {/* Dos líneas separadas, como en la maqueta */}
          <div
            className={`mt-3 cursor-default md:mt-4 ${montserrat.className}`}
            style={{
              WebkitFontSmoothing: "antialiased",
              fontSize: "clamp(0.7rem, 1.65vw, 0.95rem)",
              fontWeight: 700,
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              lineHeight: 1.35,
              textAlign: "left",
              opacity: footerTextVisible ? (introVisible ? textOpacity : 0) : 0,
              transform: footerTextVisible
                ? introVisible
                  ? "translateY(0)"
                  : "translateY(14px)"
                : "translateY(14px)",
              transition: "opacity 0.9s ease-out 0.12s, transform 0.9s ease-out 0.12s",
            }}
          >
            <p className="m-0">Songwriting Production Publishing</p>
            <p className="m-0 mt-1.5">Talent Development</p>
          </div>

          {showSmallTeamTagline && (
            <p
              className="m-0 mt-4 max-w-[min(100%,40rem)] md:mt-6"
              style={{
                opacity: footerTextVisible ? (introVisible ? textOpacity : 0) : 0,
                transform: footerTextVisible
                  ? introVisible
                    ? "translateY(0)"
                    : "translateY(12px)"
                  : "translateY(12px)",
                transition: "opacity 1s ease-out 0.2s, transform 1s ease-out 0.2s",
              }}
            >
              <span
                className="text-white"
                style={{
                  fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.01em",
                  fontSize: "clamp(1.95rem, 6.5vw, 3.6rem)",
                  lineHeight: 0.95,
                  display: "inline-block",
                  WebkitFontSmoothing: "antialiased",
                  textShadow:
                    "0.35px 0 0 #ffffff, -0.35px 0 0 #ffffff",
                }}
              >
                Small team. Major sound.
              </span>
            </p>
          )}
        </div>

        {/* Trusted by + logos: opcional (en móvil final van debajo del VideoWall) */}
        {showTrustedBySection && (
        <div
          className="relative mt-6 flex w-full flex-col items-center pb-2 md:mt-8"
          style={{ transform: "translateY(-5pt)" }}
        >
          <div className="mb-2 flex w-full max-w-[11rem] items-center justify-center gap-1.5 md:max-w-[12rem]">
            <div className="h-px w-4 shrink-0 bg-white/20 md:w-5" />
            <span
              className="shrink-0 text-[5px] uppercase tracking-[0.18em] text-white/40 md:text-[6px]"
              style={{ fontWeight: 500 }}
            >
              Trusted by
            </span>
            <div className="h-px w-4 shrink-0 bg-white/20 md:w-5" />
          </div>
          <div
            className="grid w-full max-w-[18rem] grid-cols-5 gap-x-1 gap-y-1.5 md:max-w-[19rem] md:gap-x-1.5 md:gap-y-2"
            style={{ maxWidth: "min(100%, 19rem)" }}
          >
            {companyLogos.map((src, idx) => {
              const isAtresmedia = idx === 6 || src.includes("atresmedia");
              const isUltraMusic = idx === 8 || src.includes("image_2025-10-20");
              const isMediaset = idx === 7 || src.includes("TL5") || src.includes("mediaset");
              const isMovistarPlus = idx === 9 || src.includes("movistar") || src.includes("Movistar");
              const shouldApplyFilter = !isAtresmedia && !isUltraMusic && !isMediaset;

              const isWarner = idx === 0 || src.includes("warner");
              const isWarnerMusicGroup = idx === 4 || src.includes("WMG");
              const isPeerMusic = idx === 5 || src.includes("peer");
              const isSonyMusic =
                idx === 1 || (src.includes("pngfind.com-sony-logo-png") && !src.includes("publishing"));

              let transformValue = "none";
              if (isPeerMusic) transformValue = "translateX(calc(-1px + 3pt)) translateY(-4px)";
              else if (isMediaset) transformValue = "translateX(calc(12px - 9pt)) translateY(-1px) scale(0.88)";
              else if (isMovistarPlus) transformValue = "translateX(calc(8px - 6pt)) translateY(calc(1px - 2pt)) scale(0.72)";
              else if (isSonyMusic) transformValue = "translateX(-8px) scale(1.18)";
              else if (isWarner && isWarnerMusicGroup) transformValue = "translateX(2px) translateY(-1px)";
              else if (isWarner) transformValue = "translateX(calc(2px + 3pt))";
              else if (isUltraMusic) transformValue = "translateX(8px) translateY(-1px) scale(0.88)";
              else if (isAtresmedia) transformValue = "translateY(calc(-6px + 2pt)) scale(1.42)";

              const delayTime = [0.05, 0.2, 0.12, 0.28, 0.08, 0.18, 0.22, 0.14, 0.26, 0.16][idx] ?? 0;
              const durationTime = [0.7, 0.9, 0.65, 1, 0.75, 0.85, 0.95, 0.7, 1, 0.8][idx] ?? 0.8;

              return (
                <div
                  key={idx}
                  className="relative h-4 w-full md:h-5"
                  style={{
                    transform: transformValue,
                    opacity: 0,
                    animation: logoVisible
                      ? `heroMinimalLogoIn ${durationTime}s ease-out ${delayTime + 0.15}s forwards`
                      : "none",
                  }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 12vw, 48px"
                    className="object-contain object-center"
                    style={
                      isMediaset || isMovistarPlus || isPeerMusic
                        ? { filter: "brightness(0) invert(1)", opacity: 0.55 }
                        : shouldApplyFilter
                          ? { filter: "brightness(0) invert(1)", opacity: 0.55 }
                          : { filter: "invert(1)", opacity: 0.55 }
                    }
                    unoptimized={idx === 7 || idx === 9}
                  />
                </div>
              );
            })}
          </div>
        </div>
        )}
      </div>

      <style jsx>{`
        @keyframes heroMinimalLogoIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
