"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const companyLogos = [
  "/68f66a06e7239ae98c8f36d1_warner-chappell-music-inc-logo white.png",
  "/68f66b8d03ca72fdeced9ab0_pngfind.com-sony-logo-png-1211975.png",
  "/68f66321174fa3b870a1c008_Universal Music Logo White.png",
  "/68f66a5674e5fb221370c297_sony-music-publishing-logo.webp",
  "/68f66356e9f1630e92f99943_WMG_BIG.D.svg",
  "/68f6671e26206e3362c351d0_peer-music-logo.png",
  "/68f66c0eba18d76f93d93420_atresmedia logo.png",
  "/68f663cc69c0ce2cd1863f1d_TL5.MC_BIG.D.svg",
  "/68f666e27a2ffc0d86a44292_image_2025-10-20_184417679.png", // Ultramusic
  "/Logo movistar plus.png", // Movistar Plus
];

// HERO OPTIONS - Guardado para referencia futura
// Hero4 está guardado pero oculto. Para reactivarlo, cambiar activeBgId a "hero4" y mostrar el selector
const HERO_OPTIONS = [
  { id: "hero1", label: "1", hasVideo: true, hasLogo: true },
  // Hero4 guardado para referencia futura
  // { id: "hero4", label: "4", hasVideo: false, hasLogo: true, imageSrc: "/hero-options/hero-4.png" },
];

interface HeroProps {
  onActiveBgChange?: (bgId: string) => void;
  currentHeroId?: string;
  pageVersion?: string;
  videoWallVisible?: boolean;
  hideBackground?: boolean;
  onScrollCueRequest?: (offsetPx: number) => void;
  onScrollCueGentleRequest?: () => void;
}

export default function V3Hero({ onActiveBgChange, currentHeroId, pageVersion, videoWallVisible, hideBackground, onScrollCueRequest, onScrollCueGentleRequest }: HeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // GSAP Refs
  const heroRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null); // This ref is not used in the provided JSX, but kept as per instruction.
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const heroBgVideoRef = useRef<HTMLVideoElement>(null);
  const creationRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(true);
  // Los logos sociales EMPIEZAN OCULTOS - CRÍTICO: false desde el inicio
  const [logoVisible, setLogoVisible] = useState(false);
  const [iconsAnimationReady, setIconsAnimationReady] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [autoGlowActive, setAutoGlowActive] = useState(false);
  const [hoverDisabled, setHoverDisabled] = useState(false);
  const autoGlowPlayedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollCueVisible, setScrollCueVisible] = useState(false);
  const [scrollCueFaded, setScrollCueFaded] = useState(false);
  const [initialHeroSet, setInitialHeroSet] = useState(false);
  const [heroImageShifted, setHeroImageShifted] = useState(false);
  // Usar el heroId pasado como prop o hero1 por defecto
  const [activeBgId, setActiveBgId] = useState<string>(currentHeroId || "hero1");

  // Actualizar cuando cambie el prop
  useEffect(() => {
    if (currentHeroId && currentHeroId !== activeBgId) {
      setActiveBgId(currentHeroId);
      setLogoBKSVisible(false);
      setOverlayTextVisible(false);
      setLogoVisible(false);
      setTimeout(() => {
        const hero = HERO_OPTIONS.find((h) => h.id === currentHeroId);
        if (hero?.hasLogo) {
          setTimeout(() => setLogoBKSVisible(true), 500);
          setTimeout(() => setOverlayTextVisible(true), 2500);
          // Los logos sociales NO se activan aquí - SOLO cuando videoWallVisible sea true
          // Para hero1, los logos sociales se controlan exclusivamente por videoWallVisible
        } else {
          // Solo para otros heroes (no hero1), activar después de 400ms
          if (currentHeroId !== "hero1") {
            setTimeout(() => setLogoVisible(true), 400);
          }
        }
      }, 100);
    }
  }, [currentHeroId, activeBgId]);

  // Efecto de videoWallVisible para iconos eliminado - inician visibles


  // Estados para controlar las animaciones secuenciales
  const [logoBKSVisible, setLogoBKSVisible] = useState(true);
  const [overlayTextVisible, setOverlayTextVisible] = useState(false);

  // Establecer hero inicial - siempre hero1
  useEffect(() => {
    if (typeof window !== 'undefined' && !initialHeroSet) {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setInitialHeroSet(true);
      // Notificar hero1
      if (onActiveBgChange) {
        onActiveBgChange("hero1");
      }
    }
  }, [initialHeroSet, onActiveBgChange]);

  // Efectos de secuencia de animación eliminados
  useEffect(() => {
    // Detectar móvil
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [initialHeroSet]);

  // Scroll opacity for text
  const [textOpacity, setTextOpacity] = useState(1);
  // entranceLoaded removed

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Start fading after 100px, finish at 800px (range 700px)
      const startFade = 100;
      const fadeRange = 300;
      const newOpacity = Math.max(0, Math.min(1, 1 - (scrollPosition - startFade) / fadeRange));
      setTextOpacity(newOpacity);

      // Update opacity for bottom text via GSAP if needed, or rely on state + style opacity
      // Since we use state for opacity in style, it will work fine.
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // CSS-based Entrance Animation
  const [entranceLoaded, setEntranceLoaded] = useState(!hideBackground);
  const [footerTextVisible, setFooterTextVisible] = useState(!hideBackground);

  useEffect(() => {
    if (hideBackground) {
      // 1. Textos principales (BKS MUSIC CREATION TEAM) - Primero
      const timer1 = setTimeout(() => {
        setEntranceLoaded(true);
      }, 200);

      // 4. Texto inferior (Songwriting...) - Último (después del videowall)
      const timer2 = setTimeout(() => {
        setFooterTextVisible(true);
      }, 2000); // 2s delay.

      // 5. Logos de compañías - Animación en desorden
      const timer3 = setTimeout(() => {
        setLogoVisible(true);
        setIconsAnimationReady(true);
      }, 1700); 

      // 6. Texto Trusted By
      const timer4 = setTimeout(() => {
        setOverlayTextVisible(true);
      }, 1700);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    } else {
      setEntranceLoaded(true);
      setFooterTextVisible(true);
      setLogoVisible(true);
      setIconsAnimationReady(true);
      setOverlayTextVisible(true);
    }
  }, [hideBackground]);
  useEffect(() => {
    if (onActiveBgChange) {
      onActiveBgChange(activeBgId);
    }
  }, [activeBgId, onActiveBgChange]);

  // Auto-glow once when company logos appear, then permanently disable manual hover.
  useEffect(() => {
    if (!logoVisible || autoGlowPlayedRef.current) return;
    autoGlowPlayedRef.current = true;

    setAutoGlowActive(true);
    const offTimer = window.setTimeout(() => {
      setAutoGlowActive(false);
      setLogoHovered(false);
      setHoverDisabled(true);
    }, 1000);

    return () => window.clearTimeout(offTimer);
  }, [logoVisible]);

  useEffect(() => {
    const applySlowRate = () => {
      const video = heroBgVideoRef.current;
      if (!video) return;
      if (video.defaultPlaybackRate !== 0.5) video.defaultPlaybackRate = 0.5;
      if (video.playbackRate !== 0.5) video.playbackRate = 0.5;
    };

    applySlowRate();
    const intervalId = window.setInterval(applySlowRate, 250);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (pageVersion !== "v3") return;

    // Flecha aparece a los 2s
    // Transición sube: 0.9s → settled at 2.9s
    // Bounce empieza sin delay → dura 2.2s → termina a ~5.1s
    // Auto-scroll arranca a los 5.2s
    const showTimer = window.setTimeout(() => {
      setScrollCueVisible(true);
    }, 1600);

    const scrollTimer = window.setTimeout(() => {
      if (onScrollCueGentleRequest) {
        onScrollCueGentleRequest();
      } else if (onScrollCueRequest) {
        onScrollCueRequest(120);
      } else {
        window.scrollBy({ top: 120, behavior: "smooth" });
      }
    }, 5200);

    const handleUserScroll = () => {
      if (window.scrollY > 10) setScrollCueFaded(true);
    };
    window.addEventListener('scroll', handleUserScroll, { passive: true });

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(scrollTimer);
      window.removeEventListener('scroll', handleUserScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageVersion]);

  // Rotación eliminada: dejamos un único logo limpio en móvil

  useEffect(() => {
    const adjustSubtitleWidth = () => {
      // Solo ajustar en móvil (pantallas menores a md) y solo si los elementos existen
      if (typeof window !== 'undefined' && window.innerWidth < 768 && titleRef.current && subtitleRef.current) {
        const titleWidth = titleRef.current.offsetWidth;
        const subtitleWidth = subtitleRef.current.scrollWidth;

        // Usar maxWidth para limitar el ancho
        subtitleRef.current.style.maxWidth = `${titleWidth}px`;

        // Si el texto sigue siendo más ancho, escalarlo
        if (subtitleWidth > titleWidth) {
          const scale = titleWidth / subtitleWidth;
          subtitleRef.current.style.transform = `scaleX(${scale})`;
          subtitleRef.current.style.transformOrigin = 'center';
        } else {
          subtitleRef.current.style.transform = '';
        }
      } else if (subtitleRef.current) {
        // En desktop, quitar todos los estilos inline
        subtitleRef.current.style.maxWidth = '';
        subtitleRef.current.style.transform = '';
      }
    };

    // Ejecutar después de que el DOM esté listo
    if (typeof window !== 'undefined') {
      const timeoutId = setTimeout(adjustSubtitleWidth, 100);
      adjustSubtitleWidth();
      window.addEventListener('resize', adjustSubtitleWidth);
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', adjustSubtitleWidth);
      };
    }
  }, [isVisible]);

  // Usar el hero activo seleccionado
  const validActiveBgId = activeBgId;
  const currentHero = HERO_OPTIONS.find((hero) => hero.id === validActiveBgId) ?? HERO_OPTIONS[0];
  const isGeminiMobile = false;
  const heroTitleFontFamily =
    pageVersion === "v2"
      ? "'Europa Grotesk SH', 'Europa Grotesk No 2 SH', sans-serif"
      : "'Gefika', sans-serif";
  const heroTitleFontWeight = pageVersion === "v2" ? 700 : 400;
  const isHeroV1V2V3 = pageVersion === "v1" || pageVersion === "v2" || pageVersion === "v3";
  const isV2OrV3 = pageVersion === "v2" || pageVersion === "v3";

  return (
    <>
      <section ref={heroRef} id="home" data-gemini-active={isGeminiMobile ? "true" : "false"} className={`relative ${isGeminiMobile ? "pt-0 overflow-visible" : "min-h-[100vh] flex items-center justify-center overflow-hidden pt-24 md:pt-0"}`} style={isGeminiMobile ? { width: '100vw', margin: '0', padding: '0', left: '0', right: '0', maxWidth: '100vw', position: 'relative', overflow: 'visible', height: '190vh', minHeight: '190vh' } : {}}>
        {/* Header negro con transparencia - solo para Gemini cuando aparecen los iconos */}
        {isGeminiMobile && heroImageShifted && (
          <div
            className="fixed top-0 left-0 right-0 md:hidden transition-opacity duration-1000 ease-out"
            style={{
              height: '35px',
              background: 'rgba(0, 0, 0, 0.8)',
              zIndex: 25,
              pointerEvents: 'none',
              opacity: 0,
              animation: 'fadeInHeader 1s ease-out 3s forwards'
            }}
          />
        )}
        {/* SVG Logo para v2 y v3 - FUERA del contenedor con overflow-hidden */}
        {isHeroV1V2V3 && (
          <div
            style={{
              position: 'fixed',
              top: pageVersion === "v3"
                ? '-6%'
                : isV2OrV3
                  ? (hideBackground ? '28.4%' : '25.4%')
                  : (hideBackground ? '25%' : '22%'),
              left: '50%',
              transform: pageVersion === "v3"
                ? 'translateX(-50%)'
                : 'translate(calc(-50% + 1.89px), calc(-50% - 7px)) translateX(3px)',
              zIndex: 99999,
              pointerEvents: 'none',
              width: '1629px',
              maxWidth: '100vw',
              height: '816px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none' // Desactivar eventos en el contenedor base
              }}
            >
              <div
                className="relative w-full h-auto flex items-center justify-center"
                onMouseEnter={() => {
                  if (!hoverDisabled) setLogoHovered(true);
                }}
                onMouseLeave={() => {
                  if (!hoverDisabled) setLogoHovered(false);
                }}
                ref={logoWrapperRef}
                style={{
                  height: pageVersion === "v3" ? '100%' : '55%',
                  position: pageVersion === "v3" ? 'absolute' : 'relative',
                  top: pageVersion === "v3" ? 0 : undefined,
                  left: pageVersion === "v3" ? 0 : undefined,
                  width: pageVersion === "v3" ? '100%' : undefined,
                  pointerEvents: 'auto',
                  opacity: entranceLoaded ? 1 : 0,
                  transform: 'none',
                  transition: 'opacity 1.5s ease-out' // Simple fade in
                }} // Área de hover aumentada para que suceda antes
              >
                <div
                  style={{
                    width: pageVersion === "v3" ? '100%' : '70%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    paddingLeft: pageVersion === "v3" ? '4.5%' : '2%',
                    pointerEvents: 'auto',
                  }}
                >
                  {/* Bloque unificado del logo principal (v3): título + subtítulo escalan juntos */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginTop: pageVersion === "v3" ? "0vh" : "0",
                      transform: pageVersion === "v3" ? "translateX(-1.8vw) scale(0.92)" : "none",
                      transformOrigin: pageVersion === "v3" ? "left top" : "center",
                    }}
                  >
                    <h1
                      style={{
                        margin: 0,
                        marginLeft: pageVersion === "v3" ? '0' : isV2OrV3 ? '-214px' : '-180px',
                        marginTop: pageVersion === "v3" ? '0' : isV2OrV3 ? '80px' : '24px',
                        color: isV2OrV3 ? '#ffffff' : '#895252',
                        textTransform: 'uppercase',
                        textAlign: 'left',
                        lineHeight: 0.82,
                        letterSpacing: pageVersion === "v2" ? '0.02em' : '-0.015em',
                        fontWeight: heroTitleFontWeight,
                        fontFamily: heroTitleFontFamily,
                        fontSize: pageVersion === "v2"
                          ? 'clamp(6rem, 11.7vw, 11.8rem)'
                          : pageVersion === "v3"
                            ? 'clamp(6.9rem, 13.3vw, 13.5rem)'
                            : 'clamp(5.8rem, 11.4vw, 11.4rem)',
                        transition: 'filter 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: 'scaleY(0.94)',
                        transformOrigin: 'center',
                        WebkitTextStroke: pageVersion === "v1" ? '1.9px currentColor' : '1.3px currentColor',
                        textShadow: pageVersion === "v3" ? `
                          0.8px 0 0 currentColor,
                          -0.8px 0 0 currentColor,
                          0 0.8px 0 currentColor,
                          0 -0.8px 0 currentColor
                        ` : `
                          ${pageVersion === "v1" ? '1.2px' : '0.8px'} 0 0 currentColor,
                          -${pageVersion === "v1" ? '1.2px' : '0.8px'} 0 0 currentColor,
                          0 ${pageVersion === "v1" ? '1.2px' : '0.8px'} 0 currentColor,
                          0 -${pageVersion === "v1" ? '1.2px' : '0.8px'} 0 currentColor
                        `,
                        textRendering: 'geometricPrecision',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        filter: hideBackground
                          ? ((autoGlowActive || logoHovered)
                              ? 'drop-shadow(0px 0px 22px rgba(243, 245, 38, 0.6))'
                              : 'none')
                          : ((autoGlowActive || logoHovered)
                              ? 'drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.40))'
                              : 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.18))'),
                      }}
                    >
                      <span style={{ display: 'block' }}>BKS</span>
                      <span style={{ display: 'block' }}>
                        MUSI
                        <span
                          style={
                            pageVersion !== "v2"
                              ? {
                                  fontFamily: "'Europa Grotesk SH', 'Europa Grotesk No 2 SH', sans-serif",
                                  fontWeight: 700,
                                  display: "inline-block",
                                  marginLeft: "4px",
                                  fontSize: "calc(100% + 5px)",
                                  transform: "translateX(0.5px) translateY(-1px) scaleX(1.06)",
                                }
                              : undefined
                          }
                        >
                          C
                        </span>
                      </span>
                    </h1>
                    {pageVersion === "v3" && isHeroV1V2V3 && (
                      <div
                        style={{
                          marginTop: 'clamp(0.1rem, 0.45vw, 0.35rem)',
                          fontFamily: "'Europa Grotesk No 2 SH', sans-serif",
                          fontSize: 'clamp(1.42rem, 1.95vw, 1.92rem)',
                          fontWeight: 600,
                          lineHeight: 1.22,
                          letterSpacing: '0.015em',
                          color: '#ffffff',
                          textTransform: 'uppercase',
                          textAlign: 'left',
                          width: 'min(58vw, 760px)',
                          opacity: entranceLoaded ? textOpacity : 0,
                          transition: 'opacity 0.8s ease-out',
                          transform: 'translateY(-16px)',
                        }}
                      >
                        <div>Songwriting Production Publishing</div>
                        <div>Talent Development</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {isHeroV1V2V3 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: pageVersion === "v3" ? '28%' : isV2OrV3 ? '20%' : '24%',
                    left: pageVersion === "v3" ? 'calc(50% - min(26vw, 285px))' : isV2OrV3 ? '4.4%' : '4.4%',
                    transform: 'none',
                    fontFamily: "'Europa Grotesk No 2 SH', sans-serif",
                    fontSize: isV2OrV3
                      ? 'clamp(1.2rem, 1.56vw, 1.5rem)'
                      : 'clamp(0.82rem, 1.04vw, 1rem)',
                    fontWeight: isV2OrV3 ? 600 : 500,
                    lineHeight: 1.22,
                    letterSpacing: '0.015em',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    textAlign: 'left',
                    width: pageVersion === "v3" ? 'min(58vw, 760px)' : undefined,
                    opacity: pageVersion === "v3" ? 0 : (entranceLoaded ? textOpacity : 0),
                    transition: 'opacity 0.8s ease-out'
                  }}
                >
                  <div>Songwriting Production Publishing</div>
                  <div>Talent Development</div>
                </div>
              )}
              {/* Texto CREATION */}
              {false && (pageVersion as string) === "v1" && (
              <div
                ref={creationRef}
                style={{
                  position: 'absolute',
                  bottom: '25%',
                  left: 'calc(2% - 19px)',
                  fontFamily: "'Europa Grotesk No 2 SH', sans-serif",
                  fontSize: 'clamp(2.4rem, 6vw, 5rem)',
                  fontWeight: 800,
                  color: '#f3f526',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  imageRendering: '-webkit-optimize-contrast',
                  mixBlendMode: 'normal',
                  textShadow: `
                  1px 0 0 #f3f526,
                  -1px 0 0 #f3f526,
                  0 -1px 0 #f3f526
                `,
                  opacity: entranceLoaded ? 1 : 0,
                  transform: 'none',
                  transition: 'opacity 1.5s ease-out'
                }}
              >
                CREATION
              </div>
              )}
              {/* Texto TEAM */}
              {false && (pageVersion as string) === "v1" && (
              <div
                ref={teamRef}
                style={{
                  position: 'absolute',
                  bottom: '25%',
                  right: '2%',
                  fontFamily: "'Europa Grotesk No 2 SH', sans-serif",
                  fontSize: 'clamp(2.4rem, 6vw, 5rem)',
                  fontWeight: 800,
                  color: '#f3f526',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  imageRendering: '-webkit-optimize-contrast',
                  mixBlendMode: 'normal',
                  textShadow: `
                  1px 0 0 #f3f526,
                  -1px 0 0 #f3f526,
                  0 -1px 0 #f3f526
                `,
                  opacity: entranceLoaded ? 1 : 0,
                  transform: 'none',
                  transition: 'opacity 1.5s ease-out'
                }}
              >
                TEAM
              </div>
              )}
              {/* Contador año debajo de TEAM */}
              {false && (pageVersion as string) === "v1" && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '26.5%',
                  right: '2%',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#f3f526',
                  letterSpacing: '0.05em',
                  opacity: entranceLoaded ? 1 : 0,
                  transition: 'opacity 1.5s ease-out'
                }}
              >
                {new Date().getFullYear()}
              </div>
              )}
              {/* Texto SONGWRITING PRODUCTION / PUBLISHING TALENT DEVELOPMENT */}
              {false && (pageVersion as string) === "v1" && (
              <div
                ref={bottomTextRef}
                className="cursor-default"
                style={{
                  position: 'absolute',
                  bottom: '5%',
                  left: '50%',
                  transform: `translateX(calc(-50% - 13px)) ${footerTextVisible ? 'translateY(0)' : 'translateY(40px)'}`,
                  fontFamily: "'Gobold', sans-serif",
                  fontSize: 'clamp(1.2rem, 2.9vw, 1.95rem)',
                  fontWeight: 700,
                  color: '#f3f526',
                  textTransform: 'none',
                  letterSpacing: '0.05em',
                  opacity: footerTextVisible ? textOpacity : 0,
                  imageRendering: '-webkit-optimize-contrast',
                  mixBlendMode: 'normal',
                  textAlign: 'center',
                  lineHeight: 1.15,
                  WebkitTextStroke: '0px transparent',
                  filter: logoHovered
                    ? 'brightness(1.04) contrast(1.01) drop-shadow(0px 0px 7px rgba(243, 245, 38, 0.22))'
                    : `blur(${footerTextVisible ? '0.3px' : '10px'}) contrast(1.0) brightness(0.99) saturate(1.0)`,
                  transition: `transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.6s, opacity 3s ease-in-out`,
                  textShadow: `
                  0.5px 0 0 #f3f526,
                  -0.5px 0 0 #f3f526,
                  0 0.5px 0 #f3f526,
                  0 -0.5px 0 #f3f526,
                  1px 1px 10px rgba(0, 0, 0, 0.5)
                `
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div>Songwriting Production</div>
                  <div>Publishing Talent Development</div>
                </div>
              </div>
              )}
            </div>
          </div>
        )}
        {/* Background Negro o Imagen según versión */}
        {/* Desktop: fondo negro o imagen de fondo para v2 */}
        <div
          className="absolute z-0 hidden md:flex items-center justify-center bg-black"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: '-1px'
          }}
        >
          {/* Fondo dinámico: Kalenn muy ampliado y difuminado para aportar movimiento sutil */}
          <video
            ref={heroBgVideoRef}
            src="/videos/Carlos Baute Ana Mena - No es para tanto.mov"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={(e) => {
              e.currentTarget.defaultPlaybackRate = 0.5;
              e.currentTarget.playbackRate = 0.5;
            }}
            onLoadedMetadata={(e) => {
              e.currentTarget.defaultPlaybackRate = 0.5;
              e.currentTarget.playbackRate = 0.5;
            }}
            onPlay={(e) => {
              if (e.currentTarget.playbackRate !== 0.5) {
                e.currentTarget.playbackRate = 0.5;
              }
            }}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{
              transform: 'scale(3.4)',
              transformOrigin: 'center center',
              filter: 'blur(0px) brightness(0.58) saturate(0.9) contrast(1.02)',
              opacity: 0.48,
              objectPosition: 'right center',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 22%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 72%)',
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 22%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 72%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.72) 78%, rgba(0,0,0,0.88) 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  rgba(255, 0, 0, 0.12) 0px,
                  rgba(255, 0, 0, 0.12) 1px,
                  rgba(0, 255, 0, 0.10) 1px,
                  rgba(0, 255, 0, 0.10) 2px,
                  rgba(0, 80, 255, 0.12) 2px,
                  rgba(0, 80, 255, 0.12) 3px,
                  transparent 3px,
                  transparent 7px
                ),
                repeating-linear-gradient(
                  0deg,
                  rgba(255, 255, 255, 0.035) 0px,
                  rgba(255, 255, 255, 0.035) 1px,
                  transparent 1px,
                  transparent 5px
                )
              `,
              opacity: 0.28,
              mixBlendMode: 'screen',
            }}
          />

          {/* Imagen fondo desktop "raw" para evitar alteraciones de color */}
          {isHeroV1V2V3 && !hideBackground && (
            <img
              ref={bgImageRef}
              src="/foto-real.png?v=raw"
              alt="Hero Background"
              className="absolute inset-0 w-full h-full object-cover object-bottom"
              style={{
                transform: 'scale(1.0)',
                transformOrigin: 'bottom',
                filter: 'saturate(1.05) contrast(1.05) brightness(0.95)',
                opacity: 1, imageRendering: '-webkit-optimize-contrast',
                mixBlendMode: 'normal'
              }}
            />
          )}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full max-w-[100vw] max-h-[100vh]">
              {/* Título BKS MUSIC para v2 y v3 */}
              {false && isHeroV1V2V3 && (
                <div
                  className="absolute inset-0 z-20 flex items-center justify-center"
                  style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                  }}
                >
                  <h1
                    style={{
                      fontFamily: heroTitleFontFamily,
                      fontSize: 'clamp(6.15rem, 15.375vw, 16.4rem)',
                      fontWeight: heroTitleFontWeight,
                      color: '#f3f526',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.005em',
                      textAlign: 'center',
                      margin: 0,
                      lineHeight: 1.1,
                      transform: 'scaleX(1.1) scaleY(1.0) translateZ(0)',
                      WebkitFontSmoothing: 'none',
                      MozOsxFontSmoothing: 'none',
                      fontSmooth: 'never',
                      textRendering: 'optimizeSpeed',
                      imageRendering: 'crisp-edges',
                      shapeRendering: 'crispEdges',
                      WebkitTextStroke: '0px transparent',
                      backfaceVisibility: 'hidden',
                      willChange: 'transform',
                      WebkitBackfaceVisibility: 'hidden',
                      transformStyle: 'preserve-3d',
                      textShadow: `
                      2.5px 0 0 #f3f526,
                      -2.5px 0 0 #f3f526,
                      0 2.5px 0 #f3f526,
                      0 -2.5px 0 #f3f526,
                      1.5px 1.5px 0 #f3f526,
                      -1.5px -1.5px 0 #f3f526,
                      1.5px -1.5px 0 #f3f526,
                      -1.5px 1.5px 0 #f3f526,
                      1px 1px 0 #f3f526,
                      -1px -1px 0 #f3f526,
                      1px -1px 0 #f3f526,
                      -1px 1px 0 #f3f526
                    `,
                      visibility: 'hidden',
                      opacity: 0,
                      position: 'absolute'
                    }}
                  >
                    BKS MUSIC
                  </h1>
                </div>
              )}
              {currentHero.hasLogo && (
                <>
                  {/* Logo principal BKS Music - oculto en v2 y v3 */}
                  {pageVersion !== "v2" && pageVersion !== "v3" && (
                    <div
                      className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${logoBKSVisible ? 'opacity-100' : 'opacity-0'}`}
                      style={{ transform: 'translateY(-18vh) translateX(-24.5vw)' }}
                    >
                      <div
                        className="cursor-default"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
                        onMouseEnter={() => setLogoHovered(true)}
                        onMouseLeave={() => setLogoHovered(false)}
                      >
                        <div
                          style={{
                            width: '70%',
                            display: 'flex',
                            justifyContent: 'flex-start',
                          }}
                        >
                          <h1
                            style={{
                              margin: 0,
                              color: '#ffffff',
                              textTransform: 'uppercase',
                              textAlign: 'left',
                              lineHeight: 0.85,
                              letterSpacing: '-0.02em',
                              fontWeight: 900,
                              fontFamily: "'Gefika', sans-serif",
                              fontSize: 'clamp(4.2rem, 8vw, 8.2rem)',
                              transition: 'text-shadow 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                              textShadow: logoHovered
                                ? '0 0 20px rgba(255, 255, 255, 0.45)'
                                : 'none',
                            }}
                          >
                            <span style={{ display: 'block' }}>BKS</span>
                            <span style={{ display: 'block' }}>
                              MUSI
                              <span
                                style={
                                  pageVersion !== "v2"
                                    ? {
                                        fontFamily: "'Europa Grotesk SH', 'Europa Grotesk No 2 SH', sans-serif",
                                        fontWeight: 700,
                                        display: "inline-block",
                                        marginLeft: "4px",
                                        fontSize: "calc(100% + 5px)",
                                        transform: "translateX(0.5px) translateY(-1px) scaleX(1.06)",
                                      }
                                    : undefined
                                }
                              >
                                C
                              </span>
                            </span>
                          </h1>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Overlay de texto (songwriting production...) - oculto en v2 y v3 */}
                  {pageVersion !== "v2" && pageVersion !== "v3" && (
                    <div
                      className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${overlayTextVisible ? 'opacity-100' : 'opacity-0'}`}
                      style={{ transform: 'translateY(6vh) translateX(-21.5vw)' }}
                    >
                      <Image
                        src="/hero-h-overlay.png"
                        alt="Hero Overlay"
                        width={800}
                        height={600}
                        className="object-contain"
                        style={{ maxWidth: '44%', height: 'auto', filter: 'brightness(0) invert(1)' }}
                      />
                    </div>
                  )}
                  {/* Texto "TRUSTED BY" - Restaurado */}
                  {false && ((pageVersion as string) === "v1" || pageVersion === "v2" || pageVersion === "v3") && (
                    <div
                      className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${overlayTextVisible ? 'opacity-100' : 'opacity-0'}`}
                      style={{ transform: 'translateY(calc(1.5vh - 20px)) translateX(22vw)' }}
                    >
                      <p
                        className="text-white font-light tracking-wider uppercase"
                        style={{
                          opacity: 0.6,
                          letterSpacing: '-0.005em',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          whiteSpace: 'nowrap',
                          fontSize: '9px'
                        }}
                      >
                        TRUSTED BY
                      </p>
                    </div>
                  )}
                  {/* Logos de compañías - Restaurados */}
                  {pageVersion !== "v3" && ((pageVersion as string) === "v1" || pageVersion === "v2") && (
                    <div
                      className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                      style={{ transform: pageVersion === "v3" ? 'translateY(calc(10vh - 60px)) translateX(22vw)' : 'translateY(calc(10vh - 56px)) translateX(22vw)' }}
                    >
                      <div style={{ maxWidth: '350px', width: '100%' }}>
                        <p
                          className="text-white font-light tracking-wider uppercase"
                          style={{
                            opacity: logoVisible ? 0.6 : 0,
                            letterSpacing: '-0.005em',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            whiteSpace: 'nowrap',
                            fontSize: '9px',
                            margin: '0 0 8px 0',
                            textAlign: 'left',
                            transition: 'opacity 0.9s ease-out'
                          }}
                        >
                          TRUSTED BY
                        </p>
                        <div className="grid grid-cols-5 gap-3">
                        {companyLogos.map((src, idx) => {
                          const isAtresmedia = idx === 6 || src.includes('atresmedia');
                          const isUltraMusic = idx === 8 || src.includes('image_2025-10-20');
                          const isMediaset = idx === 7 || src.includes('TL5') || src.includes('mediaset');
                          const isMovistarPlus = idx === 9 || src.includes('movistar') || src.includes('Movistar');
                          // Mediaset, atresmedia y ultramusic no necesitan filtro brightness(0), solo invert
                          // Movistar Plus sí necesita brightness(0) invert(1) para invertir el color
                          const shouldApplyFilter = !isAtresmedia && !isUltraMusic && !isMediaset;

                          const isWarner = idx === 0 || src.includes('warner');
                          const isWarnerMusicGroup = idx === 4 || src.includes('WMG');
                          const isPeerMusic = idx === 5 || src.includes('peer');
                          const isSonyMusic = idx === 1 || (src.includes('pngfind.com-sony-logo-png') && !src.includes('publishing'));
                          const shouldTranslateXRight = isWarner || isWarnerMusicGroup;
                          const shouldTranslateXRightMore = isAtresmedia;
                          const shouldTranslateXRightEvenMore = isUltraMusic;
                          const shouldTranslateY = isWarnerMusicGroup;

                          let transformValue = 'none';
                          if (isPeerMusic) {
                            transformValue = 'translateX(-1px) translateY(-4.84px)';
                          } else if (isMediaset) {
                            transformValue = 'translateX(29px) translateY(-1.5px)';
                          } else if (isMovistarPlus) {
                            transformValue = 'translateX(47.5px) translateY(5.5px)';
                          } else if (isSonyMusic) {
                            transformValue = 'translateX(-13.5px)';
                          } else if (shouldTranslateXRight && shouldTranslateY) {
                            transformValue = 'translateX(4px) translateY(-2px)';
                          } else if (shouldTranslateXRight) {
                            transformValue = 'translateX(4px)';
                          } else if (shouldTranslateXRightEvenMore) {
                            transformValue = 'translateX(39px) translateY(-2px)';
                          } else if (shouldTranslateXRightMore) {
                            transformValue = 'translateX(0px) translateY(-9px)';
                          }

                          // Tiempos aleatorios y creativos pre-definidos para dar un efecto muy orgánico (twinkling/scattered)
                          // Comprimidos extremadamente para que aparezcan muy juntos
                          const customDelays = [0.05, 0.4, 0.15, 0.65, 0.1, 0.3, 0.5, 0.25, 0.7, 0.35];
                          const customDurations = [0.8, 1.0, 0.6, 1.2, 0.7, 0.8, 1.1, 0.6, 1.3, 0.7];
                          
                          const delayTime = customDelays[idx] !== undefined ? customDelays[idx] : 0;
                          const durationTime = customDurations[idx] !== undefined ? customDurations[idx] : 1.5;

                          return (
                            <div
                              key={idx}
                              className={`relative hero-company-logo-item pointer-events-auto ${isPeerMusic ? 'h-9' : isAtresmedia ? 'h-11' : isMovistarPlus ? 'h-4' : isMediaset ? 'h-6' : isUltraMusic ? 'h-9' : isSonyMusic ? 'h-12' : 'h-9'} ${isPeerMusic ? 'w-20' : isAtresmedia ? 'w-26' : isMovistarPlus ? 'w-8' : isMediaset ? 'w-16' : isUltraMusic ? 'w-20' : isSonyMusic ? 'w-28' : 'w-20'} cursor-pointer`}
                              style={{
                                height: isMediaset ? '28px' : isPeerMusic ? '37.5px' : isUltraMusic ? '27.5px' : isMovistarPlus ? '13px' : isSonyMusic ? '49px !important' : 'auto',
                                width: isMediaset ? '70px' : isPeerMusic ? '83.5px' : isUltraMusic ? '71.5px' : isMovistarPlus ? '31px' : isSonyMusic ? '111px !important' : 'auto',
                                minHeight: isPeerMusic ? '37.5px' : isAtresmedia ? '44px' : isMovistarPlus ? '13px' : isMediaset ? '28px' : isUltraMusic ? '27.5px' : isSonyMusic ? '49px !important' : '36px',
                                minWidth: isPeerMusic ? '83.5px' : isAtresmedia ? '104px' : isMovistarPlus ? '31px' : isMediaset ? '70px' : isUltraMusic ? '71.5px' : isSonyMusic ? '111px !important' : '80px',
                                maxHeight: isMediaset ? '28px' : isPeerMusic ? '37.5px' : isUltraMusic ? '27.5px' : isMovistarPlus ? '13px' : isSonyMusic ? '49px !important' : 'none',
                                maxWidth: isMediaset ? '70px' : isPeerMusic ? '83.5px' : isUltraMusic ? '71.5px' : isMovistarPlus ? '31px' : isSonyMusic ? '111px !important' : 'none',
                                transform: transformValue,
                                opacity: 0,
                                animation: logoVisible ? `customFadeInLogo ${durationTime}s ease-in-out ${delayTime + 0.2}s forwards` : 'none'
                              }}
                            >
                              <Image
                                src={src}
                                alt={`company logo ${idx} - ${isMediaset ? 'mediaset' : ''}`}
                                fill
                                className="object-contain"
                                style={
                                  isMediaset
                                    ? { filter: 'brightness(0) invert(1)', opacity: 0.5, imageRendering: '-webkit-optimize-contrast', transition: 'filter 0.3s ease-in-out, opacity 0.3s ease-in-out' }
                                    : isMovistarPlus
                                      ? { filter: 'brightness(0) invert(1)', opacity: 0.5, transition: 'filter 0.3s ease-in-out, opacity 0.3s ease-in-out' }
                                      : isPeerMusic
                                        ? { filter: 'brightness(0) invert(1)', opacity: 0.5, transition: 'filter 0.3s ease-in-out, opacity 0.3s ease-in-out' }
                                        : shouldApplyFilter
                                          ? { filter: 'brightness(0) invert(1)', opacity: 0.5, transition: 'filter 0.3s ease-in-out, opacity 0.3s ease-in-out' }
                                          : { filter: 'invert(1)', opacity: 0.5, transition: 'filter 0.3s ease-in-out, opacity 0.3s ease-in-out' }
                                }
                                unoptimized={idx === 7 || idx === 9}
                              />
                            </div>
                          );
                        })}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: fondo negro o imagen de fondo para v2 */}
        <div
          className="absolute z-0 md:hidden bg-black flex items-start justify-center"
          style={{
            top: '6rem',
            left: 0,
            right: 0,
            bottom: '-1px'
          }}
        >
          {/* Imagen fondo mobile "raw" */}
          {isHeroV1V2V3 && !hideBackground && (
            <img
              src="/foto-real.png?v=raw"
              alt="Hero Background Mobile"
              className="absolute inset-0 w-full h-full object-cover object-bottom"
              style={{
                transform: 'scale(1.0)',
                transformOrigin: 'bottom',
                filter: 'saturate(1.05) contrast(1.05) brightness(0.95)',
                opacity: 1, imageRendering: '-webkit-optimize-contrast',
                mixBlendMode: 'normal'
              }}
            />
          )}
          <div className="relative w-full h-full flex items-start justify-center">
            <div className="relative w-full h-full max-w-[100vw] max-h-[100vh] flex items-center justify-center">
              {/* Título BKS MUSIC para v2 y v3 mobile */}
              {isHeroV1V2V3 && (
                <div
                  className="absolute inset-0 z-20 flex items-center justify-center"
                  style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    transform: pageVersion === "v3" ? 'translateY(8vh)' : 'none'
                  }}
                >
                  <h1
                    style={{
                      fontFamily: "'Gefika', sans-serif",
                      fontSize: 'clamp(4.1rem, 18.45vw, 10.25rem)',
                      fontWeight: 900,
                      color: '#f3f526',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.005em',
                      textAlign: 'center',
                      margin: 0,
                      lineHeight: 1.1,
                      transform: 'scaleX(1.1) scaleY(1.0) translateZ(0)',
                      WebkitFontSmoothing: 'none',
                      MozOsxFontSmoothing: 'none',
                      fontSmooth: 'never',
                      textRendering: 'optimizeSpeed',
                      imageRendering: 'crisp-edges',
                      shapeRendering: 'crispEdges',
                      WebkitTextStroke: '0px transparent',
                      backfaceVisibility: 'hidden',
                      willChange: 'transform',
                      WebkitBackfaceVisibility: 'hidden',
                      transformStyle: 'preserve-3d',
                      textShadow: `
                        2px 0 0 #f3f526,
                        -2px 0 0 #f3f526,
                        0 2px 0 #f3f526,
                        0 -2px 0 #f3f526,
                        1px 1px 0 #f3f526,
                        -1px -1px 0 #f3f526,
                        1px -1px 0 #f3f526,
                        -1px 1px 0 #f3f526
                      `,
                      visibility: 'hidden',
                      opacity: 0,
                      position: 'absolute'
                    }}
                  >
                    BKS MUSIC
                  </h1>
                </div>
              )}
              {currentHero.hasLogo && (
                <>
                  {/* Logo principal BKS Music mobile - oculto en v2 y v3 */}
                  {pageVersion !== "v2" && pageVersion !== "v3" && (
                    <div
                      className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${logoBKSVisible ? 'opacity-100' : 'opacity-0'}`}
                      style={{ transform: 'translateY(-36vh) translateX(-24.5vw)' }}
                    >
                      <div
                        className="cursor-default"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={() => setLogoHovered(true)}
                        onMouseLeave={() => setLogoHovered(false)}
                      >
                        <Image
                          src="/hero-h-logo.png"
                          alt="Hero Logo"
                          width={400}
                          height={150}
                          className="object-contain"
                          style={{
                            maxWidth: '60%',
                            height: 'auto',
                            filter: `brightness(0) invert(1) brightness(${logoHovered ? 1.06 : 1.0}) drop-shadow(0 0 ${logoHovered ? '12px' : '0px'} rgba(255, 255, 255, ${logoHovered ? 0.35 : 0}))`,
                            transform: 'scale(1)',
                            transition: 'filter 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {/* Overlay de texto mobile (songwriting production...) - oculto en v2 y v3 */}
                  {pageVersion !== "v2" && pageVersion !== "v3" && (
                    <div
                      className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${overlayTextVisible ? 'opacity-100' : 'opacity-0'}`}
                      style={{ transform: 'translateY(-27vh) translateX(-22.5vw)' }}
                    >
                      <Image
                        src="/hero-h-overlay.png"
                        alt="Hero Overlay"
                        width={800}
                        height={600}
                        className="object-contain"
                        style={{ maxWidth: '65%', height: 'auto', filter: 'brightness(0) invert(1)' }}
                      />
                    </div>
                  )}
                  {/* Logos de compañías mobile - Restaurados */}
                  {pageVersion !== "v3" && ((pageVersion as string) === "v1" || pageVersion === "v2") && (
                    <div
                      className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                      style={{ transform: 'translateY(-25vh) translateX(36vw)' }}
                    >
                      <div className="grid grid-cols-2 gap-2" style={{ maxWidth: '140px' }}>
                        {companyLogos.map((src, idx) => {
                          const isAtresmedia = idx === 6 || src.includes('atresmedia');
                          const isUltraMusic = idx === 8 || src.includes('image_2025-10-20');
                          const isMediaset = idx === 7 || src.includes('TL5') || src.includes('mediaset');
                          const isMovistarPlus = idx === 9 || src.includes('movistar') || src.includes('Movistar');
                          const shouldApplyFilter = !isAtresmedia && !isUltraMusic && !isMediaset && !isMovistarPlus;
                          const isWarner = idx === 0 || src.includes('warner');
                          const isWarnerMusicGroup = idx === 4 || src.includes('WMG');
                          const isPeerMusic = idx === 5 || src.includes('peer');
                          const shouldTranslateXRight = isWarner || isWarnerMusicGroup;
                          const shouldTranslateXRightMore = isAtresmedia;
                          const shouldTranslateXRightEvenMore = isUltraMusic;
                          const shouldTranslateY = isWarnerMusicGroup;

                          let transformValue = 'none';
                          if (isPeerMusic) {
                            transformValue = 'translateX(-2px) translateY(-8px)';
                          } else if (isMediaset) {
                            transformValue = 'translateX(29px) translateY(-1.5px)';
                          } else if (isMovistarPlus) {
                            transformValue = 'translateX(47.5px) translateY(5.5px)';
                          } else if (shouldTranslateXRight && shouldTranslateY) {
                            transformValue = 'translateX(4px) translateY(-2px)';
                          } else if (shouldTranslateXRight) {
                            transformValue = 'translateX(4px)';
                          } else if (shouldTranslateXRightEvenMore) {
                            transformValue = 'translateX(39px) translateY(-2px)';
                          } else if (shouldTranslateXRightMore) {
                            transformValue = 'translateX(0px) translateY(-9px)';
                          }

                          // Tiempos aleatorios y creativos pre-definidos (más comprimidos)
                          const customDelaysMobile = [0.05, 0.4, 0.15, 0.65, 0.1, 0.3, 0.5, 0.25, 0.7, 0.35];
                          const customDurationsMobile = [0.8, 1.0, 0.6, 1.2, 0.7, 0.8, 1.1, 0.6, 1.3, 0.7];
                          
                          const delayTimeMobile = customDelaysMobile[idx] !== undefined ? customDelaysMobile[idx] : 0;
                          const durationTimeMobile = customDurationsMobile[idx] !== undefined ? customDurationsMobile[idx] : 1.5;

                          return (
                            <div
                              key={idx}
                              className={`relative hero-company-logo-item-mobile pointer-events-auto ${isPeerMusic ? 'h-6' : isAtresmedia ? 'h-8' : isMovistarPlus ? 'h-2' : isMediaset ? 'h-4' : 'h-6'} ${isPeerMusic ? 'w-12' : isAtresmedia ? 'w-20' : isMovistarPlus ? 'w-4' : isMediaset ? 'w-8' : 'w-12'} cursor-pointer`}
                              style={{
                                height: isMediaset ? '18px' : isPeerMusic ? '25.5px' : 'auto',
                                width: isMediaset ? '38px' : isPeerMusic ? '51.5px' : 'auto',
                                minHeight: isPeerMusic ? '25.5px' : isAtresmedia ? '32px' : isMovistarPlus ? '6px' : isMediaset ? '18px' : '24px',
                                minWidth: isPeerMusic ? '51.5px' : isAtresmedia ? '72px' : isMovistarPlus ? '16px' : isMediaset ? '38px' : '48px',
                                maxHeight: isMediaset ? '18px' : isPeerMusic ? '25.5px' : 'none',
                                maxWidth: isMediaset ? '38px' : isPeerMusic ? '51.5px' : 'none',
                                transform: transformValue,
                                opacity: 0,
                                animation: logoVisible ? `customFadeInLogo ${durationTimeMobile}s ease-in-out ${delayTimeMobile + 0.2}s forwards` : 'none'
                              }}
                            >
                              <Image
                                src={src}
                                alt={`company logo ${idx} - ${isMediaset ? 'mediaset' : ''}`}
                                fill
                                className="object-contain"
                                style={
                                  isMediaset
                                    ? { filter: 'brightness(0) invert(1)', opacity: 0.5, imageRendering: '-webkit-optimize-contrast', transition: 'filter 0.3s ease-in-out, opacity 0.3s ease-in-out' }
                                    : isMovistarPlus
                                      ? { filter: 'brightness(0) invert(1)', opacity: 0.5, transition: 'filter 0.3s ease-in-out, opacity 0.3s ease-in-out' }
                                      : shouldApplyFilter
                                        ? { filter: 'brightness(0) invert(1)', opacity: 0.5, transition: 'filter 0.3s ease-in-out, opacity 0.3s ease-in-out' }
                                        : { filter: 'invert(1)', opacity: 0.5, transition: 'filter 0.3s ease-in-out' }
                                }
                                unoptimized={idx === 7 || idx === 9}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>


        {/* Mobile: iconos y línea */}
        {/* CRÍTICO: Los iconos están OCULTOS hasta que logoVisible sea true */}
        {false && (isGeminiMobile ? heroImageShifted : logoVisible) && (
          <div
            className={`absolute inset-x-0 ${isGeminiMobile ? 'bottom-[90vh]' : 'bottom-[48vh]'} md:hidden flex flex-col items-center justify-center gap-4 hero-icons z-30 ${iconsAnimationReady ? 'icons-visible' : 'icons-hidden'}`}
            style={{
              zIndex: 30,
              transform: 'translateX(34vw) translateY(-16vh)',
              position: 'absolute',
              transition: 'none' // Sin transiciones que interfieran
            }}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <a
                href="https://open.spotify.com/playlist/1dM5WSIpE6QKbF9Lcux2sV?si=9f1915845d7040ed"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Spotify"
                className="text-white relative z-30 cursor-pointer"
                style={{ zIndex: 30 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" /></svg>
              </a>
              <a
                href="https://www.instagram.com/_bksmusic/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white relative z-30 cursor-pointer"
                style={{ zIndex: 30 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://soundcloud.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SoundCloud"
                className="text-white relative z-30 cursor-pointer"
                style={{ zIndex: 30 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M1.175 13.5c-.552 0-1 .5-1 1.125v3.75c0 .625.448 1.125 1 1.125S2.175 19 2.175 18.375v-3.75c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125S4.625 18.875 4.625 18.25V12.75c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v7.5c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-7.5c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v9.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V9.75c0-.625-.448-1.125-1-1.125zm2.45-3c-.552 0-1 .5-1 1.125v12.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V6.75c0-.625-.448-1.125-1-1.125zm2.45 3c-.552 0-1 .5-1 1.125v9.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V9.75c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v7.5c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-7.5c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v3.75c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-3.75c0-.625-.448-1.125-1-1.125zM19.55 11.25c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.375c0-.625-.448-1.125-1-1.125zM22 11.25c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.375c0-.625-.448-1.125-1-1.125z" /></svg>
              </a>
            </div>
          </div>
        )}

        {/* Desktop: iconos a la derecha y abajo del hero */}
        {/* CRÍTICO: Los iconos están OCULTOS hasta que logoVisible sea true */}
        {logoVisible && (
          <div
            className={`absolute hidden md:flex flex-col items-end justify-end gap-2 hero-icons z-30 ${iconsAnimationReady ? 'icons-visible' : 'icons-hidden'}`}
            style={{
              top: '44%',
              right: '44px',
              transform: 'translateY(2vh)',
              zIndex: 30,
              position: 'absolute'
            }}
          >
            <div className="flex flex-col items-end justify-end gap-2">
              <a
                href="https://open.spotify.com/playlist/1dM5WSIpE6QKbF9Lcux2sV?si=9f1915845d7040ed"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Spotify"
                className="text-white/70 relative z-30 cursor-pointer"
                style={{ zIndex: 30 }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ width: '19px', height: '19px' }}><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" /></svg>
              </a>
              <a
                href="https://www.instagram.com/_bksmusic/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/70 relative z-30 cursor-pointer"
                style={{ zIndex: 30 }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: '19px', height: '19px' }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://soundcloud.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SoundCloud"
                className="text-white/70 relative z-30 cursor-pointer"
                style={{ zIndex: 30 }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ width: '19px', height: '19px' }}><path d="M1.175 13.5c-.552 0-1 .5-1 1.125v3.75c0 .625.448 1.125 1 1.125S2.175 19 2.175 18.375v-3.75c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125S4.625 18.875 4.625 18.25V12.75c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v7.5c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-7.5c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v9.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V9.75c0-.625-.448-1.125-1-1.125zm2.45-3c-.552 0-1 .5-1 1.125v12.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V6.75c0-.625-.448-1.125-1-1.125zm2.45 3c-.552 0-1 .5-1 1.125v9.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V9.75c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v7.5c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-7.5c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.75c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v3.75c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-3.75c0-.625-.448-1.125-1-1.125zM19.55 11.25c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.375c0-.625-.448-1.125-1-1.125zM22 11.25c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.375c0-.625-.448-1.125-1-1.125z" /></svg>
              </a>
            </div>
          </div>
        )}

        {/* Social Icons - ocultos por petición */}
        {/* Social Icons - Bottom Right */}
        {false && <div className="absolute bottom-5 right-12 z-[60] flex gap-5">
          {/* Instagram Icon */}
          <a href="https://www.instagram.com/bks_music/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#f3f526] hover:opacity-100 transition-all duration-300">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>

          {/* Spotify Icon */}
          <a href="https://open.spotify.com/playlist/1dM5WSIpE6QKbF9Lcux2sV?si=9f1915845d7040ed" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#f3f526] hover:opacity-100 transition-all duration-300">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </a>

          {/* SoundCloud Icon */}
          <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#f3f526] hover:opacity-100 transition-all duration-300">
            <svg className="w-6 h-6 -mt-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1.175 13.5c-.552 0-1 .5-1 1.125v3.75c0 .625.448 1.125 1 1.125S2.175 19 2.175 18.375v-3.75c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125S4.625 18.875 4.625 18.25V12.75c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v7.5c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-7.5c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v9.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V9.75c0-.625-.448-1.125-1-1.125zm2.45-3c-.552 0-1 .5-1 1.125v12.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V6.75c0-.625-.448-1.125-1-1.125zm2.45 3c-.552 0-1 .5-1 1.125v9.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V9.75c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v7.5c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-7.5c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.75c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v3.75c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-3.75c0-.625-.448-1.125-1-1.125zM19.55 11.25c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.375c0-.625-.448-1.125-1-1.125zM22 11.25c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.375c0-.625-.448-1.125-1-1.125z" />
            </svg>
          </a>
        </div>}

        {/* Flecha scroll cue */}
        <div
          className="absolute left-1/2 bottom-8 z-40 pointer-events-none"
          style={{
            transform: 'translateX(-50%)',
            opacity: scrollCueFaded ? 0 : scrollCueVisible ? 1 : 0,
            transition: scrollCueFaded
              ? 'opacity 0.6s ease-out'
              : scrollCueVisible
                ? 'opacity 0.6s ease-out'
                : 'none',
          }}
          aria-hidden="true"
        >
          {/* Bounce animation en este div — sin overflow-hidden para no recortar */}
          <div
            className="flex items-center justify-center"
            style={{
              color: 'rgba(255,255,255,0.42)',
              animation: scrollCueVisible
                ? 'scrollCueBounce 2.0s ease-in-out 0.85s 1 both'
                : 'none',
              width: '32px',
              height: '32px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </div>
        </div>

      </section>
      <style jsx>{`
        /* Efecto hover para el logo BKS MUSIC */
        .hero-logo-wrapper:hover img {
          filter: brightness(0) invert(1) brightness(2) drop-shadow(0 0 30px rgba(255, 255, 255, 1)) !important;
          transform: scale(1.1) !important;
        }

        /* Efecto hover para logos de compañías */
        .hero-company-logo-item {
          transition: transform 0.3s ease-in-out !important;
        }
        .hero-company-logo-item:hover {
          transform: inherit !important; /* Will be overridden by the scale below if simple, but we need to combine with current translate */
          transform: scale(1.15) !important;
          /* If there's a transform in style, CSS hover scale might replace it. 
             Ideally we use a wrapper for the scale to not conflict with translate. */
        }
        .hero-company-logo-item img {
          opacity: 0.5 !important;
          transition: filter 0.3s ease-in-out, opacity 0.3s ease-in-out !important;
        }
        .hero-company-logo-item:hover img {
          opacity: 1 !important;
          filter: brightness(0) invert(1) brightness(1.8) drop-shadow(0 0 10px rgba(255, 255, 255, 0.9)) !important;
        }

        /* Mobile specific hover (also works for touch) */
        .hero-company-logo-item-mobile {
          transition: transform 0.3s ease-in-out !important;
        }
        .hero-company-logo-item-mobile:hover {
          transform: scale(1.15) !important;
        }
        .hero-company-logo-item-mobile img {
          opacity: 0.5 !important;
          transition: filter 0.3s ease-in-out, opacity 0.3s ease-in-out !important;
        }
        .hero-company-logo-item-mobile:hover img {
          opacity: 1 !important;
          filter: brightness(0) invert(1) brightness(1.8) drop-shadow(0 0 10px rgba(255, 255, 255, 0.9)) !important;
        }
        .hero-logo-wrapper img {
          transition: filter 0.3s ease-in-out, transform 0.3s ease-in-out !important;
        }
        /* También aplicar al wrapper de Next.js Image */
        .hero-logo-wrapper:hover span img,
        .hero-logo-wrapper:hover div img {
          filter: brightness(0) invert(1) brightness(2) drop-shadow(0 0 30px rgba(255, 255, 255, 1)) !important;
          transform: scale(1.1) !important;
        }


        @keyframes scrollCueBounce {
          0%   { transform: translateY(0); }
          14%  { transform: translateY(20px); }
          28%  { transform: translateY(0); }
          42%  { transform: translateY(11px); }
          54%  { transform: translateY(0); }
          65%  { transform: translateY(5px); }
          74%  { transform: translateY(0); }
          100% { transform: translateY(0); }
        }

        @media (max-width: 767px) {
        .mobile-adjust { padding-top: 28px; }
        .mobile-adjust h1 {
          font-weight: 900 !important;
          -webkit-text-stroke: 0.6px rgba(255,255,255,0.9);
          text-stroke: 0.6px rgba(255,255,255,0.9);
          color: #fff;
          text-shadow: 0 0 6px rgba(0,0,0,0.28);
        }
        .mobile-adjust p { font-size: 9px !important; }

        /* Sin flotación: el logo permanece estático */
        .logo-float { animation: none !important; }


        /* (sin subrayado animado en la versión blanca) */

        /* Animación de iconos sociales - fade in simple, después del logo */
        .hero-icons {
          opacity: 0;
          visibility: hidden;
        }
        .hero-icons.icons-hidden {
          opacity: 0 !important;
          visibility: hidden !important;
          display: none !important;
        }
        .hero-icons.icons-visible {
          /* Los iconos aparecen con fade in de 4 segundos */
          display: flex !important;
          visibility: visible !important;
          opacity: 0;
          animation: iconsFadeIn 4s ease-in-out forwards;
        }
        .hero-icons.icons-visible a {
          opacity: inherit;
        }
        .hero-icons.icons-visible-hero4 {
          /* Para hero4 móvil, los iconos aparecen inmediatamente sin delay */
          opacity: 1 !important;
          visibility: visible !important;
          animation: none !important;
        }
        @keyframes iconsFadeIn {
          0% {
            opacity: 0;
          }
          25% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.45;
          }
          75% {
            opacity: 0.75;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes fadeInHeader {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Animación de línea - empieza oculta por defecto */
        .hero-line {
          opacity: 0;
          width: 0;
        }
        .hero-line.line-hidden {
          opacity: 0;
          width: 0;
          animation: none;
        }
        .hero-line.line-visible {
          animation: lineFadeIn 0.8s ease-out 3.4s forwards;
        }
        @keyframes lineFadeIn {
          from {
            opacity: 0;
            width: 0;
          }
          to {
            opacity: 1;
            width: 6rem;
          }
        }
      }

      @media (min-width: 768px) {

        /* Animación de iconos sociales en desktop - fade in simple, después del logo */
        .hero-icons {
          opacity: 0;
          visibility: hidden;
        }
        .hero-icons.icons-hidden {
          opacity: 0 !important;
          visibility: hidden !important;
          display: none !important;
        }
        .hero-icons.icons-visible {
          /* Los iconos aparecen con fade in de 4 segundos */
          display: flex !important;
          visibility: visible !important;
          opacity: 0;
          animation: iconsFadeInDesktop 4s ease-in-out forwards;
        }
        .hero-icons.icons-visible a {
          opacity: inherit;
        }
      }

      @keyframes iconsFadeInDesktop {
        0% {
          opacity: 0;
        }
        25% {
          opacity: 0.15;
        }
        50% {
          opacity: 0.45;
        }
        75% {
          opacity: 0.75;
        }
        100% {
          opacity: 1;
        }
      }

      @keyframes customFadeInLogo {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `}</style>

    </>
  );
}
