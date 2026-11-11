import { RulerIcon } from "@phosphor-icons/react/dist/csr/Ruler";
import { ScalesIcon } from "@phosphor-icons/react/dist/csr/Scales";
import { SmileySadIcon } from "@phosphor-icons/react/dist/csr/SmileySad";
import { SparkleIcon } from "@phosphor-icons/react/dist/csr/Sparkle";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { usePokemonDetails } from "../hooks/usePokemonDetails";
import {
  formatDexNumber,
  formatName,
  getArtworkUrl,
  getPrimaryColor,
  MAX_BASE_STAT,
  STAT_LABELS,
  tint,
} from "../lib/pokemon";
import type { PokemonDetails, PokemonEntry } from "../types/pokemon";
import { TypeBadge } from "./TypeBadge";

interface PokemonModalProps {
  pokemon: PokemonEntry | null;
  onClose: () => void;
}

/**
 * Native <dialog> opened with showModal(): gives focus trapping, Escape to
 * close and the ::backdrop for free. Page scroll is locked in global.css.
 */
export function PokemonModal({ pokemon, onClose }: PokemonModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (pokemon && !dialog.open) dialog.showModal();
    if (!pokemon && dialog.open) dialog.close();
  }, [pokemon]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // A click whose target is the <dialog> itself landed on the backdrop.
      onClick={(event) => event.target === event.currentTarget && onClose()}
      aria-labelledby="pokemon-modal-title"
      className="m-auto w-[min(100%-2rem,46rem)] max-w-none overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-0 text-zinc-100 shadow-2xl transition-[opacity,scale] duration-200 backdrop:bg-black/70 backdrop:backdrop-blur-sm starting:open:scale-95 starting:open:opacity-0"
    >
      {pokemon && (
        <PokemonModalContent key={pokemon.name} pokemon={pokemon} onClose={onClose} />
      )}
    </dialog>
  );
}

function PokemonModalContent({
  pokemon,
  onClose,
}: {
  pokemon: PokemonEntry;
  onClose: () => void;
}) {
  const { details, hasError, retry } = usePokemonDetails(pokemon.url);
  const color = getPrimaryColor(details);

  return (
    <div className="max-h-[90dvh] overflow-y-auto" style={{ "--type": color } as CSSProperties}>
      <header
        className="relative flex flex-col items-center px-6 pt-8 transition-colors"
        style={{ background: `linear-gradient(to bottom, ${tint(color, 50)}, transparent)` }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 cursor-pointer rounded-full bg-black/30 p-2 text-zinc-100 transition hover:bg-black/50 focus-visible:outline-2 focus-visible:outline-red-400"
        >
          <XIcon size={20} weight="bold" />
        </button>

        <span className="font-mono text-sm text-zinc-300">
          {formatDexNumber(pokemon.id)}
        </span>
        <h2
          id="pokemon-modal-title"
          className="mt-1 text-center text-3xl font-bold capitalize sm:text-4xl"
        >
          {formatName(pokemon.name)}
        </h2>
        <div className="mt-3 flex min-h-7 gap-2">
          {details?.types.map(({ type }) => (
            <TypeBadge key={type.name} type={type.name} size="md" />
          ))}
        </div>
        <img
          src={getArtworkUrl(pokemon.id)}
          alt={pokemon.name}
          className="mt-2 size-56 object-contain drop-shadow-[0_20px_24px_rgb(0_0_0/0.5)] sm:size-64"
        />
      </header>

      {hasError ? (
        <div className="flex flex-col items-center gap-3 px-6 pb-10 text-zinc-400">
          <SmileySadIcon size={40} />
          <p>Não foi possível carregar os detalhes.</p>
          <button
            type="button"
            onClick={retry}
            className="cursor-pointer rounded-full bg-white/10 px-4 py-2 text-sm text-zinc-100 transition hover:bg-white/20"
          >
            Tentar novamente
          </button>
        </div>
      ) : details ? (
        <DetailsBody details={details} />
      ) : (
        <DetailsSkeleton />
      )}
    </div>
  );
}

function DetailsBody({ details }: { details: PokemonDetails }) {
  const total = details.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
  const abilities = [...details.abilities].sort((a, b) => a.slot - b.slot);

  return (
    <div className="grid gap-8 px-6 pt-4 pb-8 sm:grid-cols-2">
      <section className="flex flex-col gap-6">
        <div>
          <SectionTitle>Sobre</SectionTitle>
          <dl className="grid grid-cols-2 gap-3">
            <InfoTile
              icon={<RulerIcon size={18} />}
              label="Altura"
              value={`${(details.height / 10).toLocaleString("pt-BR")} m`}
            />
            <InfoTile
              icon={<ScalesIcon size={18} />}
              label="Peso"
              value={`${(details.weight / 10).toLocaleString("pt-BR")} kg`}
            />
          </dl>
        </div>

        <div>
          <SectionTitle>Habilidades</SectionTitle>
          <ul className="flex flex-wrap gap-2">
            {abilities.map(({ ability, is_hidden }) => (
              <li
                key={ability.name}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm capitalize"
              >
                {formatName(ability.name)}
                {is_hidden && (
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-400 normal-case">
                    <SparkleIcon size={12} weight="fill" /> oculta
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <SectionTitle>Status base</SectionTitle>
        <dl className="flex flex-col gap-2.5">
          {details.stats.map(({ stat, base_stat }) => (
            <StatBar
              key={stat.name}
              label={STAT_LABELS[stat.name] ?? stat.name}
              value={base_stat}
            />
          ))}
          <div className="mt-1 grid grid-cols-[5.5rem_2.5rem_1fr] items-center gap-3 border-t border-white/10 pt-3 text-sm">
            <dt className="text-zinc-400">Total</dt>
            <dd className="text-right font-semibold tabular-nums">{total}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[5.5rem_2.5rem_1fr] items-center gap-3 text-sm">
      <dt className="text-zinc-400">{label}</dt>
      <dd className="text-right font-medium tabular-nums">{value}</dd>
      <dd className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full w-(--value) rounded-full bg-(--type) transition-[width] duration-700 ease-out starting:w-0"
          style={{ "--value": `${(value / MAX_BASE_STAT) * 100}%` } as CSSProperties}
        />
      </dd>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <dt className="flex items-center gap-1.5 text-xs text-zinc-400">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold">{value}</dd>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
      {children}
    </h3>
  );
}

function DetailsSkeleton() {
  return (
    <div className="grid gap-8 px-6 pt-4 pb-8 sm:grid-cols-2">
      <div className="grid grid-cols-2 gap-3 self-start">
        <div className="h-18 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-18 animate-pulse rounded-2xl bg-white/5" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-white/5" />
        ))}
      </div>
    </div>
  );
}
