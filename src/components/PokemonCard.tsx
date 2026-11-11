import { memo, useState, type CSSProperties } from "react";
import pokeballImg from "../assets/images/pokeball.png";
import { usePokemonDetails } from "../hooks/usePokemonDetails";
import {
  formatDexNumber,
  formatName,
  getArtworkUrl,
  getPrimaryColor,
  tint,
} from "../lib/pokemon";
import type { PokemonEntry } from "../types/pokemon";
import { TypeBadge } from "./TypeBadge";

interface PokemonCardProps {
  pokemon: PokemonEntry;
  onSelect: (pokemon: PokemonEntry) => void;
}

export const PokemonCard = memo(function PokemonCard({
  pokemon,
  onSelect,
}: PokemonCardProps) {
  const { details, hasError } = usePokemonDetails(pokemon.url);
  const [imageFailed, setImageFailed] = useState(false);
  const color = getPrimaryColor(details);

  return (
    <button
      type="button"
      onClick={() => onSelect(pokemon)}
      style={{ "--type": color } as CSSProperties}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_48px_-24px_var(--type)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
    >
      {/* Type-tinted glow; fades in once the type is known. */}
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 38%, ${tint(color, 38)}, transparent 70%)`,
          opacity: details ? 1 : 0,
        }}
      />
      <img
        src={pokeballImg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 w-40 opacity-[0.06] grayscale transition duration-700 group-hover:rotate-90"
      />

      <span className="relative font-mono text-xs text-zinc-400">
        {formatDexNumber(pokemon.id)}
      </span>

      <div className="relative mx-auto aspect-square w-full max-w-44">
        <img
          src={imageFailed ? pokeballImg : getArtworkUrl(pokemon.id)}
          alt={pokemon.name}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className={`size-full object-contain drop-shadow-[0_12px_16px_rgb(0_0_0/0.45)] transition duration-300 group-hover:scale-110 ${
            imageFailed ? "scale-50 opacity-40" : ""
          }`}
        />
      </div>

      <h2 className="relative mt-2 truncate text-base font-semibold sm:text-lg text-zinc-50 capitalize">
        {formatName(pokemon.name)}
      </h2>

      <div className="relative mt-2 flex min-h-5 flex-wrap gap-1.5">
        {details ? (
          details.types.map(({ type }) => <TypeBadge key={type.name} type={type.name} />)
        ) : hasError ? (
          <span className="text-xs text-red-300">Erro ao carregar</span>
        ) : (
          <>
            <span className="h-5 w-14 animate-pulse rounded-full bg-white/10" />
            <span className="h-5 w-14 animate-pulse rounded-full bg-white/10" />
          </>
        )}
      </div>
    </button>
  );
});

export function PokemonCardSkeleton() {
  return (
    <div className="flex flex-col rounded-3xl border border-white/5 bg-zinc-900/60 p-4">
      <span className="h-3 w-12 animate-pulse rounded bg-white/10" />
      <div className="mx-auto my-4 aspect-square w-3/4 animate-pulse rounded-full bg-white/5" />
      <span className="h-5 w-24 animate-pulse rounded bg-white/10" />
      <span className="mt-3 h-5 w-14 animate-pulse rounded-full bg-white/10" />
    </div>
  );
}
