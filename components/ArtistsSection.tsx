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
  "Fabbio"
];

interface ArtistsSectionProps {
  activeHeroBg?: string;
  artistsVersion?: string;
  onArtistsVersionChange?: (version: string) => void;
  pageVersion?: string;
}

export default function ArtistsSection({ activeHeroBg, artistsVersion: propArtistsVersion = "a2", onArtistsVersionChange, pageVersion }: ArtistsSectionProps) {
  const [artistsVersion, setArtistsVersion] = useState<string>(propArtistsVersion);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastScrollY = useRef<number>(0);
  const offsetX = useRef<number[]>([]);
  const lineWidths = useRef<number[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [contentVisible, setContentVisible] = useState(false);
  const scrollDirectionRef = useRef<number>(0); // 1 = bajando, -1 = subiendo

  // Dividir artistas en 5 líneas según especificación
  const line1 = artists.slice(0, 10); // Chino & Nacho, Micro TDH, Omar Montes… Juan Magán
  const line2 = artists.slice(10, 18); // Don Patricio hasta Lérica
  const line3 = artists.slice(18, 27); // María Pelae hasta Polo Nandez
  const line4 = artists.slice(27, 34); // Nyno Vargas hasta Lennis Rodriguez
  const line5 = artists.slice(34); // Antonio José hasta Fabbio

  const lines = [line1, line2, line3, line4, line5];

  // Actualizar cuando cambie el prop
  useEffect(() => {
    if (propArtistsVersion !== artistsVersion) {
      setArtistsVersion(propArtistsVersion);
    }
  }, [propArtistsVersion]);

  const handleVersionChange = (version: string) => {
    setArtistsVersion(version);
    if (onArtistsVersionChange) {
      onArtistsVersionChange(version);
    }
  };

  useEffect(() => {
    const t = window.setTimeout(() => setContentVisible(true), 1700);
    return () => window.clearTimeout(t);
  }, []);

  // Efecto de movimiento lateral alternado por líneas con marquesina infinita
  useEffect(() => {
    if ((pageVersion !== "v1" && pageVersion !== "v3") || artistsVersion !== "a2") return;

    // Inicializar offsets para cada línea
    if (offsetX.current.length === 0) {
      offsetX.current = [0, 0, 0, 0, 0];
    }

    let rafId: number | null = null;
    const currentSpeeds = [0, 0, 0, 0, 0];
    const speedMultiplier = 0.08; 
    const smoothing = 0.15;
    const directions = [1, -1, 1, -1, 1];

    const calculateLineWidths = () => {
      lineRefs.current.forEach((lineRef, index) => {
        if (lineRef) {
          const style = window.getComputedStyle(lineRef);
          const gap = parseInt(style.gap || style.columnGap) || 64;
          // El scrollWidth no incluye el último gap. Sumándolo, obtenemos exactamente Copias * (AnchoLista + Gap)
          const totalWidth = lineRef.scrollWidth + gap;
          const W = totalWidth / 12; // Ahora con 12 copias para seguridad total
          lineWidths.current[index] = W;
          
          if (offsetX.current[index] === 0) {
            // Empezar en la cuarta copia para tener margen infinito a ambos lados
            offsetX.current[index] = -W * 4;
          }
        }
      });
    };

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDelta = currentScrollY - lastScrollY.current;

      // En v3: el marquee siempre responde al scroll sin zona de frenado.
      // En v1: mantener la zona de frenado original.
      let speedFactor = 1;
      if (pageVersion !== "v3") {
        const sectionTop = sectionRef.current?.getBoundingClientRect().top || 0;
        const vh = window.innerHeight;
        const stopLine = vh * 0.25;
        const startBrakeLine = vh * 0.50;
        if (sectionTop <= stopLine) {
          speedFactor = 0;
        } else if (sectionTop < startBrakeLine) {
          const progress = (sectionTop - stopLine) / (startBrakeLine - stopLine);
          speedFactor = progress * progress;
        }
      }

      for (let index = 0; index < 5; index++) {
        const targetSpeed = scrollDelta * 0.008 * directions[index] * speedFactor;
        currentSpeeds[index] += (targetSpeed - currentSpeeds[index]) * smoothing;
      }
      lastScrollY.current = currentScrollY;
    };

    const animate = () => {
      lineRefs.current.forEach((lineRef, index) => {
        if (lineRef && lineWidths.current[index] > 0) {
          // Solo se mueve por la velocidad adquirida del scroll (sin movimiento base)
          offsetX.current[index] += currentSpeeds[index];
          const W = lineWidths.current[index];

          // Ventana de wraparound invisible: mantenemos el offset entre -2W y -8W
          if (offsetX.current[index] >= -2 * W) {
            offsetX.current[index] -= W;
          } else if (offsetX.current[index] <= -9 * W) {
            offsetX.current[index] += W;
          }

          lineRef.style.transform = `translate3d(${offsetX.current[index]}px, 0, 0)`;
          // Fricción ultraligera (0.985) para dejar una "cola" muy larga y natural al detenerse
          currentSpeeds[index] *= 0.985;
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
  }, [pageVersion, artistsVersion]);

  return (
    <section style={{ opacity: contentVisible ? 1 : 0, transition: "opacity 0.9s ease-out" }} ref={sectionRef} className={`relative -mt-8 md:-mt-2 ${pageVersion === "v1" ? "pt-0 md:pt-0" : "pt-0 md:pt-2"} pb-8 sm:pb-12 overflow-visible ${activeHeroBg === "hero4" ? "bg-transparent" : "bg-black"}`}>
      <div className={`relative mx-auto ${(pageVersion === "v1" || pageVersion === "v3") ? "w-full px-0" : "max-w-7xl px-4 sm:px-6"}`}>
        <div className={`flex items-center gap-4 ${pageVersion === "v1" ? "-mb-2 sm:-mb-4 justify-end" : "mb-4 sm:mb-6 justify-center"}`}>
          {pageVersion !== "v1" && (
            <h2 className={`text-xs sm:text-sm uppercase tracking-widest ${pageVersion === "v3" ? "text-gray-400 font-medium" : "text-gray-500 font-light"}`}>
              Artistas
            </h2>
          )}
          {/* Selector removido */}
        </div>

        {(pageVersion === "v1" || pageVersion === "v3") && artistsVersion === "a2" ? (
          // Renderizar por líneas con movimiento alternado y marquesina infinita para A2
          <div className="flex flex-col gap-y-0 sm:gap-y-0.5 overflow-hidden relative mx-6 sm:mx-12 md:mx-24 lg:mx-32">
            {/* Degradado sutil sobre todos los nombres */}
            <div
              className="absolute inset-0 pointer-events-none z-30"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0.4) 100%)',
                mixBlendMode: 'multiply'
              }}
            />
            {lines.map((line, lineIndex) => {
              // Duplicar elementos (12 veces) para asegurar cobertura infinita real
              const duplicatedLine = Array(12).fill(line).flat();
              return (
                <div
                  key={lineIndex}
                  className="relative overflow-hidden"
                  style={{ width: '100%' }}
                >
                  <div
                    ref={(el) => {
                      lineRefs.current[lineIndex] = el;
                    }}
                    className="flex justify-start gap-x-6 sm:gap-x-8 whitespace-nowrap"
                    style={{
                      willChange: "transform",
                    }}
                  >
                    {duplicatedLine.map((artist, artistIndex) => {
                      // Color aleatorio determinista para que cada artista tenga su propio brillo
                      const baseColor = (artist.length + artistIndex) % 3 === 0 ? '#666666' : '#cccccc';
                      
                      return (
                        <span
                          key={`${lineIndex}-${artistIndex}`}
                          className="relative z-10 transition-colors duration-200 cursor-pointer uppercase tracking-wider text-[10px] sm:text-xs md:text-sm font-semibold text-white flex-shrink-0"
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

