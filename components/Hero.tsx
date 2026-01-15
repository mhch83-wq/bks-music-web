"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// HERO OPTIONS - Guardado para referencia futura
// Hero4 está guardado pero oculto. Para reactivarlo, cambiar activeBgId a "hero4" y mostrar el selector
const HERO_OPTIONS = [
  { id: "hero1", label: "1", hasVideo: true, hasLogo: true },
  // Hero4 guardado para referencia futura
  // { id: "hero4", label: "4", hasVideo: false, hasLogo: true, imageSrc: "/hero-options/hero-4.png" },
];

interface HeroProps {
  onActiveBgChange?: (bgId: string) => void;
}

export default function Hero({ onActiveBgChange }: HeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [initialHeroSet, setInitialHeroSet] = useState(false);
  const [heroImageShifted, setHeroImageShifted] = useState(false);
  // Siempre usar hero1 (tanto desktop como móvil)
  // Para reactivar hero4: cambiar a "hero4" y descomentar en HERO_OPTIONS
  const [activeBgId, setActiveBgId] = useState<string>("hero1");
  
  // Estados para controlar las animaciones secuenciales
  const [logoBKSVisible, setLogoBKSVisible] = useState(false);
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

  useEffect(() => {
    setIsVisible(true);
    // Detectar si es móvil solo para el estado isMobile
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      // Secuencia de animaciones para Hero H (bg20):
      // 1. Video + header aparecen inmediatamente (ya están visibles)
      // 2. Logo BKS Music con fade in después de 0.5s
      // 3. Overlay texto con fade in después de 1s
      // 4. Logos de compañías suben después de 1.5s (se controla en page.tsx)
      // 5. Logos sociales con fade in después de 2.5s (hero1) o inmediatamente (hero4 móvil)
      
      // Solo hero1 activo (hero4 guardado para referencia futura)
      if (activeBgId === "hero1") {
        const logoBKSTimer = setTimeout(() => {
          setLogoBKSVisible(true);
        }, 500);
        
        const overlayTextTimer = setTimeout(() => {
          setOverlayTextVisible(true);
        }, 1000);
        
        // Iconos sociales aparecen después de 2.5s
        const socialIconsTimer = setTimeout(() => {
          setLogoVisible(true);
        }, 2500);
        
        return () => {
          clearTimeout(logoBKSTimer);
          clearTimeout(overlayTextTimer);
          clearTimeout(socialIconsTimer);
          window.removeEventListener('resize', checkMobile);
        };
      } else {
        // Para otros heroes, mantener la lógica original
        const timer = setTimeout(() => {
          setLogoVisible(true);
        }, 400);
        const heroShiftTimer = setTimeout(() => {
          setHeroImageShifted(true);
        }, 2000);
        return () => {
          clearTimeout(timer);
          clearTimeout(heroShiftTimer);
          window.removeEventListener('resize', checkMobile);
        };
      }
    }
  }, [initialHeroSet, activeBgId]);

  // Notificar cambio de hero activo
  useEffect(() => {
    if (onActiveBgChange) {
      onActiveBgChange(activeBgId);
    }
  }, [activeBgId, onActiveBgChange]);

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

  // Siempre usar hero1
  let validActiveBgId = activeBgId;
  if (validActiveBgId !== "hero1") {
    validActiveBgId = "hero1";
  }
  const currentHero = HERO_OPTIONS.find((hero) => hero.id === validActiveBgId) ?? HERO_OPTIONS[0];
  const isGeminiMobile = false;

  return (
    <>
    <section id="home" data-gemini-active={isGeminiMobile ? "true" : "false"} className={`relative ${isGeminiMobile ? "pt-0 overflow-visible" : "min-h-[100vh] flex items-center justify-center overflow-hidden pt-24 md:pt-0"}`} style={isGeminiMobile ? { width: '100vw', margin: '0', padding: '0', left: '0', right: '0', maxWidth: '100vw', position: 'relative', overflow: 'visible', height: '190vh', minHeight: '190vh' } : {}}>
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
      {/* Video Background */}
      {/* Desktop: vídeo o imagen según hero */}
      <div className="absolute inset-0 z-0 hidden md:flex items-center justify-center bg-black">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full max-w-[100vw] max-h-[100vh]">
            {/* Hero1 siempre tiene video */}
            <video
              key="hero1-video-desktop"
              src="/VideoLofi2.mp4"
              autoPlay={true}
              loop={true}
              muted={true}
              playsInline={true}
              className="w-full h-full"
              style={{ objectFit: 'contain', transform: 'translateY(-26.5vh) scale(1.65)', filter: 'brightness(0.75) contrast(1.2)' }}
            />
            <div className="absolute inset-0 z-5 bg-black/15" style={{ pointerEvents: 'none' }}></div>
            {currentHero.hasLogo && (
              <>
                <div 
                  className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${logoBKSVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transform: 'translateY(-20vh) translateX(-13vw)' }}
                >
                  <Image
                    src="/hero-h-logo.png"
                    alt="Hero Logo"
                    width={600}
                    height={200}
                    className="object-contain"
                    style={{ maxWidth: '70%', height: 'auto', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
                  />
                </div>
                <div 
                  className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${overlayTextVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transform: 'translateY(5vh) translateX(-10vw)' }}
                >
                  <Image
                    src="/hero-h-overlay.png"
                    alt="Hero Overlay"
                    width={800}
                    height={600}
                    className="object-contain"
                    style={{ maxWidth: '44%', height: 'auto' }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: vídeo o imagen según hero */}
      <div className={`absolute inset-0 z-0 md:hidden bg-black flex items-start justify-center`} style={{ top: '6rem' }}>
          <div className="relative w-full h-full flex items-start justify-center">
            <div className="relative w-full h-full max-w-[100vw] max-h-[100vh] flex items-center justify-center">
              {/* Hero1 siempre tiene video */}
              <video
                key="hero1-video-mobile"
                src="/VideoLofi2.mp4"
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                className="w-full h-full"
                style={{ objectFit: 'contain', transform: 'translateY(-26.5vh) scale(1.65)', filter: 'brightness(0.75) contrast(1.2)' }}
              />
              <div className="absolute inset-0 z-5 bg-black/15" style={{ pointerEvents: 'none' }}></div>
              {currentHero.hasLogo && (
                <>
                  <div 
                    className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${logoBKSVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transform: 'translateY(-38vh) translateX(-13vw)' }}
                  >
                    <Image
                      src="/hero-h-logo.png"
                      alt="Hero Logo"
                      width={400}
                      height={150}
                      className="object-contain"
                      style={{ maxWidth: '60%', height: 'auto', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
                    />
                  </div>
                  <div 
                    className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${overlayTextVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transform: 'translateY(-28vh) translateX(-11vw)' }}
                  >
                    <Image
                      src="/hero-h-overlay.png"
                      alt="Hero Overlay"
                      width={800}
                      height={600}
                      className="object-contain"
                      style={{ maxWidth: '65%', height: 'auto' }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>


      {/* Mobile: iconos y línea */}
      <div 
        className={`absolute inset-x-0 ${isGeminiMobile ? 'bottom-[90vh]' : 'bottom-[48vh]'} md:hidden flex flex-col items-center justify-center gap-4 hero-icons z-30 ${isGeminiMobile ? (heroImageShifted ? 'icons-visible' : 'icons-hidden') : (logoVisible ? 'icons-visible' : 'icons-hidden')} transition-transform duration-[2000ms] ease-out`}
        style={{
          zIndex: 30,
          opacity: 0,
          visibility: 'hidden',
          transform: 'translateX(34vw) translateY(-12vh)',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'absolute'
        }}
      >
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://open.spotify.com/playlist/1dM5WSIpE6QKbF9Lcux2sV?si=9f1915845d7040ed"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Spotify"
            className="transition hover:opacity-90 text-white relative z-30 cursor-pointer opacity-60"
            style={{ zIndex: 30 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          </a>
          <a
            href="https://www.instagram.com/_bksmusic/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition hover:opacity-90 text-white relative z-30 cursor-pointer opacity-60"
            style={{ zIndex: 30 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a
            href="https://soundcloud.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SoundCloud"
            className="transition hover:opacity-90 text-white relative z-30 cursor-pointer opacity-60"
            style={{ zIndex: 30 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M1.175 13.5c-.552 0-1 .5-1 1.125v3.75c0 .625.448 1.125 1 1.125S2.175 19 2.175 18.375v-3.75c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125S4.625 18.875 4.625 18.25V12.75c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v7.5c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-7.5c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v9.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V9.75c0-.625-.448-1.125-1-1.125zm2.45-3c-.552 0-1 .5-1 1.125v12.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V6.75c0-.625-.448-1.125-1-1.125zm2.45 3c-.552 0-1 .5-1 1.125v9.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V9.75c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v7.5c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-7.5c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v3.75c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-3.75c0-.625-.448-1.125-1-1.125zM19.55 11.25c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.375c0-.625-.448-1.125-1-1.125zM22 11.25c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.375c0-.625-.448-1.125-1-1.125z"/></svg>
          </a>
        </div>
      </div>

      {/* Desktop: iconos a la derecha y abajo del hero */}
      <div 
        className={`absolute hidden md:flex flex-col items-end justify-end gap-4 hero-icons z-30 ${logoVisible ? 'icons-visible' : 'icons-hidden'}`}
        style={{
          bottom: '170px',
          right: '60px',
          zIndex: 30,
          position: 'absolute'
        }}
      >
        <div className="flex items-center justify-end gap-4">
          <a
            href="https://open.spotify.com/playlist/1dM5WSIpE6QKbF9Lcux2sV?si=9f1915845d7040ed"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Spotify"
            className="transition hover:opacity-90 text-white relative z-30 cursor-pointer opacity-60"
            style={{ zIndex: 30 }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          </a>
          <a
            href="https://www.instagram.com/_bksmusic/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition hover:opacity-90 text-white relative z-30 cursor-pointer opacity-60"
            style={{ zIndex: 30 }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a
            href="https://soundcloud.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SoundCloud"
            className="transition hover:opacity-90 text-white relative z-30 cursor-pointer opacity-60"
            style={{ zIndex: 30 }}
          >
            <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor"><path d="M1.175 13.5c-.552 0-1 .5-1 1.125v3.75c0 .625.448 1.125 1 1.125S2.175 19 2.175 18.375v-3.75c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125S4.625 18.875 4.625 18.25V12.75c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v7.5c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-7.5c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v9.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V9.75c0-.625-.448-1.125-1-1.125zm2.45-3c-.552 0-1 .5-1 1.125v12.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V6.75c0-.625-.448-1.125-1-1.125zm2.45 3c-.552 0-1 .5-1 1.125v9.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V9.75c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v7.5c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-7.5c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.75c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v3.75c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-3.75c0-.625-.448-1.125-1-1.125zM19.55 11.25c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.375c0-.625-.448-1.125-1-1.125zM22 11.25c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.375c0-.625-.448-1.125-1-1.125z"/></svg>
          </a>
        </div>
      </div>

      {/* Hero Selector - OCULTO pero guardado para referencia futura */}
      {/* Para reactivar: cambiar className a mostrar y descomentar hero4 en HERO_OPTIONS */}
      {false && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-3 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          {HERO_OPTIONS.filter((hero) => {
            // En móvil, mostrar hero1 y hero4
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
              return hero.id === "hero1" || hero.id === "hero4";
            }
            return true;
          }).map((hero) => (
            <button
              key={hero.id}
              onClick={() => {
                setActiveBgId(hero.id);
                setLogoBKSVisible(false);
                setOverlayTextVisible(false);
                setLogoVisible(false);
                // Resetear animaciones después de un breve delay
                setTimeout(() => {
                  if (hero.hasLogo) {
                    const isMobileHero4 = hero.id === "hero4" && typeof window !== 'undefined' && window.innerWidth < 768;
                    setTimeout(() => setLogoBKSVisible(true), 500);
                    setTimeout(() => setOverlayTextVisible(true), 1000);
                    // En hero4 móvil, iconos aparecen inmediatamente
                    if (isMobileHero4) {
                      setLogoVisible(true);
                    } else {
                      setTimeout(() => setLogoVisible(true), 2500);
                    }
                  } else {
                    setTimeout(() => setLogoVisible(true), 400);
                  }
                }, 100);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                validActiveBgId === hero.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Hero {hero.label}
            </button>
          ))}
        </div>
      )}

      {/* Social Icons - ocultos por petición */}
      <div className="hidden">
        {/* Spotify Icon */}
        <a href="https://open.spotify.com/playlist/1dM5WSIpE6QKbF9Lcux2sV?si=9f1915845d7040ed" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </a>
        
        {/* Instagram Icon */}
        <a href="https://www.instagram.com/_bksmusic/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
        </a>
        
        {/* SoundCloud Icon */}
        <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1.175 13.5c-.552 0-1 .5-1 1.125v3.75c0 .625.448 1.125 1 1.125S2.175 19 2.175 18.375v-3.75c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125S4.625 18.875 4.625 18.25V12.75c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v7.5c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-7.5c0-.625-.448-1.125-1-1.125zm2.45-1.875c-.552 0-1 .5-1 1.125v9.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V9.75c0-.625-.448-1.125-1-1.125zm2.45-3c-.552 0-1 .5-1 1.125v12.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V6.75c0-.625-.448-1.125-1-1.125zm2.45 3c-.552 0-1 .5-1 1.125v9.375c0 .625.448 1.125 1 1.125s1-.5 1-1.125V9.75c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v7.5c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-7.5c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.75c0-.625-.448-1.125-1-1.125zm2.45 1.875c-.552 0-1 .5-1 1.125v3.75c0 .625.448 1.125 1 1.125s1-.5 1-1.125v-3.75c0-.625-.448-1.125-1-1.125zM19.55 11.25c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.375c0-.625-.448-1.125-1-1.125zM22 11.25c-.552 0-1 .5-1 1.125v5.625c0 .625.448 1.125 1 1.125s1-.5 1-1.125V12.375c0-.625-.448-1.125-1-1.125z"/>
          </svg>
        </a>
      </div>

    </section>
    <style jsx>{`
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

        /* Fondo animado en móvil (gradiente desplazado) */
        .animated-bg {
          background: radial-gradient(120% 80% at 50% 70%, rgba(34,211,238,0.14) 0%, rgba(167,139,250,0.12) 40%, rgba(244,114,182,0.10) 70%, rgba(0,0,0,0) 100%),
                      linear-gradient(90deg, rgba(34,211,238,0.12), rgba(167,139,250,0.12), rgba(244,114,182,0.12));
          background-size: 300% 300%, 400% 400%;
          animation: bgShift 12s ease-in-out infinite;
          mix-blend-mode: screen;
          opacity: 0.55;
        }
        @keyframes bgShift {
          0% { background-position: 0% 50%, 0% 50%; }
          50% { background-position: 100% 50%, 100% 50%; }
          100% { background-position: 0% 50%, 0% 50%; }
        }

        /* (sin subrayado animado en la versión blanca) */

        /* Animación de iconos sociales - fade in simple, después del logo */
        .hero-icons {
          opacity: 0;
          visibility: hidden;
        }
        .hero-icons.icons-hidden {
          opacity: 0;
          visibility: hidden;
        }
        .hero-icons.icons-visible {
          /* Mantener oculto hasta que la animación se ejecute */
          /* La animación de subida dura 2s y empieza a los 2s, termina a los 4s. Los iconos aparecen 1s después, a los 5s */
          animation: iconsFadeIn 1s ease-out 3s forwards;
        }
        .hero-icons.icons-visible-hero4 {
          /* Para hero4 móvil, los iconos aparecen inmediatamente sin delay */
          opacity: 1 !important;
          visibility: visible !important;
          animation: none !important;
        }
        @keyframes iconsFadeIn {
          from {
            opacity: 0;
            visibility: hidden;
          }
          to {
            opacity: 1;
            visibility: visible;
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
          opacity: 0;
          visibility: hidden;
        }
        .hero-icons.icons-visible {
          animation: iconsFadeInDesktop 1s ease-out 1.2s forwards;
        }
      }

      @keyframes iconsFadeInDesktop {
        from {
          opacity: 0;
          visibility: hidden;
        }
        to {
          opacity: 1;
          visibility: visible;
        }
      }
    `}</style>
    </>
  );
}

