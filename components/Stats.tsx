"use client";

import { useEffect, useState, useRef } from "react";

const stats = [
  { number: 330, suffix: "M+", label: "Streams en Spotify" },
  { number: 6, suffix: "", label: "Discos Platino" },
  { number: 8, suffix: "", label: "Discos Oro" },
  { number: 40, suffix: "+", label: "Radio Charts" },
  { number: 100, suffix: "+", label: "Artistas" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Easing rápido al principio y suave al final (versión anterior)
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const startAnimation = () => {
      const end = value;
      // Duración según valor para naturalidad (1200–3000 ms)
      const duration = Math.min(3000, 1200 + end * 4);
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeOutExpo(progress);
        // Usamos round para que el final no "salte" tan abrupto
        const current = Math.round(end * eased);
        setDisplayValue(current);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayValue(end);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startAnimation();
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`stat-${value}`);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [value]);

  return (
    <span id={`stat-${value}`} className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-100 tracking-tight">
      {displayValue}{suffix}
    </span>
  );
}

interface StatsProps {
  activeHeroBg?: string;
}

export default function Stats({ activeHeroBg }: StatsProps) {
  return (
    <section data-stats-section className="relative pt-4 pb-8 sm:pt-6 sm:pb-10" style={{ backgroundColor: 'transparent', overflow: 'visible' }}>
      <div className="relative max-w-5xl md:max-w-5xl mx-auto px-4 sm:px-6" style={{ overflow: 'visible' }}>
        <div className="flex flex-wrap justify-center items-baseline gap-x-4 sm:gap-x-6 md:gap-x-4 gap-y-4 sm:gap-y-6" style={{ overflow: 'visible' }}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="relative flex items-baseline gap-x-3"
            >
              {/* Separador vertical entre elementos */}
              {index < stats.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-700/20 to-transparent"></div>
              )}
              
              <div className="flex items-baseline gap-1.5 relative" style={{ overflow: 'visible', paddingTop: '8px' }}>
                {/* Destello platino para el 6 */}
                {stat.number === 6 && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-gray-300/50 to-gray-400/30 blur-md opacity-50" style={{ zIndex: 0, overflow: 'visible' }}></div>
                )}
                {/* Destello oro para el 8 */}
                {stat.number === 8 && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400/50 to-yellow-600/30 blur-md opacity-50" style={{ zIndex: 0, overflow: 'visible' }}></div>
                )}
                <span className="relative" style={{ zIndex: 1 }}>
                  <AnimatedNumber value={stat.number} suffix={stat.suffix} />
                </span>
              </div>
              <div className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-[0.15em] font-light leading-tight">
                {stat.label.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

