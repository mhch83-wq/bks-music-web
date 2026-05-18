"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { ARTISTS_IN_ORDER } from "@/lib/artistsOrdered";
import { getMarqueePeriodPx } from "@/lib/marqueeMeasure";

const artists = Array.from(ARTISTS_IN_ORDER);

const MARQUEE_SEGMENT_COPIES = 8;

/** translateX en (-W, 0]: desplazamiento negativo, sin hueco vacío a la izquierda. */
const wrapMarqueeOffset = (x: number, W: number) => {
  if (W <= 0) return x;
  let o = x;
  while (o > 0) o -= W;
  while (o <= -W) o += W;
  return o;
};

interface ArtistsSectionProps {
  activeHeroBg?: string;
  artistsVersion?: string;
  onArtistsVersionChange?: (version: string) => void;
  pageVersion?: string;
}

export default function ArtistsSection({
  activeHeroBg,
  artistsVersion: propArtistsVersion = "a2",
  onArtistsVersionChange: _onArtistsVersionChange,
  pageVersion,
}: ArtistsSectionProps) {
  const [artistsVersion, setArtistsVersion] = useState<string>(propArtistsVersion);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastScrollY = useRef<number>(0);
  const offsetX = useRef<number[]>([]);
  const lineWidths = useRef<number[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [contentVisible, setContentVisible] = useState(false);

  const line1 = artists.slice(0, 10);
  const line2 = artists.slice(10, 18);
  const line3 = artists.slice(18, 27);
  const line4 = artists.slice(27, 34);
  const line5 = artists.slice(34);
  const lines = [line1, line2, line3, line4, line5];

  useEffect(() => {
    if (propArtistsVersion !== artistsVersion) {
      setArtistsVersion(propArtistsVersion);
    }
  }, [propArtistsVersion, artistsVersion]);

  useEffect(() => {
    const t = window.setTimeout(() => setContentVisible(true), 1700);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if ((pageVersion !== "v1" && pageVersion !== "v3") || artistsVersion !== "a2") return;

    if (offsetX.current.length === 0) {
      offsetX.current = [0, 0, 0, 0, 0];
    }

    lastScrollY.current =
      typeof window !== "undefined"
        ? window.pageYOffset || document.documentElement.scrollTop || 0
        : 0;

    let rafId: number | null = null;
    const currentSpeeds = [0, 0, 0, 0, 0];
    const smoothing = 0.15;
    // Filas alternas: una dirección y la siguiente al contrario (solo se mueve con el scroll).
    const directions = [1, -1, 1, -1, 1];

    const calculateLineWidths = () => {
      lineRefs.current.forEach((lineRef, index) => {
        const W = getMarqueePeriodPx(lineRef);
        if (W > 1) {
          lineWidths.current[index] = W;
          offsetX.current[index] = wrapMarqueeOffset(offsetX.current[index] ?? 0, W);
        }
      });
    };

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const rawDelta = currentScrollY - lastScrollY.current;
      const scrollDelta = Math.max(-100, Math.min(100, rawDelta));

      let speedFactor = 1;
      if (pageVersion !== "v3") {
        const sectionTop = sectionRef.current?.getBoundingClientRect().top || 0;
        const vh = window.innerHeight;
        const stopLine = vh * 0.25;
        const startBrakeLine = vh * 0.5;
        if (sectionTop <= stopLine) {
          speedFactor = 0;
        } else if (sectionTop < startBrakeLine) {
          const progress = (sectionTop - stopLine) / (startBrakeLine - stopLine);
          speedFactor = progress * progress;
        }
      }

      for (let index = 0; index < 5; index++) {
        const targetSpeed = scrollDelta * 0.009 * directions[index] * speedFactor;
        currentSpeeds[index] += (targetSpeed - currentSpeeds[index]) * smoothing;
      }
      lastScrollY.current = currentScrollY;
    };

    const animate = () => {
      lineRefs.current.forEach((lineRef, index) => {
        if (lineRef && lineWidths.current[index] > 0) {
          const W = lineWidths.current[index];
          offsetX.current[index] = wrapMarqueeOffset(offsetX.current[index] - currentSpeeds[index], W);
          lineRef.style.transform = `translate3d(${offsetX.current[index]}px, 0, 0)`;
          currentSpeeds[index] *= 0.985;
        }
      });
      rafId = requestAnimationFrame(animate);
    };

    setTimeout(calculateLineWidths, 80);
    setTimeout(calculateLineWidths, 900);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", calculateLineWidths);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateLineWidths);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [pageVersion, artistsVersion]);

  useLayoutEffect(() => {
    if (!contentVisible) return;
    if ((pageVersion !== "v1" && pageVersion !== "v3") || artistsVersion !== "a2") return;
    const id = requestAnimationFrame(() => {
      lineRefs.current.forEach((lineRef, index) => {
        const W = getMarqueePeriodPx(lineRef);
        if (W > 1) {
          lineWidths.current[index] = W;
          offsetX.current[index] = wrapMarqueeOffset(offsetX.current[index] ?? 0, W);
        }
      });
      if (lineWidths.current[0] > 0) {
        offsetX.current[0] = 0;
        const row0 = lineRefs.current[0];
        if (row0) row0.style.transform = "translate3d(0px, 0, 0)";
      }
      lineRefs.current.forEach((lineRef, index) => {
        if (!lineRef || !(lineWidths.current[index] > 0)) return;
        lineRef.style.transform = `translate3d(${offsetX.current[index] ?? 0}px, 0, 0)`;
      });
    });
    return () => cancelAnimationFrame(id);
  }, [contentVisible, pageVersion, artistsVersion]);

  return (
    <section
      ref={sectionRef}
      style={{ opacity: contentVisible ? 1 : 0, transition: "opacity 0.9s ease-out" }}
      className={`relative -mt-8 md:-mt-2 ${pageVersion === "v1" ? "pt-0 md:pt-0" : "pt-0 md:pt-2"} pb-8 sm:pb-12 overflow-visible ${activeHeroBg === "hero4" ? "bg-transparent" : "bg-black"}`}
    >
      <div className={`relative mx-auto ${(pageVersion === "v1" || pageVersion === "v3") ? "w-full min-w-0 px-0" : "max-w-7xl px-4 sm:px-6"}`}>
        <div className={`flex items-center gap-4 ${pageVersion === "v1" ? "-mb-2 sm:-mb-4 justify-end" : "mb-4 sm:mb-6 justify-center"}`}>
          {pageVersion !== "v1" && (
            <h2 className={`text-xs sm:text-sm uppercase tracking-widest ${pageVersion === "v3" ? "text-gray-400 font-medium" : "text-gray-500 font-light"}`}>
              Artistas
            </h2>
          )}
        </div>

        {(pageVersion === "v1" || pageVersion === "v3") && artistsVersion === "a2" ? (
          <div
            className={
              pageVersion === "v3"
                ? "flex w-full min-w-0 max-w-none flex-col gap-y-0 sm:gap-y-0.5 overflow-hidden relative mx-0 px-0"
                : "flex min-w-0 flex-col gap-y-0 sm:gap-y-0.5 overflow-hidden relative mx-6 sm:mx-12 md:mx-24 lg:mx-32"
            }
          >
            <div
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0.4) 100%)",
                mixBlendMode: "multiply",
              }}
            />
            {lines.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className={
                  lineIndex === 0
                    ? "relative w-full min-w-0 overflow-hidden pl-2 sm:pl-3 md:pl-4"
                    : lineIndex === 1
                      ? "relative w-full min-w-0 overflow-hidden pl-2 sm:pl-3 md:pl-3"
                      : "relative w-full min-w-0 overflow-hidden"
                }
              >
                <div
                  ref={(el) => {
                    lineRefs.current[lineIndex] = el;
                  }}
                  className="flex w-max min-w-0 flex-shrink-0 flex-nowrap items-center gap-x-6 sm:gap-x-8 whitespace-nowrap"
                  style={{ willChange: "transform" }}
                >
                  {Array.from({ length: MARQUEE_SEGMENT_COPIES }, (_, seg) => (
                    <div
                      key={`${lineIndex}-seg-${seg}`}
                      className="flex flex-shrink-0 flex-nowrap items-center gap-x-6 sm:gap-x-8"
                      aria-hidden={seg !== 0}
                    >
                      {line.map((artist, i) => {
                        const baseColor = (artist.length + i + seg) % 3 === 0 ? "#666666" : "#cccccc";
                        return (
                          <span
                            key={`${lineIndex}-${seg}-${i}-${artist}`}
                            className="relative z-10 flex-shrink-0 cursor-pointer text-[10px] font-semibold uppercase tracking-wider text-white transition-colors duration-200 sm:text-xs md:text-sm"
                            style={{
                              transition: "color 0.2s ease-in-out",
                              filter: "brightness(1)",
                              color: baseColor,
                            }}
                            onMouseEnter={(e) => {
                              if (window.innerWidth >= 768) {
                                e.currentTarget.style.color = "#ffffff";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (window.innerWidth >= 768) {
                                e.currentTarget.style.color = baseColor;
                              }
                            }}
                          >
                            {artist}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : pageVersion === "v1" && artistsVersion === "a1" ? (
          <div className="flex flex-col gap-y-2 sm:gap-y-3 relative">
            <div
              className="absolute inset-0 pointer-events-none z-30"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0.4) 100%)",
                mixBlendMode: "multiply",
              }}
            />
            {lines.map((line, lineIndex) => (
              <div key={lineIndex} className="flex flex-wrap justify-between gap-x-4 sm:gap-x-6">
                {line.map((artist, artistIndex) => (
                  <span
                    key={`${lineIndex}-${artistIndex}`}
                    className="relative z-10 cursor-pointer text-xs font-bold uppercase tracking-wider text-white transition-colors duration-200 sm:text-sm md:text-base"
                    style={{
                      transition: "color 0.2s ease-in-out, filter 0.2s ease-in-out",
                      filter: "brightness(1)",
                      color: "#ffffff",
                    }}
                    onMouseEnter={(e) => {
                      if (window.innerWidth >= 768) {
                        e.currentTarget.style.color = "#ffffff";
                        e.currentTarget.style.filter = "brightness(1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (window.innerWidth >= 768) {
                        e.currentTarget.style.color = "#ffffff";
                        e.currentTarget.style.filter = "brightness(1)";
                      }
                    }}
                  >
                    {artist}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className={`flex flex-wrap ${pageVersion === "v1" ? "justify-between" : "justify-center"} gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3`}>
            {artists.map((artist, index) => (
              <span
                key={index}
                className={`relative z-10 cursor-pointer uppercase tracking-wider transition-colors duration-200 ${
                  pageVersion === "v1" ? "text-xs font-bold text-white sm:text-sm md:text-base" : "text-[9px] font-light text-gray-100 sm:text-[10px]"
                }`}
                style={{ transition: "color 0.2s ease-in-out" }}
                onMouseEnter={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.color = pageVersion === "v1" ? "#ffffff" : "#f3f4f6";
                  }
                }}
              >
                {artist}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
