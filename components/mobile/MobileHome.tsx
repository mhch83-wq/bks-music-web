"use client";

import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Hero from "@/components/mobile/Hero";
import BKSMusic from "@/components/mobile/BKSMusic";
import Contact from "@/components/mobile/Contact";
import ArtistsSection from "@/components/mobile/ArtistsSection";
import Footer from "@/components/mobile/Footer";
import VideoWall from "@/components/mobile/VideoWall";
import Navigation from "@/components/mobile/Navigation";
import CompanyLogosBar from "@/components/mobile/CompanyLogosBar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MobileHome() {
  const bksMusicRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const videoWallContainerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    try {
      ScrollTrigger.clearScrollMemory();
    } catch {
      /* noop */
    }

    // Lenis + scroll suave suele fallar en Safari iOS / iPad (pantalla en blanco o scroll roto).
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const skipLenis =
      typeof navigator !== "undefined" &&
      (/iP(ad|hone|od)/.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

    if (skipLenis) {
      lenisRef.current = null;
      return () => {
        lenisRef.current = null;
      };
    }

    let rafId = 0;
    let lenis: InstanceType<typeof Lenis> | null = null;

    try {
      lenis = new Lenis({
        duration: 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.5,
        infinite: false,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", () => {
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          ScrollTrigger.update();
        });
      });

      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
      lenis.scrollTo(0, { immediate: true });
    } catch (e) {
      console.warn("[Lenis] init failed, usando scroll nativo:", e);
      lenisRef.current = null;
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      try {
        lenis?.destroy();
      } catch {
        /* noop */
      }
      lenisRef.current = null;
    };
  }, []);

  const [activeHeroBg, setActiveHeroBg] = useState<string>("hero1");
  const [isDesktop, setIsDesktop] = useState(false);
  const [sectionsShifted, setSectionsShifted] = useState(false);
  const [belowHeroVisible, setBelowHeroVisible] = useState(false);
  const belowHeroStartOffset = "26vh";
  const belowHeroFinalOffset = "-55vh";

  useEffect(() => {
    const el = videoWallContainerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
      checkDesktop();
      window.addEventListener('resize', checkDesktop);
      return () => window.removeEventListener('resize', checkDesktop);
    }
  }, []);

  useEffect(() => {
    const shiftTimer = setTimeout(() => setSectionsShifted(true), 1500);
    return () => clearTimeout(shiftTimer);
  }, [activeHeroBg]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setBelowHeroVisible(true);
      return;
    }

    let revealTimer: number | null = null;
    let fallbackTimer: number | null = null;

    const scheduleReveal = () => {
      if (revealTimer !== null) window.clearTimeout(revealTimer);
      revealTimer = window.setTimeout(() => setBelowHeroVisible(true), 2000);
    };

    const handleHeroLogoReady = () => {
      scheduleReveal();
    };

    window.addEventListener("mobile-hero-logo-ready", handleHeroLogoReady);

    // Fallback defensivo por si el evento no llega.
    fallbackTimer = window.setTimeout(() => setBelowHeroVisible(true), 3400);

    return () => {
      window.removeEventListener("mobile-hero-logo-ready", handleHeroLogoReady);
      if (revealTimer !== null) window.clearTimeout(revealTimer);
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
    };
  }, []);

  const renderPage = () => (
      <>
        <div className="relative bg-black" style={{ backgroundColor: "#000000" }}>
          <Hero onActiveBgChange={setActiveHeroBg} currentHeroId={activeHeroBg} pageVersion="v3" hideBackground={true} />
        </div>

        <div
          className="relative bg-black"
          style={{
            backgroundColor: "#000000",
            marginTop: belowHeroVisible ? belowHeroFinalOffset : belowHeroStartOffset,
            opacity: belowHeroVisible ? 1 : 0,
            transform: belowHeroVisible ? "scale(1)" : "scale(0.985)",
            filter: belowHeroVisible ? "brightness(1)" : "brightness(0)",
            transition: "margin-top 3.8s cubic-bezier(0.2, 0.72, 0.24, 1), opacity 3.1s cubic-bezier(0.2, 0.85, 0.2, 1), transform 3.1s ease-out, filter 2.8s ease-out",
            willChange: "margin-top, opacity, transform, filter",
          }}
        >
          <div
            id="trabajos"
            ref={videoWallContainerRef}
            className="relative bg-black"
            style={{
            backgroundColor: "#000000",
            opacity: 1,
            marginTop: 0,
            }}
          >
            <div style={{ opacity: 1 }}>
              <VideoWall />
            </div>
          </div>
          <div style={{ marginTop: "12px" }}><CompanyLogosBar /></div>

          <div
            className={`transition-all duration-1000 ease-in-out`}
            style={{
              marginTop: sectionsShifted
                ? "0px"
                : isDesktop
                  ? "30px"
                  : "0px",
            }}
          >
            <div
              className="mt-6 relative"
              style={{ zIndex: 15 }}
            >
              <ArtistsSection activeHeroBg={activeHeroBg} artistsVersion="a2" pageVersion="v3" />
            </div>

            <div
              className="relative z-10"
              style={{
                background: "transparent",
                paddingBottom: "0.5rem",
                marginTop: 0,
              }}
            >
            </div>

            <div
              className="bg-black relative"
              style={{
                backgroundColor: 'black',
                marginTop: 0,
                zIndex: 25,
                position: 'relative'
              }}
            >
              <div
                ref={bksMusicRef}
                style={{
                  backgroundColor: 'transparent',
                  marginTop: 0,
                  zIndex: 10,
                  position: 'relative',
                }}
              >
                <BKSMusic activeHeroBg={activeHeroBg} version="v3" />
              </div>


            </div>

            <div
              ref={contactRef}
              style={{
                backgroundColor: '#000000',
                zIndex: 30,
                position: 'relative',
                marginTop: 0,
              }}
            >
              <Contact aboutUsVersion="v3" />
            </div>

            <div
              ref={footerRef}
              style={{
                backgroundColor: '#000000',
                zIndex: 5,
                position: 'relative',
                marginTop: '1.25rem',
              }}
            >
              <Footer aboutUsVersion="v3" />
            </div>
          </div>
        </div>
      </>
    );

  return (
    <main
      className="relative min-h-screen min-h-[100dvh] bg-black text-white"
      style={{ backgroundColor: "#000000", color: "#ffffff" }}
    >
      <Navigation />
      <div
        className="relative z-10 min-h-[100dvh] bg-black text-white"
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
      >
        {renderPage()}
      </div>
    </main>
  );
}
