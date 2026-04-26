"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Flip } from "gsap/dist/Flip";
import ScrollMarquee from "@/components/ScrollMarquee";
import BKSMusicHero from "@/components/BKSMusicHero";
import V3BKSMusicStats from "@/components/v3/V3BKSMusicStats";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip);
}

const stats = [
  { number: 330, suffix: "M+", label: "Streams en Spotify" },
  { number: 6, suffix: "", label: "Discos Platino" },
  { number: 8, suffix: "", label: "Discos Oro" },
  { number: 30, suffix: "+", label: "Radio Charts" },
  { number: 60, suffix: "+", label: "Artistas" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const startAnimation = () => {
      const end = value;
      const duration = Math.min(3000, 1200 + end * 4);
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeOutExpo(progress);
        const current = Math.round(end * eased);
        setDisplayValue(current);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayValue(end);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startAnimation();
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`stat-${value}`);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [value]);

  return (
    <span id={`stat-${value}`} className="text-3xl sm:text-4xl md:text-5xl font-medium text-gray-900 tracking-tight">
      {displayValue}{suffix}
    </span>
  );
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
  onAutoScrollRequest?: (offsetPx: number) => void;
}

export default function V3BKSMusic({ activeHeroBg, version = "v3", onAutoScrollRequest }: BKSMusicProps = {}) {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const [servicesVisible, setServicesVisible] = useState(false);
  const [activeMember, setActiveMember] = useState<number | null>(null);
  const [displayedMember, setDisplayedMember] = useState<number | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAppearing, setIsAppearing] = useState(false);
  const [v3InfoOffset, setV3InfoOffset] = useState(0);

  // Refs for V3 Pinned Background
  const v3SectionRef = useRef<HTMLDivElement>(null);
  const v3ContentRef = useRef<HTMLDivElement>(null);
  const v3CreationBlockRef = useRef<HTMLDivElement>(null);
  const v3BgRef = useRef<HTMLDivElement>(null);
  const onAutoScrollRequestRef = useRef(onAutoScrollRequest);
  const initialSectionTopRef = useRef<number | null>(null);
  const [v3GridOffset, setV3GridOffset] = useState(0);




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

  // Medir posición inicial de la sección (sin transforms) una sola vez.
  useEffect(() => {
    if (version !== "v3") return;
    const measure = () => {
      if (v3SectionRef.current && initialSectionTopRef.current === null) {
        const rect = v3SectionRef.current.getBoundingClientRect();
        initialSectionTopRef.current = rect.top + window.scrollY;
      }
    };
    measure();
    window.addEventListener("load", measure);
    return () => window.removeEventListener("load", measure);
  }, [version]);

  // Movimiento parallax basado en scrollY puro (sin feedback loop).
  useEffect(() => {
    const updateOffsets = () => {
      if (version !== "v3" || initialSectionTopRef.current === null) {
        setV3InfoOffset(0);
        setV3GridOffset(0);
        return;
      }

      // Cuánto ha scrolleado el usuario desde que la sección ya está bien visible.
      // Esto retrasa el inicio para evitar efecto de plegado agresivo.
      const triggerScrollY = initialSectionTopRef.current - window.innerHeight * 0.35;
      const scrollPast = Math.max(0, window.scrollY - triggerScrollY);

      // BKSMusicHero: sin transform, posición natural.
      setV3InfoOffset(0);
      // Grid: seguimiento muy sutil para mantener cohesión visual sin plegado.
      setV3GridOffset(scrollPast * 0.07);
    };

    window.addEventListener("scroll", updateOffsets, { passive: true });
    window.addEventListener("resize", updateOffsets);
    updateOffsets();

    return () => {
      window.removeEventListener("scroll", updateOffsets);
      window.removeEventListener("resize", updateOffsets);
    };
  }, [version]);


  // Keep callback ref always current without re-running the scroll effect.
  useEffect(() => { onAutoScrollRequestRef.current = onAutoScrollRequest; }, [onAutoScrollRequest]);

  // Auto-scroll autónomo desactivado: el único scroll programático en v3
  // es el que se dispara tras la flecha del hero al inicio de la web.

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

  // Versión 1: Diseño original (grid 2 columnas)
  const renderVersion1 = () => (
    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6" style={{ backgroundColor: 'transparent' }}>
      <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
        {/* Columna izquierda - Texto */}
        <div className="relative pl-4 sm:pl-8 md:pl-12">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-600/50 to-transparent"></div>

          <div className="absolute top-20 left-8 md:left-12 w-64 h-64 bg-gradient-to-br from-cyan-400/15 via-purple-400/10 to-pink-400/15 rounded-full blur-3xl" style={{ zIndex: 2 }}></div>
          <div className="absolute bottom-20 right-4 w-48 h-48 bg-gradient-to-tl from-emerald-400/12 via-cyan-400/8 to-transparent rounded-full blur-2xl" style={{ zIndex: 2 }}></div>

          <div className="mb-4 sm:mb-5 reveal-text">
            <p className="text-gray-200 text-sm sm:text-sm md:text-base leading-relaxed font-semibold">
              <span className="font-bold"><span className="text-lg sm:text-xl md:text-2xl">BKS Music</span></span> es una casa creativa con base en Madrid y presencia en el mercado musical español y latino.
            </p>
          </div>

          <div className="mb-4 sm:mb-5 reveal-text">
            <p className="text-gray-200 text-sm sm:xs md:text-sm leading-relaxed font-normal">
              Vivimos entre el <span className="text-fuchsia-400 font-semibold">pop</span>, <span className="text-cyan-300 font-semibold">rock</span>, la <span className="text-orange-400 font-semibold">electrónica</span> y lo <span className="text-lime-300 font-semibold">urbano, etc.</span>, creando canciones con visión global y sonido <span className="text-white">radio ready</span>.
            </p>
          </div>

          <div className="space-y-4" ref={servicesRef}>
            <div
              ref={(el) => { sectionRefs.current[0] = el; }}
              className={`transition-all duration-[3500ms] ease-in-out ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              <p className="hidden md:block text-gray-300 text-sm font-semibold mb-2">Áreas de trabajo</p>
            </div>

            <div
              ref={(el) => { sectionRefs.current[1] = el; }}
              className={`transition-all duration-[3000ms] ease-in-out reveal-text ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              <p className="text-gray-400 text-sm leading-relaxed font-normal">
                <span className="font-semibold text-pink-400">· Creación</span><br />
                Songwriting, producción y dirección creativa. Desarrollamos repertorio junto a artistas y sellos con los que compartimos criterio y ganas. Cuidamos el proceso y el resultado, con comunicación rápida y directa.
              </p>
            </div>

            <div
              ref={(el) => { sectionRefs.current[2] = el; }}
              className={`transition-all duration-[3000ms] ease-in-out reveal-text ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              <p className="text-gray-400 text-sm leading-relaxed font-normal">
                <span className="font-semibold text-cyan-400">· Catálogo</span><br />
                Además de la creación a medida, desarrollamos un <span className="text-cyan-300/70 font-semibold">catálogo propio</span> en constante movimiento con una visión altamente colaborativa y preparado para propuestas entre sellos, editoriales, artistas y management.<br />
                Nuestro repertorio cuenta con un <span className="text-cyan-300/70 font-semibold">clearance claro</span> y flexible, lo que permite procesos ágiles y adaptables a cada proyecto, para que cada canción pueda moverse rápido y encontrar su lugar.
              </p>
            </div>

            <div
              ref={(el) => { sectionRefs.current[3] = el; }}
              className={`transition-all duration-[3000ms] ease-in-out reveal-text ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              <p className="text-gray-400 text-sm leading-relaxed font-normal">
                <span className="font-semibold text-orange-400">· Desarrollo artístico y talento</span><br />
                Desarrollo de Talento. Nada nos gusta más que identificar y apoyar el talento. Dedicamos recursos a mentorizar y <span className="text-orange-300/70 font-semibold">acompañar a artistas y compositores/as</span> con los que nos sentimos identificados, ayudándoles a construir repertorio, narrativa y posicionamiento dentro de la industria.
              </p>
            </div>

            <div
              ref={(el) => { sectionRefs.current[4] = el; }}
              className={`transition-all duration-[3500ms] ease-in-out mt-6 ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              <p className="text-gray-400 text-sm leading-relaxed font-normal">
                Si te apetece conocernos, nos encantará hablar y ver cómo podemos{' '}
                <a
                  href="#contact"
                  className="text-lime-300/80 hover:text-lime-300 transition-colors duration-300 cursor-pointer no-underline font-semibold"
                >
                  trabajar juntos
                </a>.
              </p>
            </div>
          </div>
        </div>

        {/* Columna derecha - Equipo */}
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
                  <div className="text-gray-200 font-normal text-[11px] mb-1">{member.name}</div>
                  {member.roles.map((role) => (
                    <div key={role} className="text-gray-400 font-normal text-[9px] uppercase tracking-wider">
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
  );


  // Versión 2: Copia de v3 - Diseño minimalista vertical
  const renderVersion2 = () => (
    <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-12 md:mb-16 reveal-text">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
          BKS Music
        </h2>
        <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed mb-6">
          Una casa creativa con base en Madrid y presencia en el mercado musical español y latino.
        </p>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Vivimos entre el <span className="text-fuchsia-400 font-semibold">pop</span>, <span className="text-cyan-300 font-semibold">rock</span>, la <span className="text-orange-400 font-semibold">electrónica</span> y lo <span className="text-lime-300 font-semibold">urbano, etc.</span>, creando canciones con visión global y sonido <span className="text-white">radio ready</span>.
        </p>
      </div>

      {/* Áreas de trabajo - vertical */}
      <div className="space-y-8 mb-16" ref={servicesRef}>
        <div
          ref={(el) => { sectionRefs.current[0] = el; }}
          className={`transition-all duration-[3000ms] ease-in-out reveal-text ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <h3 className="text-pink-400 font-bold text-xl mb-3">Creación</h3>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Songwriting, producción y dirección creativa. Desarrollamos repertorio junto a artistas y sellos con los que compartimos criterio and ganas. Cuidamos el proceso y el resultado, con comunicación rápida y directa.
          </p>
        </div>

        <div
          ref={(el) => { sectionRefs.current[1] = el; }}
          className={`transition-all duration-[3000ms] ease-in-out reveal-text ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <h3 className="text-cyan-400 font-bold text-xl mb-3">Catálogo</h3>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Además de la creación a medida, desarrollamos un <span className="text-cyan-300/70 font-semibold">catálogo propio</span> en constante movimiento con una visión altamente colaborativa y preparado para propuestas entre sellos, editoriales, artistas y management. Nuestro repertorio cuenta con un <span className="text-cyan-300/70 font-semibold">clearance claro</span> y flexible, lo que permite procesos ágiles y adaptables a cada proyecto, para que cada canción pueda moverse rápido y encontrar su lugar.
          </p>
        </div>

        <div
          ref={(el) => { sectionRefs.current[2] = el; }}
          className={`transition-all duration-[3000ms] ease-in-out reveal-text ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <h3 className="text-orange-400 font-bold text-xl mb-3">Desarrollo artístico y talento</h3>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Desarrollo de Talento. Nada nos gusta más que identificar y apoyar el talento. Dedicamos recursos a mentorizar y <span className="text-orange-300/70 font-semibold">acompañar a artistas y compositores/as</span> con los que nos sentimos identificados, ayudándoles a construir repertorio, narrativa y posicionamiento dentro de la industria.
          </p>
        </div>
      </div>

      {/* Equipo */}
      <div className="mb-12">
        <h3 className="text-gray-300 text-xl font-semibold mb-8">Equipo</h3>
        <div className="grid grid-cols-3 gap-6 sm:gap-8">
          {TEAM_MEMBERS.map((member, index) => (
            <div key={member.name} className="flex flex-col items-center gap-3">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32" style={{ isolation: "isolate" }}>
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
                    sizes="(max-width: 768px) 112px, 128px"
                  />
                </button>
              </div>
              <div className="text-center">
                <div className="text-gray-200 font-semibold text-[11px] mb-1">{member.name}</div>
                {member.roles.map((role) => (
                  <div key={role} className="text-gray-400 font-normal text-[9px] uppercase tracking-wider">
                    {role}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8 border-t border-white/10">
        <p className="text-gray-400 text-sm sm:text-base">
          Si te apetece conocernos, nos encantará hablar y ver cómo podemos{' '}
          <a
            href="#contact"
            className="text-lime-300/80 hover:text-lime-300 transition-colors duration-300 cursor-pointer no-underline font-semibold"
          >
            trabajar juntos
          </a>.
        </p>
      </div>
    </div>
  );


  // Versión 3: Completamente en blanco (REDISEÑADA: BLOQUE INFORMATIVO UNIFICADO)
  const renderVersion3 = () => {
    return (
      <div ref={v3SectionRef} className="relative z-20 w-full bg-black px-4 sm:px-6 pb-0">
        {/* BKSMusicHero en posición natural, sin transform */}
        <BKSMusicHero />

        {/* Grid Creación/Catálogo/Talento — sigue más rápido */}
        <div
          className="w-full relative z-30 pt-16 md:pt-24 pb-4 md:pb-6"
          style={{
            transform: `translate3d(0, -${v3GridOffset}px, 0)`,
            transition: "none",
            willChange: "transform",
          }}
        >
          <div ref={v3ContentRef} className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 lg:gap-16">

              {/* 01. Creación */}
              <div ref={v3CreationBlockRef} className="flex flex-col gap-6">
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
          <V3BKSMusicStats />

          <div className="max-w-5xl mx-auto pb-0 mt-12 relative" style={{ zIndex: 100200 }}>
            <div className="mt-3 pt-2 flex flex-col items-center text-center relative" style={{ zIndex: 100201 }}>
              <h3
                className="text-xl md:text-2xl font-black uppercase tracking-[0.4em] mb-8 text-white"
                style={{
                  fontFamily: "'Europa Grotesk No 2 SH', sans-serif",
                  textShadow: "0 0 12px rgba(255,255,255,0.22)",
                }}
              >
                ¿Te apetece conocernos?
              </h3>
              <p className="text-base md:text-lg text-white/75 max-w-2xl leading-relaxed font-bold uppercase tracking-wider">
                Nos encantará hablar y ver cómo podemos trabajar&nbsp;juntos.
              </p>
            </div>
          </div>

          <div className="mt-20">
            <Contact aboutUsVersion="v3" />
          </div>

          <div className="mt-5">
            <Footer aboutUsVersion="v3" />
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
