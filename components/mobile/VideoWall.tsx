"use client";

import { useEffect, useRef, useState } from "react";
import { videoFiles } from "@/lib/videoFiles";

interface VideoItemProps {
  videoPath: string;
  posterPath: string;
  autoPlay?: boolean;
  /** Solo el video destacado usa preload auto; el resto metadata para no saturar el decodificador en móvil */
  preloadFull?: boolean;
}

function VideoItem({ videoPath, posterPath, autoPlay, preloadFull }: VideoItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [wasAutoPlayed, setWasAutoPlayed] = useState(false);

  // Autoplay logic
  useEffect(() => {
    if (autoPlay && videoRef.current && !wasAutoPlayed) {
      videoRef.current.play().catch(() => { });
      setWasAutoPlayed(true);
    }
  }, [autoPlay, wasAutoPlayed]);

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => { });
    }
  };

  const handleMouseLeave = () => {
    // Solo pausar si NO es el video que se está auto-reproduciendo, 
    // o si el usuario quiere detenerlo manualmente.
    const video = videoRef.current;
    if (video) {
      // Si se auto-reprodujo, lo dejamos sonar/girar al menos una vez? 
      // O seguimos el comportamiento normal de pausa.
      // Siguiendo el comportamiento de videowall:
      video.pause();
      video.currentTime = 0.1;
    }
  };

  return (
    <div
      className="relative w-full aspect-video overflow-hidden cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ backgroundColor: "#000" }}
    >
      <video
        ref={videoRef}
        src={videoPath}
        poster={posterPath}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        preload={preloadFull ? "auto" : "metadata"}
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (video && !autoPlay) {
            video.currentTime = 0.1;
          }
        }}
      />
    </div>
  );
}

export default function VideoWall() {
  const [featuredIndex, setFeaturedIndex] = useState<number | null>(null);

  useEffect(() => {
    // ÍNDICES:
    // 2: Blas Cantó - Él no soy yo
    // 3: Carlos Baute - La Mitad
    // 9: Danny Romero - Tocao
    const pool = [2, 3, 9];
    const randomIndex = pool[Math.floor(Math.random() * pool.length)];

    // El videowall termina de subir a los 3s (0.5s delay + 2.5s transicion en page.tsx)
    const timer = setTimeout(() => {
      setFeaturedIndex(randomIndex);
    }, 1800); // Se inicia antes, mientras el videowall está subiendo.

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="video-wall-rise relative w-full pt-0 pb-12 md:pt-0 md:pb-16 bg-transparent">
      <div className="max-w-[1920px] mx-auto px-0">
        <div className="grid grid-cols-5 gap-0">
          {videoFiles.slice(0, 25).map((videoFile, index) => (
            <VideoItem
              key={index}
              videoPath={`/videos/${videoFile}`}
              posterPath={`/posters/${videoFile.replace(".mov", ".jpg")}`}
              autoPlay={featuredIndex === index}
              preloadFull={featuredIndex === index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

