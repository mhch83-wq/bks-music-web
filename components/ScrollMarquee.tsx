"use client";

import React, { useEffect, useMemo, useRef } from "react";

type ScrollMarqueeProps = {
  text?: string;
  height?: number; // px
  speed?: number;  // px per second (base)
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
};

export default function ScrollMarquee({
  text = "WHO WE ARE",
  height = 60,
  speed = 300,
  bgColor = "#00FFFF",
  textColor = "#0A0A0A",
  borderColor = "white",
}: ScrollMarqueeProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Stats and refs omitted for brevity as they don't change...
  const lastScrollY = useRef<number>(0);
  const lastScrollTime = useRef<number>(0);
  const lastSignificantScrollTime = useRef<number>(0);
  const directionRef = useRef<1 | -1 | 0>(0);
  const targetDirectionRef = useRef<1 | -1 | 0>(0);
  const currentSpeedRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);

  const chunk = useMemo(() => `${text} \u2192\u00A0\u00A0`, [text]);
  const repeated = useMemo(() => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const chunkWidth = 200;
    const repetitionsNeeded = Math.ceil((screenWidth * 3) / chunkWidth);
    const baseRepeat = chunk.repeat(Math.ceil(repetitionsNeeded / 5) + 20); // Asegurar repetición suficiente
    return baseRepeat.repeat(4);
  }, [chunk]);

  useEffect(() => {
    // Scroll logic remains the same
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      // ... existing logic ...
      const y = window.scrollY;
      const scrollDelta = y - lastScrollY.current;
      const now = performance.now();

      if (Math.abs(scrollDelta) > 3) {
        lastSignificantScrollTime.current = now;
        lastScrollTime.current = now;
        if (scrollDelta > 0) targetDirectionRef.current = -1;
        else targetDirectionRef.current = 1;
        lastScrollY.current = y;
      } else {
        lastScrollY.current = y;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    let lastT = performance.now();
    const tick = () => {
      const now = performance.now();
      const delta = (now - lastT) / 1000;
      lastT = now;

      const track = trackRef.current;
      if (track) {
        // ... existing animation logic ...
        const timeSinceLastSignificantScroll = now - lastSignificantScrollTime.current;
        const isScrolling = timeSinceLastSignificantScroll < 500;

        if (isScrolling && targetDirectionRef.current !== 0) {
          // ... movement logic ...
          const smoothing = 0.2;
          const currentDir = directionRef.current;
          const targetDir = targetDirectionRef.current;
          const newDir = currentDir + (targetDir - currentDir) * smoothing;

          directionRef.current = newDir as 1 | -1 | 0;

          const targetSpeed = targetDirectionRef.current * speed;
          const speedSmoothing = Math.abs(currentSpeedRef.current) < Math.abs(targetSpeed) * 0.3 ? 0.3 : 0.15;
          currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * speedSmoothing;

          offsetRef.current += currentSpeedRef.current * delta;

          const trackWidth = track.scrollWidth / 4;
          if (offsetRef.current > 0) offsetRef.current -= trackWidth;
          if (offsetRef.current < -trackWidth) offsetRef.current += trackWidth;

          track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        } else {
          // Deceleration logic
          if (Math.abs(currentSpeedRef.current) > 0.1) {
            currentSpeedRef.current *= 0.97;
            offsetRef.current += currentSpeedRef.current * delta;

            const trackWidth = track.scrollWidth / 4;
            if (offsetRef.current > 0) offsetRef.current -= trackWidth;
            if (offsetRef.current < -trackWidth) offsetRef.current += trackWidth;

            track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
          } else {
            currentSpeedRef.current = 0;
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height,
        background: bgColor,
        borderTop: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
      }}
      aria-label={`${text} marquee`}
    >
      <div
        ref={trackRef}
        className="absolute left-0 top-0 flex h-full items-center whitespace-nowrap"
        style={{
          willChange: "transform",
          fontWeight: 500,
          fontFamily: "'Montserrat', var(--font-montserrat), sans-serif",
          letterSpacing: "0.08em",
          color: textColor,
          fontSize: 20,
          textTransform: "uppercase",
        }}
      >
        <span>{repeated}</span>
      </div>
    </div>
  );
}
