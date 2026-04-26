"use client";

import { useState, useEffect, useRef } from "react";

const artists = [
  "Chino & Nacho",
  "Micro TDH",
  "Omar Montes",
  "Zion & Lennox",
  "Ludmilla",
  "Coti",
  "Ruslana",
  "Carlos Baute",
  "Ana Mena",
  "Juan Magán",
  "Don Patricio",
  "Álex Ubago",
  "Cruz Cafuné",
  "Marta Sánchez",
  "DVICIO",
  "Danny Romero",
  "Adexe y Nau",
  "Lérica",
  "María Pelae",
  "Marlena",
  "Blas Cantó",
  "Gloria Trevi",
  "Bombai",
  "Dj Nano",
  "Lu Decker",
  "Kalenn",
  "Polo Nandez",
  "Nyno Vargas",
  "Oscar El Ruso",
  "María Luna",
  "Sweet California",
  "Guzmen",
  "Kapla y Miky",
  "Lennis Rodriguez",
  "Antonio José",
  "Mar Lucas",
  "Jowell & Randy",
  "Abril",
  "Soraya",
  "Tatiana de la Luz",
  "Miki Núñez",
  "Fabbio",
  "Jose Otero",
  "Kamilo",
  "Maytane",
  "Nerea Rodriguez",
  "Xuso Jones"
];

interface ArtistsSectionProps {
  activeHeroBg?: string;
  artistsVersion?: string;
  pageVersion?: string;
}

export default function ArtistsSection({ activeHeroBg, artistsVersion: propArtistsVersion = "a2", pageVersion }: ArtistsSectionProps) {
  const [artistsVersion, setArtistsVersion] = useState<string>(propArtistsVersion);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastScrollY = useRef<number>(0);
  const offsetX = useRef<number[]>([]);
  const lineWidths = useRef<number[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [contentVisible, setContentVisible] = useState(false);

  // Más líneas con menos artistas cada una: así cada línea encaja en móvil y se ven todos a primera vista
  const lines = [
    artists.slice(0, 6),
    artists.slice(6, 12),
    artists.slice(12, 18),
    artists.slice(18, 24),
    artists.slice(24, 30),
    artists.slice(30, 36),
    artists.slice(36, 42),
    artists.slice(42),
  ];

  // Actualizar cuando cambie el prop
  useEffect(() => {
    if (propArtistsVersion !== artistsVersion) {
      setArtistsVersion(propArtistsVersion);
    }
  }, [propArtistsVersion]);

  useEffect(() => {
    const t = window.setTimeout(() => setContentVisible(true), 1700);
    return () => window.clearTimeout(t);
  }, []);

  // Efecto de movimiento lateral alternado por líneas con marquesina infinita
  useEffect(() => {
    if ((pageVersion !== "v1" && pageVersion !== "v3") || artistsVersion !== "a2") return;

    const numLines = lines.length;
    if (offsetX.current.length !== numLines) {
      offsetX.current = Array(numLines).fill(0);
    }

    let rafId: number | null = null;
    const currentSpeeds = Array(numLines).fill(0);
    const smoothing = 0.15;
    const directions = [1, -1, 1, -1, 1, -1, 1, -1];
    const baseSpeed = 0.02; // Velocidad muy sutil

    const calculateLineWidths = () => {
      lineRefs.current.forEach((lineRef, index) => {
        if (lineRef) {
          const style = window.getComputedStyle(lineRef);
          const gap = parseInt(style.gap || style.columnGap) || 12;
          // El scrollWidth no incluye el último gap. Sumándolo, obtenemos exactamente Copias * (AnchoLista + Gap)
          const totalWidth = lineRef.scrollWidth + gap;
          const W = totalWidth / 12; // Ahora con 12 copias para seguridad total
          lineWidths.current[index] = W;
          
          if (offsetX.current[index] === 0) {
            // Empezar en 0 para que los primeros artistas sean visibles de inmediato
            offsetX.current[index] = 0;
          }
        }
      });
    };

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDelta = currentScrollY - lastScrollY.current;

      for (let index = 0; index < numLines; index++) {
        const scrollBoost = scrollDelta * 0.008 * directions[index];
        currentSpeeds[index] += (scrollBoost - currentSpeeds[index]) * smoothing;
      }
      lastScrollY.current = currentScrollY;
    };

    const animate = () => {
      lineRefs.current.forEach((lineRef, index) => {
        if (lineRef && lineWidths.current[index] > 0) {
          // Velocidad base siempre + boost del scroll (que decae cuando paras)
          const totalSpeed = baseSpeed * directions[index] + currentSpeeds[index];
          offsetX.current[index] += totalSpeed;
          currentSpeeds[index] *= 0.998; // Decae muy lento el boost del scroll
          const W = lineWidths.current[index];

          // Ventana de wraparound: mantenemos el offset para scroll infinito
          if (offsetX.current[index] > -0.5 * W) {
            offsetX.current[index] -= W;
          } else if (offsetX.current[index] <= -11.5 * W) {
            offsetX.current[index] += W;
          }

          lineRef.style.transform = `translate3d(${offsetX.current[index]}px, 0, 0)`;
        }
      });
      rafId = requestAnimationFrame(animate);
    };

    // Recalcular varias veces para asegurar precisión tras renderizado de fuentes
    setTimeout(calculateLineWidths, 100);
    setTimeout(calculateLineWidths, 1000);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", calculateLineWidths);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateLineWidths);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [pageVersion, artistsVersion, lines.length]);

  return (
    <section
      style={{ opacity: contentVisible ? 1 : 0, transition: "opacity 0.9s ease-out" }}
      ref={sectionRef}
      className={`relative -mt-8 md:-mt-2 ${pageVersion === "v1" ? "pt-0 md:pt-0" : "pt-0 md:pt-2"} pb-12 sm:pb-16 overflow-visible ${activeHeroBg === "hero4" ? "bg-transparent" : "bg-black"}`}
    >
      <div className={`relative mx-auto ${(pageVersion === "v1" || pageVersion === "v3") ? "w-full px-0" : "max-w-7xl px-4 sm:px-6"}`}>
        <div className={`flex items-center gap-4 ${pageVersion === "v1" ? "-mb-2 sm:-mb-4 justify-end" : "mb-4 sm:mb-6 justify-center"}`}>
          {pageVersion !== "v1" && (
            <h2 className="text-[8px] sm:text-[9px] font-light text-gray-500 uppercase tracking-widest">
              Artistas
            </h2>
          )}
          {/* Selector removido */}
        </div>

        {(pageVersion === "v1" || pageVersion === "v3") && artistsVersion === "a2" ? (
          // Marquesina infinita con variación de tonos (unos más blancos, otros más grises)
          <div className="flex flex-col gap-y-0 overflow-x-hidden overflow-y-visible relative mx-2 sm:mx-12 md:mx-24 lg:mx-32">
            {/* Degradado sutil sobre todos los nombres */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.08) 80%, rgba(0,0,0,0.2) 100%)',
                mixBlendMode: 'multiply'
              }}
            />
            {lines.map((line, lineIndex) => {
              // Duplicar elementos (12 veces) para asegurar cobertura infinita real
              const duplicatedLine = Array(12).fill(line).flat();
              return (
                <div
                  key={lineIndex}
                  className="relative overflow-x-hidden overflow-y-visible leading-none"
                  style={{ width: '100%', minHeight: '0.95em' }}
                >
                  <div
                    ref={(el) => {
                      lineRefs.current[lineIndex] = el;
                    }}
                    className="flex justify-start gap-x-1.5 sm:gap-x-3 whitespace-nowrap"
                    style={{
                      willChange: "transform",
                    }}
                  >
                    {duplicatedLine.map((artist, artistIndex) => {
                      // Variación de tonos: unos más blancos, otros más grises
                      const baseColor = (artist.length + artistIndex) % 3 === 0 ? '#555555' : '#dddddd';
                      
                      return (
                        <span
                          key={`${lineIndex}-${artistIndex}`}
                          className="relative z-10 transition-colors duration-200 cursor-pointer uppercase tracking-wider text-[9px] sm:text-xs md:text-sm font-semibold flex-shrink-0 leading-none"
                          style={{
                            transition: 'color 0.2s ease-in-out',
                            filter: 'brightness(1)',
                            color: baseColor
                          }}
                          onMouseEnter={(e) => {
                            if (window.innerWidth >= 768) {
                              e.currentTarget.style.color = '#ffffff';
                              e.currentTarget.style.filter = 'brightness(1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (window.innerWidth >= 768) {
                              e.currentTarget.style.color = baseColor;
                              e.currentTarget.style.filter = 'brightness(1)';
                            }
                          }}
                        >
                          {artist}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : pageVersion === "v1" && artistsVersion === "a1" ? (
          // Renderizar por líneas sin movimiento para A1
          <div className="flex flex-col gap-y-2 sm:gap-y-3 relative">
            {/* Degradado sutil sobre todos los nombres */}
            <div
              className="absolute inset-0 pointer-events-none z-30"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0.4) 100%)',
                mixBlendMode: 'multiply'
              }}
            />
            {lines.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className="flex flex-wrap justify-between gap-x-4 sm:gap-x-6"
              >
                {line.map((artist, artistIndex) => (
                  <span
                    key={`${lineIndex}-${artistIndex}`}
                    className="relative z-10 transition-colors duration-200 cursor-pointer uppercase tracking-wider text-xs sm:text-sm md:text-base font-bold text-white"
                    style={{
                      transition: 'color 0.2s ease-in-out, filter 0.2s ease-in-out',
                      filter: 'brightness(1)',
                      color: '#ffffff'
                    }}
                    onMouseEnter={(e) => {
                      if (window.innerWidth >= 768) {
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.filter = 'brightness(1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (window.innerWidth >= 768) {
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.filter = 'brightness(1)';
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
          // Renderizar normal para otras versiones
          <div className={`flex flex-wrap ${pageVersion === "v1" ? "justify-between" : "justify-center"} gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3`}>
            {artists.map((artist, index) => (
              <span
                key={index}
                className={`relative z-10 transition-colors duration-200 cursor-pointer uppercase tracking-wider ${pageVersion === "v1"
                    ? "text-xs sm:text-sm md:text-base font-bold text-white"
                    : "text-[9px] sm:text-[10px] font-light text-gray-100"
                  }`}
                style={{
                  transition: 'color 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.color = pageVersion === "v1" ? '#ffffff' : '#f3f4f6';
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

