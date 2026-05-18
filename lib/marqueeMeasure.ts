/** Periodo del bucle: ancho del primer bloque de nombres + gap del flex del track. */
export function getMarqueePeriodPx(track: HTMLElement | null): number {
  if (!track || track.children.length < 2) return 0;
  const first = track.children[0] as HTMLElement;
  const style = window.getComputedStyle(track);
  const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
  return first.offsetWidth + gap;
}
