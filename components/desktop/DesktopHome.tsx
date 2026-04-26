"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Lenis from 'lenis';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import V3Page from "@/components/v3/V3Page";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DesktopHome() {
  const bksMusicRef = useRef<HTMLDivElement>(null);
  const videoWallContainerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
      ScrollTrigger.clearScrollMemory();
    }

    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.update();
      });
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenis.scrollTo(0, { immediate: true });

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const [activeHeroBg, setActiveHeroBg] = useState<string>("hero1");
  const [artistsVersion, setArtistsVersion] = useState<string>("a2");
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [videoWallVisible, setVideoWallVisible] = useState(false);
  const [sectionsShifted, setSectionsShifted] = useState(false);
  const [artistsSectionRef, setArtistsSectionRef] = useState<HTMLDivElement | null>(null);
  const [artistsSectionTop, setArtistsSectionTop] = useState<number>(0);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVideoWallVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (videoWallContainerRef.current) {
      observer.observe(videoWallContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);

      const scrollTimer = setTimeout(() => {
        window.scrollTo(0, 0);
        setScrollY(0);
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        }
      }, 50);

      setTimeout(() => setContentLoaded(true), 500);

      return () => clearTimeout(scrollTimer);
    }
  }, []);

  useEffect(() => {
    if (artistsSectionRef && typeof window !== 'undefined') {
      const updatePosition = () => {
        const rect = artistsSectionRef.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setArtistsSectionTop(rect.top + scrollTop);
      };
      setTimeout(updatePosition, 100);
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [artistsSectionRef]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
      checkDesktop();
      window.addEventListener('resize', checkDesktop);
      return () => window.removeEventListener('resize', checkDesktop);
    }
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          rafId = null;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (contentLoaded) {
      window.scrollTo(0, 0);
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [contentLoaded]);

  useEffect(() => {
    const shiftTimer = setTimeout(() => setSectionsShifted(true), 1500);
    return () => clearTimeout(shiftTimer);
  }, [activeHeroBg]);

  const handleAutoScrollRequest = useCallback((offsetPx: number) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(window.scrollY + offsetPx, {
        duration: 0.75,
        easing: (t) => Math.sin((t * Math.PI) / 2),
      });
    } else {
      window.scrollBy({ top: offsetPx, behavior: "smooth" });
    }
  }, []);

  const handleScrollCueGentleRequest = useCallback(() => {
    const offsetPx = 200;
    const easing = (t: number) => {
      if (t < 0.3) {
        const s = t / 0.3;
        return 0.5 * s * s * s;
      }
      const s = (t - 0.3) / 0.7;
      return 0.5 + 0.5 * (1 - Math.pow(1 - s, 4));
    };
    if (lenisRef.current) {
      lenisRef.current.scrollTo(window.scrollY + offsetPx, {
        duration: 4.0,
        easing,
      });
    } else {
      const startY = window.scrollY;
      const targetY = startY + offsetPx;
      const duration = 3200;
      const startTime = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = easing(t);
        window.scrollTo(0, startY + (targetY - startY) * eased);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, []);

  return (
    <main className="min-h-screen relative bg-black">
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
      />

      <V3Page
        activeHeroBg={activeHeroBg}
        setActiveHeroBg={setActiveHeroBg}
        scrollY={scrollY}
        videoWallVisible={videoWallVisible}
        contentLoaded={contentLoaded}
        sectionsShifted={sectionsShifted}
        isDesktop={isDesktop}
        artistsSectionTop={artistsSectionTop}
        artistsVersion={artistsVersion}
        setArtistsVersion={setArtistsVersion}
        setArtistsSectionRef={setArtistsSectionRef}
        bksMusicRef={bksMusicRef}
        videoWallContainerRef={videoWallContainerRef}
        onAutoScrollRequest={handleAutoScrollRequest}
        onScrollCueGentleRequest={handleScrollCueGentleRequest}
      />
    </main>
  );
}
