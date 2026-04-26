import type { CSSProperties } from "react";

/** Europa Grotesk SH (ExtraBold 800 en globals.css) + Montserrat. Sin var() en la pila (mejor compatibilidad WebKit). */
export const FONT_EUROPA_STACK =
  '"Europa Grotesk SH", Montserrat, system-ui, sans-serif';

/** Solo eje horizontal; ~medio paso más de peso respecto a 0.008em. */
export const BKS_MUSIC_HORIZONTAL_BOLD_STEP: CSSProperties = {
  textShadow: "0.01em 0 0 currentColor, -0.01em 0 0 currentColor",
};
