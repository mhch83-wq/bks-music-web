import BksAmbientBackdrop from "@/components/BksAmbientBackdrop";

/**
 * Bloque "QUIENES SOMOS" tras BKSMusicHero (desktop y móvil v3).
 */
export default function QuienesSomosIntroSection({
  hideBackdrop = false,
}: {
  hideBackdrop?: boolean;
}) {
  return (
    <div className="relative z-30 w-full overflow-hidden pb-8 pt-8 md:pb-10 md:pt-10">
      {!hideBackdrop && <BksAmbientBackdrop />}

      <div className="relative mx-auto max-w-5xl px-6 md:px-12">
        <div className="relative flex flex-col gap-6 md:gap-7">
          <span className="text-[11px] font-black uppercase tracking-[0.45em] text-white/40 md:text-xs">
            QUIENES SOMOS
          </span>
          <p className="max-w-4xl text-[16px] font-semibold leading-[1.45] text-white md:max-w-[88%] md:text-[20px]">
            <span className="mr-1 inline-block align-baseline text-[1.34em] font-black tracking-[0.1em] text-white md:text-[1.42em]">
              BKS
            </span>
            nace del trabajo de{" "}
            <a
              href="https://www.instagram.com/manuchalud/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-light text-[0.97em] text-white/70 no-underline transition-colors hover:text-white/90 md:text-[1.03em]"
              style={{
                fontFamily: "var(--font-montserrat)",
                letterSpacing: "-0.055em",
                wordSpacing: "-0.14em",
              }}
            >
              <span className="text-[0.94em] opacity-90">@</span>
              <span>manu chalud</span>
            </a>{" "}
            como <span className="font-normal">compositor y productor</span>, formada por una{" "}
            <span className="text-[0.95em] font-bold text-cyan-300/90">red creativa</span> de compositores y{" "}
            <span className="font-normal">topliners</span>{" "}
            <span className="text-[0.93em] font-semibold text-white/85">que se incorporan a</span>{" "}
            <span className="font-normal">cada</span> proyecto <span className="font-normal">segun lo que</span> la cancion y el artista
            <span className="font-normal"> necesitan</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
