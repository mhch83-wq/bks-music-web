import { ARTISTS_IN_ORDER } from "@/lib/artistsOrdered";

/** Primera fila móvil: Ana Mena arriba; sin Lérica ni Carlos Baute. */
const MOBILE_ROW1 = [
  "Omar Montes",
  "Chino & Nacho",
  "Ana Mena",
  "Juan Magán",
  "Álex Ubago",
  "Micro TDH",
] as const;

/** Segunda fila móvil: Lérica y Carlos Baute al inicio. */
const MOBILE_ROW2 = [
  "Lérica",
  "Carlos Baute",
  "Zion & Lennox",
  "Ludmilla",
  "Don Patricio",
  "Coti",
] as const;

/**
 * Reparto de artistas solo para la marquesina móvil (desktop usa ARTISTS_IN_ORDER tal cual).
 */
export function getMobileArtistLines(): string[][] {
  const pinned = new Set<string>([...MOBILE_ROW1, ...MOBILE_ROW2]);
  const rest = ARTISTS_IN_ORDER.filter((name) => !pinned.has(name));

  const lines: string[][] = [[...MOBILE_ROW1], [...MOBILE_ROW2]];
  for (let i = 0; i < rest.length; i += 6) {
    lines.push(rest.slice(i, i + 6));
  }
  return lines;
}
