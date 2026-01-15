"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const logos = [
  "/68f66a06e7239ae98c8f36d1_warner-chappell-music-inc-logo white.png", // 01
  "/68f66b8d03ca72fdeced9ab0_pngfind.com-sony-logo-png-1211975.png",     // 02
  "/68f66321174fa3b870a1c008_Universal Music Logo White.png",            // 03
  "/68f66a5674e5fb221370c297_sony-music-publishing-logo.webp",           // 04
  "/68f66356e9f1630e92f99943_WMG_BIG.D.svg",                             // 05
  "/68f6671e26206e3362c351d0_peer-music-logo.png",                       // 06
  "/68f66c0eba18d76f93d93420_atresmedia logo.png",                       // 07
  "/68f663cc69c0ce2cd1863f1d_TL5.MC_BIG.D.svg",                          // 08
  "/68f666e27a2ffc0d86a44292_image_2025-10-20_184417679.png",            // 09
];

export default function CompaniesLogos() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isShifted, setIsShifted] = useState(false);

  useEffect(() => {
    // Trigger visibility shortly after mount to ensure they are visible during the slide-up animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Sincronizar con la animación del contenedor padre
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    const delay = isDesktop ? 500 : 1500;
    const shiftTimer = setTimeout(() => {
      setIsShifted(true);
    }, delay);

    return () => {
      clearTimeout(timer);
      clearTimeout(shiftTimer);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-companies-section
      className={`relative pb-0 md:pb-6 sm:pb-8 overflow-hidden min-h-[200px] md:mt-0 ${isShifted ? 'shifted' : ''}`}
      style={{ zIndex: 2, backgroundColor: 'transparent' }}
    >
      <style jsx>{`
        @media (max-width: 767px) {
          section[data-companies-section] {
            position: relative;
            transition: margin-top 4s ease-in-out, transform 4s ease-in-out;
          }
          section[data-companies-section].shifted {
            margin-top: -12rem !important;
            transform: translateY(-3rem) !important;
          }
        }
      `}</style>
      <style jsx>{`
        @media (min-width: 768px) {
          section[data-companies-section] {
            padding-top: 2rem !important;
          }
        }
      `}</style>


      {/* Fondo transparente para que el degradado se vea igual que en otras secciones */}
      <div className="absolute inset-0 z-0 bg-transparent"></div>

      <div className="relative max-w-[240px] sm:max-w-lg md:max-w-6xl mx-auto px-0 sm:px-6" style={{ zIndex: 2 }}>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-0 gap-y-3 sm:gap-4 md:gap-x-0 md:gap-y-8 items-center justify-items-center">
          {logos.map((src, idx) => (
            <div
              key={idx}
              className={`h-9 w-14 sm:h-10 sm:w-24 md:h-12 md:w-32 relative hover:scale-105 company-logo ${isVisible ? 'logo-appear' : 'logo-start-hidden'
                }`}
            >
              <Image src={src} alt="company logo" fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .company-logo {
          opacity: 0;
        }
        .company-logo.logo-start-hidden {
          opacity: 0;
          visibility: hidden;
        }
        .company-logo.logo-appear {
          visibility: visible;
          animation: companyLogoFadeIn 3s ease-in-out forwards;
        }
        @keyframes companyLogoFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.8;
          }
        }
      `}</style>
    </section>
  );
}


