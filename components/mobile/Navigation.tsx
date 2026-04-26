"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FONT_EUROPA_STACK } from "@/lib/europaFont";

export default function Navigation() {
  const [headerOpacity, setHeaderOpacity] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      // El header se oscurece progresivamente hasta llegar al final del hero
      const progress = Math.min(scrollY / (heroHeight * 0.8), 1);
      setHeaderOpacity(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // CSS-based Entrance Animation
  const [mounted, setMounted] = useState(false);
  const [entranceDone, setEntranceDone] = useState(false);

  const isModernNav = true;

  useEffect(() => {
    // Small delay to ensure browser paints initial state (opacity 0)
    const mountTimer = setTimeout(() => {
      setMounted(true);
    }, 100);

    // Switch to fast transition after entrance is complete
    const entranceTimer = setTimeout(() => {
      setEntranceDone(true);
    }, 2500);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(entranceTimer);
    };
  }, []);


  // Cerrar menú cuando se hace clic en un enlace y hacer scroll suave
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      // Scroll más lento y suave para evitar saltos bruscos entre secciones.
      const startY = window.scrollY;
      const targetY = element.getBoundingClientRect().top + window.pageYOffset;
      const duration = 1450;
      const startTime = performance.now();

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);
        window.scrollTo(0, startY + (targetY - startY) * eased);

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-transparent py-3 md:py-4 pointer-events-none"
    >
      {/* Capa de fondo degradada - Restaurada a altura original con máscara para fundido total */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: headerOpacity,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          backdropFilter: `blur(${headerOpacity * 6}px)`,
          WebkitBackdropFilter: `blur(${headerOpacity * 6}px)`,
          // La máscara hace que el desenfoque y el color se desvanezcan suavemente al final
          maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.8) 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.8) 50%, transparent 100%)'
        }}
      />

      <div className="w-full relative px-4 md:px-6 pt-2 md:pt-2 pointer-events-auto">
        <div className="flex items-center h-full w-full">
          {isModernNav && (
            <Link
              href="/"
              className="shrink-0 inline-block text-[0.979rem] uppercase tracking-[0.08em] text-white/85 transition hover:text-white/75 md:text-[1.041rem]"
              style={{
                fontFamily: FONT_EUROPA_STACK,
                fontWeight: 400,
                transform: "scaleX(0.96) scaleY(0.86)",
                transformOrigin: "left center",
                WebkitTextStroke: "0px transparent",
                textShadow: "none",
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "auto",
                textRendering: "geometricPrecision",
                opacity: mounted ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              BKS MUSIC
            </Link>
          )}

          {!isModernNav && (
          <div ref={desktopMenuRef} className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2" style={{
            fontFamily: 'Calibri, sans-serif',
            opacity: mounted ? Math.max(0, 1 - headerOpacity * 25) : 0,
            pointerEvents: headerOpacity > 0.04 ? 'none' : 'auto',
            transform: `translate(-50%, ${mounted ? (headerOpacity * -30) : '-20px'}px)`,
            transition: `opacity ${entranceDone ? '0.1s' : '3s'} ease-in-out, transform ${entranceDone ? '0.1s' : '3s'} ease-in-out`
          }}>
            <a href="#somos-casa-creativa" onClick={(e) => handleLinkClick(e, 'somos-casa-creativa')} className="hover:text-black hover:scale-110 transition-all duration-300 transform inline-block" style={{ textTransform: 'none', fontWeight: 400, color: '#555555', letterSpacing: '-0.01em', fontSize: '0.9375rem' }}>
              Quiénes Somos
            </a>
            <a href="#contact" onClick={(e) => handleLinkClick(e, 'contact')} className="hover:text-black hover:scale-110 transition-all duration-300 transform inline-block" style={{ textTransform: 'none', fontWeight: 400, color: '#555555', letterSpacing: '-0.01em', fontSize: '0.9375rem' }}>
              Contacto
            </a>
            <a
              href="https://bkspublishing.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black hover:scale-110 transition-all duration-300 transform inline-block"
              style={{ textTransform: 'none', fontWeight: 550, color: '#555555', letterSpacing: '-0.01em', fontSize: '0.9375rem' }}
            >
              Bks Publishing
            </a>
          </div>
          )}

          {isModernNav && (
            <div
              className="ml-auto hidden items-center gap-6 md:flex"
              style={{
                fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
                opacity: mounted ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 md:gap-x-5">
                <a
                  href="#trabajos"
                  onClick={(e) => handleLinkClick(e, "trabajos")}
                  className="whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white transition hover:text-white/90"
                >
                  Trabajos
                </a>
                <a
                  href="#somos-casa-creativa"
                  onClick={(e) => handleLinkClick(e, "somos-casa-creativa")}
                  className="whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white transition hover:text-white/90"
                >
                  Quiénes Somos
                </a>
                <a
                  href="#contact"
                  onClick={(e) => handleLinkClick(e, "contact")}
                  className="whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white transition hover:text-white/90"
                >
                  Contacto
                </a>
                <a
                  href="https://bkspublishing.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white transition hover:text-white/90"
                >
                  BKS Publishing
                </a>
              </div>
              <div className="flex items-center gap-3 border-l border-white/20 pl-5">
                <a
                  href="https://open.spotify.com/playlist/1dM5WSIpE6QKbF9Lcux2sV?si=9f1915845d7040ed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white transition hover:text-gray-300"
                  aria-label="Spotify"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/_bksmusic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white transition hover:text-gray-300"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
          )}

          {/* Desktop: Spotify + Instagram (solo layout clásico) */}
          {!isModernNav && (
          <div
            className="ml-auto hidden items-center gap-3 md:flex"
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            <a
              href="https://open.spotify.com/playlist/1dM5WSIpE6QKbF9Lcux2sV?si=9f1915845d7040ed"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition hover:text-gray-300"
              aria-label="Spotify"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/_bksmusic/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition hover:text-gray-300"
              aria-label="Instagram"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
          )}

          {/* Iconos Spotify + Instagram + menú (móvil; siempre visibles en el header) */}
          <div className="md:hidden flex items-center gap-3 ml-auto">
            <div
              style={{
                opacity: mounted ? 1 : 0,
                pointerEvents: mounted ? "auto" : "none",
                transition: "opacity 0.3s ease-in-out",
              }}
              className="flex items-center gap-3"
            >
              <a href="https://open.spotify.com/playlist/1dM5WSIpE6QKbF9Lcux2sV?si=9f1915845d7040ed" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition" aria-label="Spotify">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/_bksmusic/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition" aria-label="Instagram">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
            <button
              ref={mobileButtonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            aria-label="Toggle menu"
            style={{
              opacity: mounted ? 1 : 0,
              pointerEvents: mounted ? "auto" : "none",
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
            </button>
          </div>
        </div>


        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 pb-4 border-t border-transparent pt-2 bg-black/90 backdrop-blur-md -mx-4 md:-mx-6 px-4 md:px-6">
            <div
              className="flex flex-col space-y-2"
              style={{
                fontFamily: isModernNav
                  ? 'var(--font-montserrat), "Montserrat", sans-serif'
                  : "Calibri, sans-serif",
              }}
            >
              {isModernNav ? (
                <>
                  <a
                    href="#trabajos"
                    onClick={(e) => handleLinkClick(e, "trabajos")}
                    className="cursor-pointer py-1 text-[0.95rem] font-semibold uppercase tracking-[0.12em] text-white transition hover:text-white/80"
                  >
                    Trabajos
                  </a>
                  <a
                    href="#somos-casa-creativa"
                    onClick={(e) => handleLinkClick(e, "somos-casa-creativa")}
                    className="cursor-pointer py-1 text-[0.95rem] font-semibold uppercase tracking-[0.12em] text-white transition hover:text-white/80"
                  >
                    Quiénes Somos
                  </a>
                  <a
                    href="#contact"
                    onClick={(e) => handleLinkClick(e, "contact")}
                    className="cursor-pointer py-1 text-[0.95rem] font-semibold uppercase tracking-[0.12em] text-white transition hover:text-white/80"
                  >
                    Contacto
                  </a>
                  <a
                    href="https://bkspublishing.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer py-1 text-[0.95rem] font-semibold uppercase tracking-[0.12em] text-white transition hover:text-white/80"
                  >
                    BKS Publishing
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="#somos-casa-creativa"
                    onClick={(e) => handleLinkClick(e, 'somos-casa-creativa')}
                    className="hover:text-gray-400 transition py-1 cursor-pointer"
                    style={{ textTransform: 'none', fontWeight: 400, color: '#555555', letterSpacing: '-0.01em', fontSize: '1.0625rem' }}
                  >
                    Quiénes Somos
                  </a>
                  <a
                    href="#contact"
                    onClick={(e) => handleLinkClick(e, 'contact')}
                    className="hover:text-gray-400 transition py-1 cursor-pointer"
                    style={{ textTransform: 'none', fontWeight: 400, color: '#555555', letterSpacing: '-0.01em', fontSize: '1.0625rem' }}
                  >
                    Contacto
                  </a>
                  <a
                    href="https://bkspublishing.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400 transition py-1 cursor-pointer"
                    style={{ textTransform: 'none', fontWeight: 550, color: '#555555', letterSpacing: '-0.01em', fontSize: '1.0625rem' }}
                  >
                    Bks Publishing
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
