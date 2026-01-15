"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import CompaniesLogos from "@/components/CompaniesLogos";
import Navigation from "@/components/Navigation";
import BKSMusic from "@/components/BKSMusic";
import WorkGrid from "@/components/WorkGrid";
import Stats from "@/components/Stats";
import Contact from "@/components/Contact";
import ArtistsSection from "@/components/ArtistsSection";
import Footer from "@/components/Footer";

export default function Home() {
  // Siempre usar hero1 (bg20 es el valor que Hero.tsx envía para hero1)
  const [activeHeroBg, setActiveHeroBg] = useState<string>("hero1");
  const [heroImageShifted, setHeroImageShifted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  // Prevenir scroll automático en mobile cuando hay hash en la URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkDesktop = () => {
        setIsDesktop(window.innerWidth >= 768);
      };
      checkDesktop();
      window.addEventListener('resize', checkDesktop);
      
      if (window.innerWidth < 768) {
        // Solo en móvil: prevenir scroll automático al hash
        if (window.location.hash) {
          // Remover el hash de la URL sin hacer scroll
          const hash = window.location.hash;
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
          // Scroll a top inmediatamente
          window.scrollTo(0, 0);
        }
        // Asegurar que la página empiece en el top
        window.scrollTo(0, 0);
      }
      
      return () => window.removeEventListener('resize', checkDesktop);
    }
  }, []);
  const [sectionsShifted, setSectionsShifted] = useState(false);

  // Activar movimiento del hero después de 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroImageShifted(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Hero1: logos de compañías suben después de 1.5s (después del overlay texto)
    // Hero4 guardado para referencia futura - usar misma lógica si se reactiva
    const shiftTimer = setTimeout(() => {
      setSectionsShifted(true);
    }, 1500);

    return () => {
      clearTimeout(shiftTimer);
    };
  }, [activeHeroBg]);

  return (
    <main className="min-h-screen relative bg-black">
      {/* Destello neon sutil que cubre desde logos de empresas hasta trabajos, incluyendo quienes somos */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none" 
        style={{ 
          width: '1800px', 
          height: '200vh', 
          background: 'radial-gradient(ellipse, rgba(0, 255, 255, 0.12) 0%, rgba(0, 255, 200, 0.10) 15%, rgba(100, 200, 255, 0.08) 30%, rgba(150, 200, 255, 0.06) 45%, rgba(200, 220, 255, 0.04) 60%, transparent 80%)', 
          filter: 'blur(120px)',
          zIndex: 1,
          marginTop: '30vh'
        }}
      ></div>
      
      {/* Header */}
      <Navigation activeHeroBg={activeHeroBg} />
      {/* Hero original con video de fondo */}
      <Hero onActiveBgChange={setActiveHeroBg} />
      
      <div 
        className={`transition-all md:duration-[3000ms] duration-[4000ms] ease-in-out ${heroImageShifted && activeHeroBg === "bgMobileGemini" ? 'transition-transform duration-[2000ms] ease-out' : ''}`}
        style={{
          marginTop: sectionsShifted ? (
            isDesktop ? '-340px' : '-380px'
          ) : (
            isDesktop ? '40px' : '0'
          ),
          transform: 'translateY(0)',
          transitionTimingFunction: undefined
        }}
      >
        <CompaniesLogos />
        {/* Hero1 siempre usa -mt-16 md:mt-0 */}
        {/* Hero4 guardado para referencia futura - usaría -mt-24 md:mt-0 si se reactiva */}
        <div className="-mt-16 md:mt-0">
          <ArtistsSection activeHeroBg={activeHeroBg} />
        </div>
        {/* Línea divisoria solo en móvil - más corta */}
        <div className="md:hidden flex justify-center my-4">
          <div className="border-t border-gray-700/50 w-[12%]"></div>
        </div>
        <Stats activeHeroBg={activeHeroBg} />
        {/* Línea divisoria solo en móvil */}
        <div className="md:hidden border-t border-gray-700/50 my-4"></div>
        <BKSMusic activeHeroBg={activeHeroBg} />
        {/* Línea divisoria entre Quiénes somos y Trabajos */}
        <div className="border-t border-gray-700/50 mt-2 mb-4"></div>
        <WorkGrid />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}

