import type { PokemonDetails } from "../types/pokemon";

const ARTWORK_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

/** Artwork URL derived from the id, so cards can show images before details load. */
export function getArtworkUrl(id: number) {
  return `${ARTWORK_BASE}/${id}.png`;
}

export function getSprite(details: PokemonDetails) {
  return (
    details.sprites.other["official-artwork"].front_default ??
    details.sprites.front_default
  );
}

export function formatDexNumber(id: number) {
  return `#${String(id).padStart(4, "0")}`;
}

/** "mr-mime" → "mr mime" (capitalization is done with CSS). */
export function formatName(name: string) {
  return name.replaceAll("-", " ");
}

export const NEUTRAL_COLOR = "#64748b";

const TYPES: Record<string, { label: string; color: string }> = {
  normal: { label: "Normal", color: "#A8A77A" },
  fire: { label: "Fogo", color: "#EE8130" },
  water: { label: "Água", color: "#6390F0" },
  electric: { label: "Elétrico", color: "#F7D02C" },
  grass: { label: "Planta", color: "#7AC74C" },
  ice: { label: "Gelo", color: "#96D9D6" },
  fighting: { label: "Lutador", color: "#C22E28" },
  poison: { label: "Venenoso", color: "#A33EA1" },
  ground: { label: "Terrestre", color: "#E2BF65" },
  flying: { label: "Voador", color: "#A98FF3" },
  psychic: { label: "Psíquico", color: "#F95587" },
  bug: { label: "Inseto", color: "#A6B91A" },
  rock: { label: "Pedra", color: "#B6A136" },
  ghost: { label: "Fantasma", color: "#735797" },
  dragon: { label: "Dragão", color: "#6F35FC" },
  dark: { label: "Sombrio", color: "#705746" },
  steel: { label: "Aço", color: "#B7B7CE" },
  fairy: { label: "Fada", color: "#D685AD" },
};

export function getTypeInfo(type: string) {
  return TYPES[type] ?? { label: formatName(type), color: NEUTRAL_COLOR };
}

/** Color of the primary type, used to tint cards and the modal. */
export function getPrimaryColor(details: PokemonDetails | null) {
  const primary = details?.types.find((t) => t.slot === 1)?.type.name;
  return primary ? getTypeInfo(primary).color : NEUTRAL_COLOR;
}

export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Atq. Esp.",
  "special-defense": "Def. Esp.",
  speed: "Velocidade",
};

/** Highest possible base stat, used to scale the stat bars. */
export const MAX_BASE_STAT = 255;

/** `color` mixed with transparency, e.g. tint("#f00", 20) → 20% red. */
export function tint(color: string, percent: number) {
  return `color-mix(in oklab, ${color} ${percent}%, transparent)`;
}
