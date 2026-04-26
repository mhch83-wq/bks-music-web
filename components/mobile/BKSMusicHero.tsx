"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Cada línea tiene [inicio, fin] del progreso: Somos sube primero, luego Madrid, Mercado, Español
const PARALLAX_PHASES: [number, number][] = [
  [0, 0.38],    // Somos una casa creativa: empieza y termina primero
  [0.12, 0.5],  // Con base en Madrid
  [0.25, 0.65], // Y presencia en el mercado
  [0.4, 1],     // Español y latino: el último
];

/**
 * Parallax manual: Somos sube primero, el resto sigue.
 */
const LERP_SPEED = 0.09;
const INITIAL_LIFT = -58; // Todo el bloque más arriba de inicio (px)

export default function BKSMusicHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentY = useRef<number[]>([INITIAL_LIFT, INITIAL_LIFT, INITIAL_LIFT, INITIAL_LIFT]);

  useEffect(() => {
    if (typeof window === "undefined" || !rootRef.current) return;

    const isMobile = () => window.innerWidth < 768;
    const getMaxY = () => (isMobile() ? 50 : 120);

    const update = () => {
      const root = rootRef.current;
      if (!root || itemRefs.current.length === 0) return;

      const rect = root.getBoundingClientRect();
      const winH = window.innerHeight;
      const rootH = root.offsetHeight;
      const maxY = getMaxY();

      // Parallax empieza más tarde: cuando la sección está ya bien visible/centrada
      const rangeStart = winH * 0.38;
      const rangeEnd = -rootH * 0.4;
      const progress = Math.max(0, Math.min(1, (rangeStart - rect.top) / (rangeStart - rangeEnd)));

      itemRefs.current.forEach((el, i) => {
        if (el) {
          const [phaseStart, phaseEnd] = PARALLAX_PHASES[i];
          const localProgress = Math.max(0, Math.min(1, (progress - phaseStart) / (phaseEnd - phaseStart)));
          const targetY = INITIAL_LIFT - localProgress * maxY;
          const smoothY = currentY.current[i] + (targetY - currentY.current[i]) * LERP_SPEED;
          currentY.current[i] = smoothY;
          el.style.transform = `translate3d(0, ${smoothY}px, 0)`;
        }
      });
    };

    let rafId: number | null = null;
    const tick = () => {
      update();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onResize = () => update();
    window.addEventListener("resize", onResize);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const items = [
    { src: "/somos-una-casa-creativa.png", alt: "Somos una casa creativa" },
    { src: "/con-base-en-madrid.png", alt: "Con base en Madrid" },
    { src: "/y-presencia-en-el-mercado.png", alt: "Y presencia en el mercado" },
    { src: "/espanol-y-latino.png", alt: "Español y latino" },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-16 md:pt-32 relative z-10">
      <div ref={rootRef} className="flex flex-col items-center gap-8 md:gap-14">
        {items.map((item, i) => (
          <div
            key={item.alt}
            ref={(el) => { itemRefs.current[i] = el; }}
            id="somos-casa-creativa" className="w-full flex justify-center"
            style={{ zIndex: 10 + i * 10, willChange: "transform", transform: `translate3d(0, ${INITIAL_LIFT}px, 0)` }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={1200}
              height={400}
              className="w-full h-auto object-contain brightness-0 invert drop-shadow-2xl"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}
