"use client";

import { useState, useEffect, useRef } from "react";


interface NavigationProps {
  activeHeroBg?: string;
  pageVersion?: string;
}

interface NavLinkProps {
  href: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
}

const NavLink = ({ href, label, className, style, onClick, target, rel }: NavLinkProps) => {
  return (
    <a
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      className={`group relative overflow-hidden inline-block ${className}`}
      style={{
        ...style,
        verticalAlign: 'bottom',
        height: '1.25em',
        lineHeight: '1.25em'
      }}
    >
      <div className="flex relative items-center justify-center">
        {label.split('').map((char, i) => (
          <span
            key={i}
            className="relative inline-block transition-transform duration-[600ms] group-hover:duration-[200ms] cubic-bezier(0.65, 0.05, 0, 1) group-hover:translate-y-[-1.25em]"
            style={{
              transitionDelay: `${i * 25}ms`,
              textShadow: '0 1.25em currentColor',
              whiteSpace: char === ' ' ? 'pre' : 'normal'
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </a>
  );
};

export default function V3Navigation({ activeHeroBg, pageVersion }: NavigationProps) {
  const [headerOpacity, setHeaderOpacity] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const isScrolled = headerOpacity > 0.1;
  const isFullyScrolled = headerOpacity > 0.8;

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
        <div className="flex items-center h-full">
          {/* Left Side - Logo (Ahora con el mismo fade out que el menú) */}
          <div
            ref={logoRef}
            style={{
              opacity: mounted ? Math.max(0, 1 - headerOpacity * 25) : 0,
              pointerEvents: headerOpacity > 0.04 ? 'none' : 'auto',
              transform: `translateY(${mounted ? (headerOpacity * -30) : '-20px'}px)`,
              transition: `opacity ${entranceDone ? '0.1s' : '3s'} ease-in-out, transform ${entranceDone ? '0.1s' : '3s'} ease-in-out`
            }}
          >
            <NavLink
              href="#home"
              label="BKS MUSIC"
              onClick={(e) => handleLinkClick(e, 'home')}
              className="text-base sm:text-lg md:text-lg font-black uppercase tracking-wide cursor-pointer absolute"
              style={{
                color: 'white',
                left: '67px',
                paddingLeft: '0',
                zIndex: 10,
                fontFamily: "'Europa Grotesk No 2 SH', sans-serif"
              }}
            />
          </div>

          {/* Desktop Menu - Centered (Desvanece progresivamente - Desaparición casi instantánea) */}
          <div ref={desktopMenuRef} className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2" style={{
            fontFamily: 'Calibri, sans-serif',
            opacity: 0,
            pointerEvents: 'none',
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

          {/* Mobile Menu Button - Right side (Desvanece progresivamente) */}
          <button
            ref={mobileButtonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none ml-auto"
            aria-label="Toggle menu"
            style={{
              opacity: mounted ? (isScrolled ? 0 : 1) : 0,
              pointerEvents: isScrolled ? 'none' : 'auto',
              transition: 'opacity 0.3s ease-in-out'
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


        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className={`md:hidden mt-2 pb-4 border-t ${pageVersion === "v2" || pageVersion === "v3" ? 'border-transparent' : 'border-gray-700/50'} pt-2 ${pageVersion === "v2" || pageVersion === "v3" ? 'bg-black/90 backdrop-blur-md' : 'bg-black/90 backdrop-blur-md'} -mx-4 md:-mx-6 px-4 md:px-6`}>
            <div className="flex flex-col space-y-2" style={{ fontFamily: 'Calibri, sans-serif' }}>
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


              {/* Mobile Social Icons */}
              <div className="flex items-center space-x-4 pt-2 border-t border-gray-700/50 mt-1">
                <a href="https://open.spotify.com/playlist/1dM5WSIpE6QKbF9Lcux2sV?si=9f1915845d7040ed" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/_bksmusic/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
