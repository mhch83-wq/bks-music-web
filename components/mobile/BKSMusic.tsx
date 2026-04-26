"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Flip } from "gsap/dist/Flip";
import { FONT_EUROPA_STACK } from "@/lib/europaFont";
import BKSMusicHero from "./BKSMusicHero";
import BKSMusicStats from "./BKSMusicStats";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip);
}


const TEAM_MEMBERS = [
  {
    name: "Jacqueline",
    roles: ["Songwriter", "Vocalist"],
    imageSrc: "/Javi.jpeg",
    imageAlt: "Jacqueline",
    glowSize: 256,
    imageClass: "opacity-80 hover:opacity-100 brightness-110",
    imageStyle: undefined as undefined | Record<string, string>,
  },
  {
    name: "Kilroi",
    roles: ["Producer", "Songwriter"],
    imageSrc: "/Jacque.jpeg",
    imageAlt: "Kilroi",
    glowSize: 200,
    imageClass: "opacity-80 hover:opacity-100 brightness-110",
    imageStyle: undefined as undefined | Record<string, string>,
  },
  {
    name: "Manu Chalud",
    roles: ["Producer", "Songwriter", "Publisher"],
    imageSrc: "/Manu3.jpg",
    imageAlt: "Manu Chalud",
    glowSize: 256,
    imageClass: "opacity-90 hover:opacity-100 transition-all duration-300 brightness-110",
    imageStyle: { objectPosition: "center 35%" },
  },
];

interface BKSMusicProps {
  activeHeroBg?: string;
  version?: string;
  onV3LiftChange?: (offset: number, autoLifted: boolean) => void;
}

export default function BKSMusic({ activeHeroBg, version = "v3", onV3LiftChange }: BKSMusicProps = {}) {
  const [activeMember, setActiveMember] = useState<number | null>(null);
  const [displayedMember, setDisplayedMember] = useState<number | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAppearing, setIsAppearing] = useState(false);
  const [v3InfoOffset, setV3InfoOffset] = useState(0);
  const [v3AutoLifted, setV3AutoLifted] = useState(false);

  // Refs for V3 Pinned Background
  const v3SectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeMember !== null) {
      setDisplayedMember(activeMember);
      setOverlayVisible(true);
      setIsClosing(false);
      setIsAppearing(true);

      const timeout = setTimeout(() => {
        setIsAppearing(false);
      }, 10);

      return () => clearTimeout(timeout);
    } else {
      setIsClosing(true);
      const timeout = setTimeout(() => {
        setOverlayVisible(false);
        setIsClosing(false);
        setDisplayedMember(null);
      }, 450);

      return () => clearTimeout(timeout);
    }
  }, [activeMember]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveMember(null);
      }
    };

    if (overlayVisible) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [overlayVisible]);

  // Movimiento progresivo (sin salto) del bloque Creación/Catálogo/Talento.
  useEffect(() => {
    const updateV3InfoOffset = () => {
      if (version !== "v3") {
        setV3InfoOffset(0);
        setV3AutoLifted(false);
        return;
      }
      const spanishImg = document.querySelector('img[alt="Español y latino"]') as HTMLImageElement | null;
      if (!spanishImg) return;

      const rect = spanishImg.getBoundingClientRect();
      if (rect.height < 8) return;
      let offset: number;
      if (rect.bottom > 520) {
        offset = 0;
      } else if (rect.bottom > 120) {
        // Rampa con ease-out-back: más efecto derrape (overshoot y asentamiento)
        const linear = (520 - rect.bottom) / 480; // rango ampliado 520→120
        const t = Math.max(0, Math.min(1, linear));
        const c1 = 2.8; // más overshoot = más derrape
        const easeOutBack = 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        offset = Math.max(0, easeOutBack * 290);
      } else {
        offset = 290;
      }
      setV3InfoOffset(offset);

      // Subir: disparar cuando la sección está abajo en pantalla.
      if (rect.bottom <= 520) {
        setV3AutoLifted(true);
      } else if (v3SectionRef.current) {
        // Bajar: resetear cuando la sección sigue DEBAJO del viewport, para que
        // el bloque vuelva a su sitio ANTES de que el usuario lo vea al subir.
        const sectionTop = v3SectionRef.current.getBoundingClientRect().top;
        if (sectionTop > window.innerHeight + 80) {
          setV3AutoLifted(false);
        } else if (rect.bottom > 650) {
          setV3AutoLifted(false);
        }
      }
    };

    window.addEventListener("scroll", updateV3InfoOffset, { passive: true });
    window.addEventListener("resize", updateV3InfoOffset);
    window.addEventListener("load", updateV3InfoOffset);
    updateV3InfoOffset();

    return () => {
      window.removeEventListener("scroll", updateV3InfoOffset);
      window.removeEventListener("resize", updateV3InfoOffset);
      window.removeEventListener("load", updateV3InfoOffset);
    };
  }, [version]);

  useEffect(() => {
    if (onV3LiftChange) onV3LiftChange(v3InfoOffset, v3AutoLifted);
  }, [v3InfoOffset, v3AutoLifted, onV3LiftChange]);

  // Efecto de Pinned Background para V3 (Reemplazado por CSS puro)
  useEffect(() => {
    // GSAP pinning and pinType: transform fallan consistentemente debido a conflictos de stacking
    // index con Next.js y Lenis smooth scroll. Hemos migrado la lógica a CSS `position: sticky` nativo
    // en el contenedor renderVersion3, lo cual el navegador maneja a nivel de motor de renderizado
    // sin necesidad de cálculos JavaScript propensos a fallos por hooks de layout.
  }, [version, activeHeroBg]);

  // Efecto de revelado "Professional Double-Split" (SplitText Style)
  // Efecto de revelado "Editorial Curtain" + Parallax coordinado
  useEffect(() => {
    const ctx = gsap.context(() => {
    const targets = document.querySelectorAll(".reveal-text");

    targets.forEach((el) => {
      const img = el.querySelector("img");
      const isV3Image = version === "v3"; // Fix: target text blocks too

      // 1. Preparación para Texto (V1/V2/V3)
      if (!img && !el.hasAttribute("data-split-pro")) {
        el.setAttribute("data-split-pro", "true");
        const wrapWords = (node: Node) => {
          if (node.nodeType === 3) {
            const text = node.nodeValue || "";
            const wrapper = document.createElement("span");
            wrapper.style.display = "inline";
            const parts = text.split(/(\s+)/);
            wrapper.innerHTML = parts.map(part => {
              if (part.trim() === "") return part;
              return `<span class="word-p" style="display:inline-block; overflow:hidden; vertical-align:top;">
                <span class="word-i" style="display:inline-block; line-height:1.2;">${part}</span>
              </span>`;
            }).join("");
            node.parentNode?.replaceChild(wrapper, node);
          } else if (node.nodeType === 1) {
            Array.from(node.childNodes).forEach(child => wrapWords(child));
          }
        };
        wrapWords(el);
      }

      // 2. Animación de Revelado (Timeline con ScrollTrigger)
      if (!isV3Image) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            once: true
          }
        });

        // Revelado de palabras (Text V1/V2/V3)
        const inners = el.querySelectorAll(".word-i");
        if (inners.length > 0) {
          tl.fromTo(inners, 
            { y: "105%" },
            {
              y: "0%",
              duration: 1.2,
              stagger: 0.03,
              ease: "power3.out",
              onComplete: () => {
                gsap.set(el.querySelectorAll(".word-p"), { overflow: "visible" });
              }
            }
          );
        } else {
          tl.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 });
        }
      }

      // Parallax coordinado para V3 (Restaurado a valores estables)
      if (isV3Image) {
        const speed = el.getAttribute("data-speed") || "0";
        if (parseFloat(speed) !== 0) {
          const val = parseFloat(speed);
          const targetToAnimate = img || el;
          gsap.to(targetToAnimate, {
            y: -800 * val, // Efecto compresor fuerte
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: el.getAttribute("data-start") || "top 120%",
              end: "bottom+=100% top",
              scrub: 1,
              invalidateOnRefresh: true
            }
          });
        }
      }
      // 3. Parallax Editorial V3 (Diseño Premium)
      if (version === "v3") {
        const h1 = document.querySelector(".v3-line-1");
        const h2 = document.querySelector(".v3-line-2");
        const h3 = document.querySelector(".v3-line-3");
        
        if (h1) {
          gsap.to(h1, {
            y: -150,
            ease: "none",
            scrollTrigger: {
              trigger: h1,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2
            }
          });
        }
        
        if (h2) {
          gsap.to(h2, {
            y: -250,
            ease: "none",
            scrollTrigger: {
              trigger: h2,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2
            }
          });
        }

        if (h3) {
          gsap.to(h3, {
            y: -100,
            ease: "none",
            scrollTrigger: {
              trigger: h3,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2
            }
          });
        }

      }
    });
    });

    return () => {
      ctx.revert();
    };
  }, [version, activeHeroBg]);

  // Versión 3: Completamente en blanco (REDISEÑADA: BLOQUE INFORMATIVO UNIFICADO)
  const renderVersion3 = () => {
    return (
      <div ref={v3SectionRef} className="relative z-20 w-full bg-black px-4 sm:px-6 overflow-visible">
        {/* Wrapper unificado: hero + creación suben juntos con la misma velocidad */}
        <div
          style={{
            transform: `translateY(-${v3AutoLifted ? 290 : v3InfoOffset}px)`,
            transition: v3AutoLifted
              ? "transform 2600ms cubic-bezier(0.33, 0.01, 0.2, 1)"
              : "transform 1200ms cubic-bezier(0.33, 0.01, 0.2, 1)",
            willChange: "transform"
          }}
        >
        {/* INTRO PROTEGIDA (01-04) */}
        <BKSMusicHero />

        {/* 
            BRUTALIST POSTER - FULL WIDTH (V3 NEW DESIGN)
            Un diseño de alto impacto con bloques de color sólido y tipografía cruda.
        */}
        <div className="w-full relative z-30 py-4 md:py-6">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 lg:gap-16">

              {/* 01. Creación */}
              <div className="flex flex-col gap-6">
                <span className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase">01 — Creación</span>
                <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  Songwriting, producción y dirección creativa.
                </h4>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed font-semibold">
                  Vivimos entre el pop, rock, la electrónica y lo urbano. Desarrollamos repertorio junto a artistas y sellos con los que compartimos criterio y ganas. Cuidamos el proceso y el resultado, con comunicación rápida y directa.
                </p>
              </div>



              {/* 02. Catálogo */}
              <div className="flex flex-col gap-6">
                <span className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase">02 — Catálogo</span>
                <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  Un catálogo propio en constante movimiento,
                </h4>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed font-semibold">
                  con visión colaborativa y preparado para propuestas entre sellos, editoriales, artistas y management. Clearance claro y flexible para que cada canción encuentre su lugar de forma fácil.
                </p>
                <a href="#" className="inline-block text-[10px] font-black tracking-[0.4em] text-white/40 uppercase border-b border-white/20 pb-0.5 w-fit hover:text-white hover:border-white transition-colors duration-300">
                  Acceder a catálogo →
                </a>
              </div>

              {/* 03. Talento */}
              <div className="flex flex-col gap-6">
                <span className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase">03 — Talento</span>
                <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  Desarrollo de Talento.
                </h4>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed font-semibold">
                  Nada nos gusta más que identificar y apoyar el talento. Dedicamos recursos a mentorizar y acompañar a artistas y compositores/as con los que nos sentimos identificados, ayudándoles a construir repertorio, narrativa y posicionamiento dentro de la industria.
                </p>
              </div>

            </div>
          </div>

          {/* Nuevo Contador de Estadísticas Dinámico */}
          <BKSMusicStats />

          <div className="max-w-5xl mx-auto pb-0 mt-6">
            <div className="mt-3 pt-2 flex flex-col items-center text-center">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-[0.4em] mb-8 text-white/90" style={{ fontFamily: FONT_EUROPA_STACK }}>
                ¿Te apetece conocernos?
              </h3>
              <p className="text-base md:text-lg text-white/40 max-w-2xl leading-relaxed font-bold uppercase tracking-wider">
                Nos encantará hablar y ver cómo podemos trabajar&nbsp;juntos.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  };


  return (
    <section
      id="quienes-somos"
      className="relative pt-0 pb-0 transition-colors duration-500 bg-black"
      style={{
        backgroundColor: 'black',
        position: 'relative',
        background: 'black'
      }}
    >
      {renderVersion3()}


      {overlayVisible && displayedMember !== null && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-pointer backdrop-blur-sm transition-all duration-500 ${isAppearing
            ? "bg-black/0 opacity-0"
            : isClosing
              ? "bg-black/0 opacity-0"
              : "bg-black/80 opacity-100"
            }`}
          onClick={() => setActiveMember(null)}
          aria-modal="true"
          role="dialog"
          style={{ zIndex: 100 }}
        >
          <div
            className={`relative w-full max-w-xl aspect-square sm:aspect-[4/5] bg-black/70 border border-white/10 rounded-3xl overflow-hidden cursor-auto transform transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isAppearing
              ? "opacity-0 scale-90 translate-y-6"
              : isClosing
                ? "opacity-0 scale-95 translate-y-4"
                : "opacity-100 scale-100 translate-y-0"
              }`}
            onClick={(event) => event.stopPropagation()}
          >
            {displayedMember !== null && (
              <>
                <Image
                  src={TEAM_MEMBERS[displayedMember].imageSrc}
                  alt={TEAM_MEMBERS[displayedMember].imageAlt}
                  fill
                  className="object-cover"
                  style={TEAM_MEMBERS[displayedMember].imageStyle}
                  sizes="(max-width: 768px) 90vw, 50vw"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6">
                  <h3 className="text-white text-lg sm:text-xl font-semibold">
                    {TEAM_MEMBERS[displayedMember].name}
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm uppercase tracking-[0.2em] mt-2">
                    {TEAM_MEMBERS[displayedMember].roles.join(" • ")}
                  </p>
                  {displayedMember === 0 && (
                    <div className="mt-3 flex justify-end">
                      <a
                        href="https://www.instagram.com/jacqueline.prez/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram de Jacqueline"
                        className="inline-flex items-center justify-center text-white/80 hover:text-white transition"
                      >
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </a>
                    </div>
                  )}
                  {displayedMember === 1 && (
                    <div className="mt-3 flex justify-end">
                      <a
                        href="https://www.instagram.com/_kilroi/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram de Kilroi"
                        className="inline-flex items-center justify-center text-white/80 hover:text-white transition"
                      >
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </a>
                    </div>
                  )}
                  {displayedMember === 2 && (
                    <div className="mt-3 flex justify-end">
                      <a
                        href="https://www.instagram.com/manuchalud/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram de Manu Chalud"
                        className="inline-flex items-center justify-center text-white/80 hover:text-white transition"
                      >
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMember(null)}
                  className="absolute top-3 right-3 rounded-full bg-white/10 hover:bg-white/20 text-white p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 transition"
                  aria-label="Cerrar foto ampliada"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
