"use client";

import { useState, useEffect } from "react";

interface NavigationProps {
  activeHeroBg?: string;
}

export default function Navigation({ activeHeroBg }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menú cuando se hace clic en un enlace y hacer scroll suave
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-transparent'} border-transparent py-3 md:py-4`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Left Side - Logo */}
          <a
            href="#home"
            className="text-base sm:text-lg md:text-lg font-bold text-white uppercase tracking-wide hover:text-gray-300 transition cursor-pointer"
          >
            BKS MUSIC
          </a>
          
          {/* Desktop Menu - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#work" className="text-xs hover:text-gray-400 transition uppercase tracking-wider text-gray-300">
              Trabajos
            </a>
            <a href="#quienes-somos" className="text-xs hover:text-gray-400 transition uppercase tracking-wider text-gray-300">
              Quiénes somos
            </a>
            <a href="#contact" className="text-xs hover:text-gray-400 transition uppercase tracking-wider text-gray-300">
              Contacto
            </a>
            <a
              href="https://bkspublishing.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-wider text-white hover:text-gray-200 transition"
            >
              BKS Publishing
            </a>
          </div>

          {/* Mobile Menu Button - Right side */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none ml-auto"
            aria-label="Toggle menu"
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
        <div className="md:hidden mt-2 pb-4 border-t border-zinc-800/50 pt-2 bg-black/70 backdrop-blur-md -mx-4 md:-mx-6 px-4 md:px-6">
          <div className="flex flex-col space-y-2">
            <a 
              href="#work" 
              onClick={(e) => handleLinkClick(e, 'work')}
              className="text-sm hover:text-gray-400 transition uppercase tracking-wider text-gray-300 py-1 cursor-pointer"
            >
              Trabajos
            </a>
            <a 
              href="#quienes-somos" 
              onClick={(e) => handleLinkClick(e, 'quienes-somos')}
              className="text-sm hover:text-gray-400 transition uppercase tracking-wider text-gray-300 py-1 cursor-pointer"
            >
              Quiénes somos
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="text-sm hover:text-gray-400 transition uppercase tracking-wider text-gray-300 py-1 cursor-pointer"
            >
              Contacto
            </a>
            <a
              href="https://bkspublishing.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold uppercase tracking-wider text-white hover:text-gray-200 transition py-1 cursor-pointer"
            >
              BKS Publishing
            </a>
            
            {/* Mobile Social Icons */}
            <div className="flex items-center space-x-4 pt-2 border-t border-zinc-800/50 mt-1">
              <a href="https://open.spotify.com/playlist/1dM5WSIpE6QKbF9Lcux2sV?si=9f1915845d7040ed" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/_bksmusic/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
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

