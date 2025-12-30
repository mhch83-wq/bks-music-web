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
  const [activeHeroBg, setActiveHeroBg] = useState<string>("bg20");
  const [heroImageShifted, setHeroImageShifted] = useState(false);
  
  // Prevenir scroll automático en mobile cuando hay hash en la URL
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
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
    // Para Hero H (bg20): logos de compañías suben después de 1.5s (después del overlay texto)
    // Para otros heroes: mantener la lógica original
    const checkAndShift = () => {
      if (activeHeroBg === "bg20") {
        // Hero H: logos suben después de 1.5s
        const shiftTimer = setTimeout(() => {
          setSectionsShifted(true);
        }, 1500);
        return shiftTimer;
      } else {
        const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
        const delay = isDesktop ? 500 : 1500;
        const shiftTimer = setTimeout(() => {
          setSectionsShifted(true);
        }, delay);
        return shiftTimer;
      }
    };
    
    const shiftTimer = checkAndShift();

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
          marginTop: sectionsShifted ? (activeHeroBg === "bgMobileGemini" ? '-75vh' : activeHeroBg === "bg20" ? '-300px' : '-140px') : (activeHeroBg === "bgMobileGemini" ? '100vh' : '0'),
          transform: heroImageShifted && activeHeroBg === "bgMobileGemini" ? 'translateY(-50vh)' : 'translateY(0)',
          transitionTimingFunction: heroImageShifted && activeHeroBg === "bgMobileGemini" ? 'cubic-bezier(0.4, 0, 0.2, 1)' : undefined
        }}
      >
        <CompaniesLogos />
        <div className={activeHeroBg === "bgMobileGemini" ? "-mt-12 md:mt-0" : activeHeroBg === "bg20" ? "-mt-16 md:mt-0" : ""}>
          <ArtistsSection />
        </div>
        {/* Línea divisoria solo en móvil - más corta */}
        <div className="md:hidden flex justify-center my-4">
          <div className="border-t border-gray-700/50 w-[12%]"></div>
        </div>
        <Stats />
        {/* Línea divisoria solo en móvil */}
        <div className="md:hidden border-t border-gray-700/50 my-4"></div>
        <BKSMusic />
        {/* Línea divisoria entre Quiénes somos y Trabajos */}
        <div className="border-t border-gray-700/50 mt-2 mb-4"></div>
        <WorkGrid />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}

