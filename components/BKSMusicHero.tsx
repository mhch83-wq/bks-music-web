"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

/**
 * [!!!] COMPONENTE PROTEGIDO (INTRO ORIGINAL COMPLETA) [!!!]
 * CONTIENE LAS 4 IMÁGENES ORIGINALES Y SU PARALLAX DEFINITIVO.
 * NO TOCAR NADA EN ESTE ARCHIVO.
 */
export default function BKSMusicHero() {
  const [bgVisible, setBgVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBgVisible(true), 400);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Un solo ScrollTrigger para TODO el bloque: si cada línea usa su propio trigger
    // con starts distintos (145%, 175%…), las de abajo empiezan tarde y parece que
    // "nunca colapsan". Aquí comparten el mismo rango de scroll; solo cambia data-speed.
    const init = () => {
      const root = document.querySelector(".hero-parallax-root");
      if (!root) return;

      const ctx = gsap.context(() => {
        const heroTargets = root.querySelectorAll(".hero-parallax-item");

        heroTargets.forEach((el) => {
          const speed = el.getAttribute("data-speed") || "0";
          if (parseFloat(speed) !== 0) {
            const val = parseFloat(speed);
            gsap.to(el, {
              // Reduced parallax travel for a subtle, non-aggressive effect.
              y: -280 * val,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                // Stretch the scroll window so the collapse happens progressively, not abruptly.
                start: "top 52%",
                end: "bottom -28%",
                scrub: 3.2,
                invalidateOnRefresh: true,
              },
            });
          }
        });
      }, root);

      ScrollTrigger.refresh();

      return ctx;
    };

    let ctx: gsap.Context | undefined;

    const onLoad = () => {
      ctx = init();
    };

    if (document.readyState === "complete") {
      ctx = init();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", onLoad);
      ctx?.revert();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-32 relative z-10">
      {/* Fondo Madrid con tinte apagado y fade-in */}
      <div
        style={{
          position: "absolute",
          top: "-70px",
          bottom: "140px",
          left: "50%",
          width: "100vw",
          opacity: bgVisible ? 0.31 : 0,
          transition: "opacity 2.4s ease-out, transform 2.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
          borderRadius: "0px",
          // Entra desde arriba y se asienta suavemente.
          ...(bgVisible ? { transform: "translateX(-50%) translateY(0px)" } : { transform: "translateX(-50%) translateY(-20px)" }),
          // Desvanece arriba/abajo para evitar cortes duros y que no invada la siguiente sección.
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 18%, rgba(0,0,0,0.9) 68%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 18%, rgba(0,0,0,0.9) 68%, transparent 100%)",
        }}
      >
        <Image
          src="/madrid-bg.png"
          alt=""
          fill
          className="object-cover"
          style={{ filter: "grayscale(20%) brightness(0.95) saturate(0.95)" }}
          priority={false}
          unoptimized
        />
      </div>
      <div className="hero-parallax-root flex flex-col items-center gap-8 md:gap-14 relative z-10">
        
        {/* 01. Somos una casa creativa */}
        <div id="somos-casa-creativa" className="hero-parallax-item w-full flex justify-center" data-speed="0.08" style={{ zIndex: 10 }}>
          <Image
            src="/somos-una-casa-creativa.png"
            alt="Somos una casa creativa"
            width={1200}
            height={400}
            className="w-full h-auto object-contain brightness-0 invert drop-shadow-2xl"
            priority
          />
        </div>

        {/* 02. Con base en Madrid */}
        <div className="hero-parallax-item w-full flex justify-center" data-speed="0.35" style={{ zIndex: 20 }}>
          <Image
            src="/con-base-en-madrid.png"
            alt="Con base en Madrid"
            width={1200}
            height={400}
            className="w-full h-auto object-contain brightness-0 invert drop-shadow-2xl"
          />
        </div>

        {/* 03. Y presencia en el mercado */}
        <div className="hero-parallax-item w-full flex justify-center" data-speed="0.7" style={{ zIndex: 30 }}>
          <Image
            src="/y-presencia-en-el-mercado.png"
            alt="Y presencia en el mercado"
            width={1200}
            height={400}
            className="w-full h-auto object-contain brightness-0 invert drop-shadow-2xl"
          />
        </div>

        {/* 04. Español y latino */}
        <div className="hero-parallax-item w-full flex justify-center" data-speed="1.3" style={{ zIndex: 40 }}>
          <Image
            src="/espanol-y-latino.png"
            alt="Español y latino"
            width={1200}
            height={400}
            className="w-full h-auto object-contain brightness-0 invert drop-shadow-2xl"
          />
        </div>

      </div>
    </div>
  );
}

