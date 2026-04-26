"use client";

import { useEffect, useRef, useState } from "react";

// Lista de videos - archivos .mov desde la carpeta Originales (ya sin los 2 segundos de negro)
const videoFiles = [
  "Adexe y Nau - La Manera.mov",
  "Kalenn - Ya no hay canción.mov",
  "Blas Cantó - Él no soy yo.mov",
  "Carlos Baute - La Mitad.mov",
  "Carlos Baute - Y te pido perdón.mov",
  "Polo Nandez - Tú confía.mov",
  "Danny Romero - Abismo.mov",
  "Danny Romero - De Tranquilote.mov",
  "Gloria Trevi - Medusa.mov",
  "Danny Romero - Tocao.mov",
  "Dj Nano - El Nido.mov",
  "Don Patricio - En otra historia.mov",
  "Carlos Baute Ana Mena - No es para tanto.mov",
  "Guzmen - Señales.mov",
  "Jose Otero - Inviernos en Marte.mov",
  "Carlos Baute.- Muy Loco.mov",
  "Kamilo - Kids in love.mov",
  "Lu Decker - De otro color.mov",
  "Mar Lucas - Lo dejo todo.mov",
  "Maria Luna - Cabrón.mov",
  "Maytane - Miénteme.mov",
  "Miki Nuñez - Entre un millon.mov",
  "Nerea Rodriguez - Señales.mov",
  "Omar Montes - Señales.mov",
  "Bombai - Verano del 19.mov",
  "Ruslana - Lokademas.mov",
  "Sweet California - Guay.mov",
  "Sweet California - Loca.mov",
  "Xuso Jones - Mil pasos.mov",
  "Xuso Jones - Pelis de amor.mov",
];

interface VideoItemProps {
  videoPath: string;
  videoName: string;
  autoPlay?: boolean;
}

function VideoItem({ videoPath, videoName, autoPlay }: VideoItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [wasAutoPlayed, setWasAutoPlayed] = useState(false);

  // Autoplay logic
  useEffect(() => {
    if (autoPlay && videoRef.current && !wasAutoPlayed) {
      videoRef.current.play().catch(() => { });
      setWasAutoPlayed(true);
    }
  }, [autoPlay, wasAutoPlayed]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => { });
    }
  };

  const handleMouseLeave = () => {
    // Solo pausar si NO es el video que se está auto-reproduciendo, 
    // o si el usuario quiere detenerlo manualmente.
    setIsHovered(false);
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
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
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
    <section className="relative w-full pt-4 pb-12 md:pt-6 md:pb-16 overflow-hidden bg-transparent">
      <div className="max-w-[1920px] mx-auto px-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0">
          {videoFiles.map((videoFile, index) => (
            <VideoItem
              key={index}
              videoPath={`/videos/${videoFile}`}
              videoName={videoFile.replace(".mov", "")}
              autoPlay={featuredIndex === index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

