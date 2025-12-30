"use client";

import { useEffect, useState } from "react";

type WorkItem = {
  id: number;
  title: string;
  videoId: string | null;
  thumbnail?: string;
  notes?: string;
};

const works: WorkItem[] = [
  {
    id: 1,
    title: "Work 13",
    videoId: "m0gspTiL6XU",
    thumbnail: "",
  },
  {
    id: 2,
    title: "Guzmen señales",
    videoId: "bkEerZEU_q8",
    thumbnail: "",
  },
  {
    id: 3,
    title: "Tocao",
    videoId: "kchzKOizhGg",
    thumbnail: "",
  },
  {
    id: 4,
    title: "Work 14",
    videoId: "x2Zwc82E76s",
    thumbnail: "",
  },
  {
    id: 5,
    title: "Kalenn ya no hay canción",
    videoId: "BDTBNyLjy4g",
    thumbnail: "",
  },
  {
    id: 6,
    title: "Oscar el ruso la vuelta",
    videoId: "9331gEQXJY4",
    thumbnail: "",
  },
  {
    id: 7,
    title: "Danny romero tranquilote",
    videoId: "d5xT5FUsK-8",
    thumbnail: "",
  },
  {
    id: 8,
    title: "El no soy yo",
    videoId: "yIg0uKHK8JU",
    thumbnail: "https://i.ytimg.com/vi/yIg0uKHK8JU/hqdefault.jpg",
  },
  {
    id: 9,
    title: "Omar Montes Ludmilla",
    videoId: "9DdlKfeFixs",
    thumbnail: "",
  },
  {
    id: 10,
    title: "Adexe la manera",
    videoId: "KvZh672VqRo",
    thumbnail: "",
  },
  {
    id: 11,
    title: "Work 15",
    videoId: "535BU4Bqzl8",
    thumbnail: "",
  },
  {
    id: 12,
    title: "Polo nandez confía",
    videoId: "En_XHFyS0w8",
    thumbnail: "",
  },
  {
    id: 13,
    title: "Work 10",
    videoId: "oC7Tstcl3Ac",
    thumbnail: "",
  },
  {
    id: 14,
    title: "Work 11",
    videoId: "7JSdZAmFpbw",
    thumbnail: "",
  },
  {
    id: 15,
    title: "Work 12",
    videoId: "H3IWhuBUGu4",
    thumbnail: "",
  },
];

export default function WorkGrid() {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [embedOrigin, setEmbedOrigin] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmbedOrigin(window.location.origin);
    }
  }, []);

  return (
    <section id="work" className="pt-2 sm:pt-8 pb-12 sm:pb-16 md:pb-24" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-300">
          TRABAJOS
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {works.map((work) => {
            const isPlaying = playingVideo === work.id;
            const videoId = work.videoId ?? "";
            const isAvailable = videoId.length > 0;
            
            return (
              <div
                key={work.id}
                className={`group relative aspect-video bg-gray-900 rounded-lg overflow-hidden transition-transform duration-300 ease-out ${
                  isAvailable ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                onClick={() => {
                  if (isAvailable) {
                  setPlayingVideo(work.id);
                  }
                }}
                style={{
                  transform: isPlaying ? "scale(1.01)" : "scale(1)",
                }}
                onMouseEnter={(event) => {
                  if (!isPlaying) {
                    event.currentTarget.style.transform = "scale(1.02)";
                  }
                }}
                onMouseLeave={(event) => {
                  if (!isPlaying) {
                    event.currentTarget.style.transform = "scale(1)";
                  }
                }}
              >
                {!isAvailable ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-center px-4">
                    <span className="text-sm font-semibold text-white/90 uppercase tracking-[0.3em] mb-2">Próximamente</span>
                    <p className="text-xs text-white/60 max-w-[220px]">
                      {work.notes ?? "Este vídeo no está disponible en este momento."}
                    </p>
                  </div>
                ) : !isPlaying ? (
                  <>
                    <img
                      src={
                        work.thumbnail && work.thumbnail.length > 0
                          ? work.thumbnail
                          : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                      }
                      alt={work.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback si maxresdefault no existe
                        e.currentTarget.src = work.thumbnail && work.thumbnail.length > 0
                          ? work.thumbnail
                          : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center hover:bg-red-600 transition-colors">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                <iframe
                  key={`${videoId}-${work.id}`}
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1${
                    embedOrigin ? `&origin=${encodeURIComponent(embedOrigin)}` : ""
                  }`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  frameBorder="0"
                  title={work.title}
                  loading="lazy"
                />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

