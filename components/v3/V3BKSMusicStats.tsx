"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

type StatItem = {
  target: number;
  suffix: string;
  label: string;
  prefix: string;
  iconType: string;
};

const stats: StatItem[] = [
  {
    target: 330,
    suffix: "M",
    label: "SPOTIFY STREAMS",
    prefix: "+",
    iconType: "spotify",
  },
  {
    target: 5,
    suffix: "",
    label: "DISCOS DE PLATINO",
    prefix: "",
    iconType: "platinum",
  },
  {
    target: 6,
    suffix: "",
    label: "DISCOS DE ORO",
    prefix: "",
    iconType: "gold",
  },
  {
    target: 30,
    suffix: "",
    label: "RADIO CHARTS",
    prefix: "+",
    iconType: "radio",
  },
  {
    target: 60,
    suffix: "",
    label: "ARTISTAS",
    prefix: "+",
    iconType: "artists",
  },
];

function StatIcon({ type }: { type: string }) {
  const base = "mt-5 text-white/75 group-hover:text-white transition-colors duration-300";

  switch (type) {
    case "spotify":
      return (
        <svg className={`${base} h-5 w-5`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.378 0 0 5.378 0 12s5.378 12 12 12 12-5.378 12-12S18.622 0 12 0zm5.504 17.311c-.22.359-.684.475-1.043.254-2.825-1.725-6.381-2.112-10.569-1.157-.403.091-.809-.164-.9-.567-.091-.403.164-.809.567-.9 4.573-1.047 8.49-.6 11.66 1.336.359.221.475.684.254 1.043l.031-.007zm1.468-3.262c-.276.45-.858.591-1.308.315-3.225-1.986-8.14-2.559-11.954-1.399-.506.152-1.041-.135-1.194-.641-.152-.506.135-1.041.641-1.194 4.364-1.325 9.775-.675 13.504 1.612.45.276.591.858.311 1.307zM18.9 10.654c-3.874-2.3-10.274-2.512-13.974-1.388-.611.186-1.258-.168-1.444-.779-.186-.611.168-1.258.779-1.444 4.251-1.291 11.315-1.042 15.776 1.606.551.327.73 1.039.403 1.59-.327.551-1.039.73-1.54.415z" />
        </svg>
      );
    case "platinum":
      return (
        <svg className={`${base} h-5 w-5`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 7a5 5 0 0 1 5 5" strokeOpacity="0.4" />
        </svg>
      );
    case "gold":
      return (
        <svg className={`${base} h-5 w-5`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
          <path d="M7 12a5 5 0 0 1 5-5" strokeOpacity="0.4" />
        </svg>
      );
    case "radio":
      return (
        <svg className={`${base} h-5 w-5`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M17 7V3M7 7V5" />
          <circle cx="12" cy="14" r="3" />
        </svg>
      );
    case "artists":
      return (
        <svg className={`${base} h-5 w-5`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          <path d="M9 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" opacity="0.5" transform="translate(6,0)" />
        </svg>
      );
    default:
      return null;
  }
}

export default function V3BKSMusicStats() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    let observer: IntersectionObserver;

    const startCounterAnimation = () => {
      gsap.context(() => {
        gsap.to(".stat-item-v3", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        });

        stats.forEach((stat, i) => {
          const obj = { val: 0 };
          const els = document.querySelectorAll(".counter-value-v3");
          if (els[i]) {
            gsap.to(obj, {
              val: stat.target,
              duration: 2.5,
              delay: 0.2 + i * 0.1,
              ease: "power4.out",
              onUpdate: () => {
                if (els[i]) {
                  els[i].textContent = Math.floor(obj.val).toString();
                }
              },
            });
          }
        });
      });
    };

    if (containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startCounterAnimation();
            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        }
      );

      observer.observe(containerRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-visible bg-transparent pt-16 pb-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="grid grid-cols-2 gap-x-1 gap-y-6 md:grid-cols-3 md:gap-x-2 md:gap-y-8 lg:grid-cols-5 lg:gap-x-2">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item-v3 group flex translate-y-10 flex-col items-center text-center opacity-0">
              <div className="flex items-baseline justify-center whitespace-nowrap px-1 md:px-2">
                {stat.prefix && <span className="mr-0.5 text-2xl font-black text-white md:text-3xl">{stat.prefix}</span>}
                <span className="counter-value-v3 inline-block pr-[0.08em] text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                  0
                </span>
                {stat.suffix && <span className="ml-0.5 text-2xl font-black text-white md:text-3xl">{stat.suffix}</span>}
              </div>
              <p className="mt-3 max-w-[130px] text-[10px] font-black uppercase tracking-[0.3em] text-white/55 md:text-xs">
                {stat.label}
              </p>
              <div className="-mt-1">
                <StatIcon type={stat.iconType} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
