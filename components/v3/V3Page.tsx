"use client";

import { useEffect, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import Image from "next/image";
import ArtistsSection from "@/components/ArtistsSection";
import VideoWall from "@/components/VideoWall";
import V3Navigation from "@/components/v3/V3Navigation";
import V3Hero from "@/components/v3/V3Hero";
import V3BKSMusic from "@/components/v3/V3BKSMusic";

const companyLogos = [
  "/68f66a06e7239ae98c8f36d1_warner-chappell-music-inc-logo white.png",
  "/68f66b8d03ca72fdeced9ab0_pngfind.com-sony-logo-png-1211975.png",
  "/68f66321174fa3b870a1c008_Universal Music Logo White.png",
  "/68f66a5674e5fb221370c297_sony-music-publishing-logo.webp",
  "/68f66356e9f1630e92f99943_WMG_BIG.D.svg",
  "/68f6671e26206e3362c351d0_peer-music-logo.png",
  "/68f66c0eba18d76f93d93420_atresmedia logo.png",
  "/68f663cc69c0ce2cd1863f1d_TL5.MC_BIG.D.svg",
  "/68f666e27a2ffc0d86a44292_image_2025-10-20_184417679.png",
  "/Logo movistar plus.png",
  "/onerpm-logo.png",
];

interface V3PageProps {
  activeHeroBg: string;
  setActiveHeroBg: Dispatch<SetStateAction<string>>;
  scrollY: number;
  videoWallVisible: boolean;
  contentLoaded: boolean;
  sectionsShifted: boolean;
  isDesktop: boolean;
  artistsSectionTop: number;
  artistsVersion: string;
  setArtistsVersion: Dispatch<SetStateAction<string>>;
  setArtistsSectionRef: Dispatch<SetStateAction<HTMLDivElement | null>>;
  bksMusicRef: RefObject<HTMLDivElement>;
  videoWallContainerRef: RefObject<HTMLDivElement>;
  onAutoScrollRequest: (offsetPx: number) => void;
  onScrollCueGentleRequest?: () => void;
}

export default function V3Page({
  activeHeroBg,
  setActiveHeroBg,
  scrollY,
  videoWallVisible,
  contentLoaded,
  sectionsShifted,
  isDesktop,
  artistsSectionTop,
  artistsVersion,
  setArtistsVersion,
  setArtistsSectionRef,
  bksMusicRef,
  videoWallContainerRef,
  onAutoScrollRequest,
  onScrollCueGentleRequest,
}: V3PageProps) {
  const [videoWallReveal, setVideoWallReveal] = useState(false);

  useEffect(() => {
    if (!contentLoaded) {
      setVideoWallReveal(false);
      return;
    }
    const t = window.setTimeout(() => setVideoWallReveal(true), 850);
    return () => window.clearTimeout(t);
  }, [contentLoaded]);

  return (
    <>
      <V3Navigation activeHeroBg={activeHeroBg} pageVersion="v3" />
      <div
        className="relative"
        style={{
          transform: `translate3d(0, -${scrollY * 0.4}px, 0)`,
          willChange: "transform",
          transition: "none",
        }}
      >
        <V3Hero
          onActiveBgChange={setActiveHeroBg}
          currentHeroId={activeHeroBg}
          pageVersion="v3"
          videoWallVisible={videoWallVisible}
          hideBackground={true}
          onScrollCueRequest={onAutoScrollRequest}
          onScrollCueGentleRequest={onScrollCueGentleRequest}
        />
      </div>

      <div
        className={`${contentLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[50vh]"}`}
        style={{
          opacity: contentLoaded ? 1 : 0,
          transform: "translateY(-40px)",
          transition: "transform 2.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1.5s ease-out",
        }}
      >
        <div
          className="transition-all duration-1000 ease-in-out"
          style={{
            marginTop: sectionsShifted ? "0px" : isDesktop ? "40px" : "0",
          }}
        >
          <div
            ref={videoWallContainerRef}
            className="relative z-10 w-full"
            style={{
              marginTop: "-19vh",
              opacity: videoWallReveal ? 1 : 0,
              transform: videoWallReveal ? "translate3d(0,0,0)" : "translate3d(0,280px,0)",
              filter: videoWallReveal ? "brightness(1)" : "brightness(0)",
              transition:
                "opacity 2.1s cubic-bezier(0.22, 1, 0.36, 1), transform 2.8s cubic-bezier(0.18, 1, 0.3, 1), filter 1.9s ease-out",
              willChange: "opacity, transform, filter",
            }}
          >
            <VideoWall />
          </div>

          <div className="relative z-10 mx-auto mb-8 mt-10 flex w-full flex-col items-center px-8 md:px-16 md:mb-10 md:mt-12">
            <p className="mb-5 text-[9px] font-light uppercase tracking-wider text-white/60">
              TRUSTED BY
            </p>
            {[companyLogos.slice(0, 5), companyLogos.slice(5)].map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="flex w-full items-center justify-center gap-x-6 md:gap-x-10"
                style={{
                  marginBottom: rowIdx === 0 ? "24px" : "0",
                  transform: rowIdx === 1 ? "translateX(18px)" : "translateX(70px)",
                }}
              >
                {row.map((src, i) => {
                  const idx = rowIdx === 0 ? i : i + 5;
                  const isAtresmedia = idx === 6 || src.includes("atresmedia");
                  const isUltraMusic = idx === 8 || src.includes("image_2025-10-20");
                  const isMediaset = idx === 7 || src.includes("TL5");
                  const isMovistarPlus = idx === 9 || src.includes("movistar") || src.includes("Movistar");
                  const isPeerMusic = idx === 5 || src.includes("peer");
                  const isSonyMusic = idx === 1;
                  const isOnerpm = idx === 10 || src.includes("onerpm");

                  const logoStyle = isMediaset
                    ? { filter: "brightness(0) invert(1)", opacity: 0.82 }
                    : isAtresmedia || isUltraMusic
                      ? { filter: "invert(1)", opacity: 0.75 }
                      : isOnerpm
                        ? { filter: "invert(1)", mixBlendMode: "screen" as const, opacity: 0.82 }
                        : { filter: "brightness(0) invert(1)", opacity: 0.75 };

                  return (
                    <div
                      key={`${src}-${idx}`}
                      className="relative flex-shrink-0 scale-[1.12] transition-all duration-500 ease-out hover:scale-[1.15] hover:brightness-125 cursor-default"
                      style={{
                        height: isMovistarPlus ? "28px" : isMediaset ? "48px" : isSonyMusic ? "72px" : isPeerMusic ? "58px" : isOnerpm ? "46px" : "54px",
                        width: isMovistarPlus ? "68px" : isMediaset ? "122px" : isSonyMusic ? "170px" : isAtresmedia ? "164px" : isPeerMusic ? "128px" : isOnerpm ? "130px" : "134px",
                      }}
                    >
                      <Image
                        src={src}
                        alt={`company logo ${idx + 1}`}
                        fill
                        className="object-contain"
                        style={logoStyle}
                        unoptimized={idx === 7 || idx === 9 || idx === 10}
                      />
                    </div>
                  );
                })}
                {/* Spacer invisible para igualar fila 1 (5 logos) a 6 */}
                {rowIdx === 0 && (
                  <div className="flex-shrink-0" style={{ height: "54px", width: "134px", visibility: "hidden" }} />
                )}
              </div>
            ))}
          </div>

          <div
            ref={setArtistsSectionRef}
            className="relative"
            style={{
              marginTop: isDesktop ? "calc(60vh - 355px)" : "calc(55vh - 355px)",
              transform:
                typeof window !== "undefined" && artistsSectionTop > 0
                  ? `translate3d(0, -${scrollY * 0.085 + Math.max(0, (scrollY - artistsSectionTop + window.innerHeight * 0.5) * 0.115)}px, 0)`
                  : `translate3d(0, -${scrollY * 0.085}px, 0)`,
              willChange: "transform",
              zIndex: 5,
            }}
          >
            <ArtistsSection
              activeHeroBg={activeHeroBg}
              artistsVersion={artistsVersion}
              onArtistsVersionChange={setArtistsVersion}
              pageVersion="v3"
            />
          </div>

          <div
            className="relative z-10"
            style={{
              transform:
                typeof window !== "undefined" && artistsSectionTop > 0
                  ? `translate3d(0, -${scrollY * 0.085 + Math.max(0, (scrollY - artistsSectionTop + window.innerHeight * 0.5) * 0.115)}px, 0)`
                  : `translate3d(0, -${scrollY * 0.085}px, 0)`,
              willChange: "transform",
              backgroundColor: "#000000",
              paddingBottom: "2rem",
              marginTop: "-3rem",
            }}
          />

          <div
            className="bg-black relative z-20"
            style={{
              backgroundColor: "black",
              marginTop: "-4rem",
              zIndex: 15,
              position: "relative",
            }}
          >
            <div
              ref={bksMusicRef}
              style={{
                backgroundColor: "transparent",
                marginTop: 0,
                zIndex: 10,
                position: "relative",
              }}
            >
              <V3BKSMusic activeHeroBg={activeHeroBg} version="v3" onAutoScrollRequest={onAutoScrollRequest} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
