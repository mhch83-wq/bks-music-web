"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
}

export default function BKSMusic({ activeHeroBg }: BKSMusicProps = {}) {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const [servicesVisible, setServicesVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMember, setActiveMember] = useState<number | null>(null);
  const [displayedMember, setDisplayedMember] = useState<number | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAppearing, setIsAppearing] = useState(false);

  useEffect(() => {
    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => new Set(prev).add(index));
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(ref);
      return observer;
    });

    let servicesObserver: IntersectionObserver | null = null;
    if (servicesRef.current) {
      servicesObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setServicesVisible(true);
          }
        },
        { threshold: 0.1 }
      );
      servicesObserver.observe(servicesRef.current);
    }

    return () => {
      observers.forEach((observer) => observer?.disconnect());
      servicesObserver?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeMember !== null) {
      setDisplayedMember(activeMember);
      setOverlayVisible(true);
      setIsClosing(false);
      setIsAppearing(true);

      // Usar setTimeout en lugar de requestAnimationFrame para asegurar que funcione
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

  return (
    <section 
      id="quienes-somos" 
      className="relative pt-8 md:pt-16 pb-32 rainbow-section" 
      style={{ 
        backgroundColor: 'transparent',
        overflow: 'hidden', 
        position: 'relative',
        background: 'transparent'
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = rect.width;
        const height = rect.height;
        
        // Activar hover en áreas donde el arcoíris es claramente visible:
        // - Bordes laterales (primeros 20% izquierdo y últimos 20% derecho)
        // - Parte inferior (últimos 60% de altura)
        const isInLeftEdge = x < width * 0.2;
        const isInRightEdge = x > width * 0.8;
        const isInBottomArea = y > height * 0.4;
        
        setIsHovered(isInLeftEdge || isInRightEdge || isInBottomArea);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Arcoíris pastel de fondo (semicírculo completo) */}
      <style jsx>{`
        @keyframes rainbowBreath {
          0%, 100% {
            transform: translateX(0) scale(1);
            opacity: 0.38;
          }
          50% {
            transform: translateX(10px) scale(1.02);
            opacity: 0.42;
          }
        }
        @keyframes rainbowBreathMobile {
          0%, 100% {
            transform: translateX(0) scale(1);
            opacity: 0.08;
          }
          50% {
            transform: translateX(10px) scale(1.02);
            opacity: 0.10;
          }
        }
        .rainbow-animated {
          animation: rainbowBreath 8s ease-in-out infinite;
          transition: opacity 0.6s ease-in-out, filter 0.6s ease-in-out;
        }
        @media (max-width: 767px) {
          .rainbow-animated {
            animation: rainbowBreathMobile 8s ease-in-out infinite;
          }
        }
      `}</style>
      {activeHeroBg !== "hero4" && (
        <div 
          className="absolute bottom-0 left-0 right-0 rainbow-animated pointer-events-none md:opacity-100"
          style={{
            height: '80%',
            zIndex: 0,
            opacity: isHovered ? 0.72 : 0.38,
            filter: isHovered ? 'brightness(1.7) saturate(1.15)' : 'none',
            transition: 'opacity 0.6s ease-in-out, filter 0.6s ease-in-out'
          }}
        >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 700"
          preserveAspectRatio="none"
          style={{ position: 'absolute', bottom: 0, left: 0 }}
          className="md:opacity-100"
        >
          <g strokeLinecap="round">
            {/* Centro del círculo muy por debajo del viewport para mostrar el arco completo */}
            {/* Radios decrecientes para las franjas del arcoíris */}
            <circle cx="600" cy="900" r="820" fill="none" stroke="rgba(255, 182, 193, 0.30)" strokeWidth="14" className="md:opacity-100" style={{ filter: 'blur(10px)', opacity: 'inherit' }} />
            <circle cx="600" cy="900" r="790" fill="none" stroke="rgba(255, 192, 203, 0.26)" strokeWidth="14" className="md:opacity-100" style={{ filter: 'blur(10px)', opacity: 'inherit' }} />
            <circle cx="600" cy="900" r="760" fill="none" stroke="rgba(221, 160, 221, 0.24)" strokeWidth="14" className="md:opacity-100" style={{ filter: 'blur(10px)', opacity: 'inherit' }} />
            <circle cx="600" cy="900" r="730" fill="none" stroke="rgba(255, 228, 225, 0.20)" strokeWidth="14" className="md:opacity-100" style={{ filter: 'blur(10px)', opacity: 'inherit' }} />
            <circle cx="600" cy="900" r="700" fill="none" stroke="rgba(255, 218, 185, 0.20)" strokeWidth="14" className="md:opacity-100" style={{ filter: 'blur(10px)', opacity: 'inherit' }} />
            <circle cx="600" cy="900" r="670" fill="none" stroke="rgba(255, 182, 193, 0.18)" strokeWidth="14" className="md:opacity-100" style={{ filter: 'blur(10px)', opacity: 'inherit' }} />
          </g>
        </svg>
      </div>
      )}
      <style jsx>{`
        @media (max-width: 767px) {
          .rainbow-animated {
            opacity: 0.08 !important;
          }
          .rainbow-animated svg {
            opacity: 0.12 !important;
          }
          .rainbow-animated svg circle {
            opacity: 0.12 !important;
          }
        }
      `}</style>
      {/* Overlay para detectar hover - usa eventos en el section pero verifica posición */}

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6" style={{ backgroundColor: 'transparent' }}>
        {/* Grid con texto a un lado y fotos al otro */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Columna izquierda - Texto */}
          <div className="relative pl-4 sm:pl-8 md:pl-12">
            {/* Corchete decorativo a la izquierda */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-600/50 to-transparent"></div>
            
            {/* Destello neón pequeño detrás del texto */}
            <div className="absolute top-20 left-8 md:left-12 w-64 h-64 bg-gradient-to-br from-cyan-400/15 via-purple-400/10 to-pink-400/15 rounded-full blur-3xl" style={{ zIndex: 2 }}></div>
            <div className="absolute bottom-20 right-4 w-48 h-48 bg-gradient-to-tl from-emerald-400/12 via-cyan-400/8 to-transparent rounded-full blur-2xl" style={{ zIndex: 2 }}></div>
            
            <div className="mb-4 sm:mb-5">
              <p className="text-gray-200 text-sm sm:text-sm md:text-base leading-relaxed font-semibold">
                <span className="font-bold"><span className="text-lg sm:text-xl md:text-2xl">BKS Music</span></span> es una casa creativa con base en Madrid y presencia en el mercado musical español y latino.
              </p>
            </div>

            <div className="mb-4 sm:mb-5">
              <p className="text-gray-200 text-sm sm:text-xs md:text-sm leading-relaxed font-normal">
                Vivimos entre el <span className="text-fuchsia-400 font-semibold">pop</span>, <span className="text-cyan-300 font-semibold">pop-rock</span>, la <span className="text-orange-400 font-semibold">electrónica</span> y lo <span className="text-lime-300 font-semibold">urbano</span>, creando canciones con visión global y sonido <span className="text-white">radio ready</span>.
              </p>
            </div>

            {/* Secciones sin cuadros */}
            <div className="space-y-4" ref={servicesRef}>
              <div
                ref={(el) => {
                  sectionRefs.current[0] = el;
                }}
                className={`transition-all duration-[3500ms] ease-in-out ${
                  servicesVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <p className="hidden md:block text-gray-300 text-sm font-semibold mb-2">Áreas de trabajo</p>
              </div>

              <div
                ref={(el) => {
                  sectionRefs.current[1] = el;
                }}
                className={`transition-all duration-[3500ms] ease-in-out ${
                  servicesVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <p className="text-gray-400 text-sm leading-relaxed font-normal">
                  <span className="font-semibold text-pink-400">· Creación</span><br />
                  Unimos composición, producción y dirección creativa. Desarrollamos repertorio junto a artistas y sellos con los que compartimos criterio y ganas. Cuidamos el proceso y el resultado, con comunicación rápida y directa.
                </p>
              </div>

              <div
                ref={(el) => {
                  sectionRefs.current[2] = el;
                }}
                className={`transition-all duration-[3500ms] ease-in-out ${
                  servicesVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <p className="text-gray-400 text-sm leading-relaxed font-normal">
                  <span className="font-semibold text-cyan-400">· Catálogo</span><br />
                  Además de la creación a medida, desarrollamos un catálogo propio en constante movimiento con una visión altamente colaborativa y preparado para propuestas entre sellos, editoriales, artistas y management.<br />
                  Nuestro repertorio cuenta con un clearance claro y flexible, lo que permite procesos ágiles y adaptables a cada proyecto, para que cada canción pueda moverse rápido y encontrar su lugar.
                </p>
              </div>

              <div
                ref={(el) => {
                  sectionRefs.current[3] = el;
                }}
                className={`transition-all duration-[3500ms] ease-in-out ${
                  servicesVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <p className="text-gray-400 text-sm leading-relaxed font-normal">
                  <span className="font-semibold text-orange-400">· Desarrollo artístico y talento</span><br />
                  Nada nos gusta más que identificar y apoyar el talento. Dedicamos recursos a mentorizar y acompañar a artistas y compositores/as con los que nos sentimos identificados, ayudándoles a construir repertorio, narrativa y posicionamiento dentro de la industria.
                </p>
              </div>

              <div
                ref={(el) => {
                  sectionRefs.current[4] = el;
                }}
                className={`transition-all duration-[3500ms] ease-in-out mt-6 ${
                  servicesVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <p className="text-gray-400 text-sm leading-relaxed font-normal">
                  Si te apetece conocernos, nos encantará hablar y ver cómo podemos trabajar juntos.
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha - Equipo y Fotos */}
          <div className="flex flex-col items-center mt-8 sm:mt-12 md:mt-16 lg:mt-24">
            <h3 className="text-gray-300 text-sm font-semibold mb-6">Equipo</h3>
            <div className="flex flex-row items-start justify-center gap-4 sm:gap-6 md:gap-8 flex-wrap">
            {TEAM_MEMBERS.map((member, index) => (
              <div key={member.name} className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36" style={{ isolation: "isolate" }}>
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
                  style={{ 
                      width: `${member.glowSize}px`,
                      height: `${member.glowSize}px`,
                      background: "radial-gradient(circle, rgba(100, 100, 100, 0.25) 0%, rgba(80, 80, 80, 0.2) 40%, transparent 70%)",
                      borderRadius: "50%",
                      filter: "blur(60px)",
                      zIndex: 0,
                  }}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveMember(index)}
                    className={`relative w-full h-full rounded-full overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${member.imageClass}`}
                    style={{ zIndex: 1 }}
                    aria-label={`Ampliar foto de ${member.name}`}
                  >
                    <Image
                      src={member.imageSrc}
                      alt={member.imageAlt}
                      fill
                      className="object-cover"
                      style={member.imageStyle}
                      sizes="(max-width: 768px) 120px, 180px"
                    />
                  </button>
              </div>
              <div className="text-center">
                  <div className="text-gray-200 font-normal text-xs mb-1">{member.name}</div>
                  {member.roles.map((role) => (
                    <div key={role} className="text-gray-400 font-normal text-[10px] uppercase tracking-wider">
                      {role}
              </div>
                  ))}
                </div>
              </div>
            ))}
            </div>
          </div>
              </div>
            </div>
            
      {overlayVisible && displayedMember !== null && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-pointer backdrop-blur-sm transition-all duration-500 ${
            isAppearing
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
            className={`relative w-full max-w-xl aspect-square sm:aspect-[4/5] bg-black/70 border border-white/10 rounded-3xl overflow-hidden cursor-auto transform transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
              isAppearing
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
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
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
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
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
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
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

