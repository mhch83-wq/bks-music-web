/**
 * Fondo ambiental BKS (glows, rejilla, marcas de agua) — compartido entre secciones.
 */
export default function BksAmbientBackdrop({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`.trim()} aria-hidden>
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-fuchsia-500/14 blur-3xl" />
      <div className="absolute right-[-5rem] top-24 h-64 w-64 rounded-full bg-cyan-400/14 blur-3xl" />
      <div className="absolute left-1/2 top-20 h-56 w-[36rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent blur-2xl" />
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.35) 0 1px, transparent 1px 14px), repeating-linear-gradient(-25deg, rgba(255,255,255,0.2) 0 1px, transparent 1px 18px)",
        }}
      />
      <div className="absolute -top-2 left-6 text-[58px] font-black uppercase leading-none tracking-[0.24em] text-white/[0.04] md:text-[88px]">
        BKS
      </div>
      <div className="absolute right-[6%] top-[22%] rotate-[-2deg] text-[48px] font-black uppercase leading-none tracking-[0.24em] text-white/[0.035] md:text-[80px]">
        BKS
      </div>
      <div className="absolute left-[12%] top-[46%] rotate-[1deg] text-[52px] font-black uppercase leading-none tracking-[0.24em] text-white/[0.03] md:text-[84px]">
        BKS
      </div>
      <div className="absolute bottom-[16%] right-[18%] rotate-[-4deg] text-[46px] font-black uppercase leading-none tracking-[0.24em] text-white/[0.03] md:text-[76px]">
        BKS
      </div>
      <div className="absolute bottom-2 left-[40%] rotate-[3deg] text-[40px] font-black uppercase leading-none tracking-[0.24em] text-white/[0.028] md:text-[64px]">
        BKS
      </div>
    </div>
  );
}
