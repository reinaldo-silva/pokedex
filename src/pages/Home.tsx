import { ArrowClockwiseIcon } from "@phosphor-icons/react/dist/csr/ArrowClockwise";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { SmileySadIcon } from "@phosphor-icons/react/dist/csr/SmileySad";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import pokeballImg from "../assets/images/pokeball.png";
import pokemonLogo from "../assets/images/pokemonLogo.png";
import { PokemonCard, PokemonCardSkeleton } from "../components/PokemonCard";
import { PokemonModal } from "../components/PokemonModal";
import { TextInput } from "../components/TextInput";
import { getAllPokemon } from "../services/api";
import type { PokemonEntry } from "../types/pokemon";

const PAGE_SIZE = 24;

function filterPokemon(list: PokemonEntry[], query: string) {
  const q = query.trim().toLowerCase().replace(/^#/, "");
  if (!q) return list;

  const slug = q.replace(/\s+/g, "-");
  const number = /^\d+$/.test(q) ? Number(q) : null;
  return list.filter((p) => p.name.includes(slug) || p.id === number);
}

export function Home() {
  const [allPokemon, setAllPokemon] = useState<PokemonEntry[] | null>(null);
  const [hasError, setHasError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<PokemonEntry | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    getAllPokemon().then(
      (list) => active && setAllPokemon(list),
      () => active && setHasError(true),
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  const filtered = useMemo(
    () => filterPokemon(allPokemon ?? [], query),
    [allPokemon, query],
  );
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Infinite scroll: reveal the next page when the sentinel nears the viewport.
  // `visibleCount` is a dependency so the observer is recreated after each page;
  // if the sentinel is still visible (tall screen) it fires again immediately.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisibleCount((count) => count + PAGE_SIZE);
      },
      { rootMargin: "0px 0px 800px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, visibleCount]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleRetry = () => {
    setHasError(false);
    setAttempt((current) => current + 1);
  };

  const handleCloseModal = useCallback(() => setSelected(null), []);

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[36rem] bg-radial-[ellipse_at_top] from-red-500/15 to-transparent to-70%"
      />

      <PokemonModal pokemon={selected} onClose={handleCloseModal} />

      <header className="sticky top-0 z-10 border-b border-white/5 bg-zinc-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:flex-row sm:py-4 sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-end gap-4">
            <img className="h-10 w-auto sm:h-12" src={pokemonLogo} alt="Pokémon" />
            {allPokemon && (
              <span className="pb-1 text-sm text-zinc-400">
                {allPokemon.length.toLocaleString("pt-BR")} Pokémon
              </span>
            )}
          </div>

          <div className="w-full sm:max-w-sm">
            <TextInput.Root>
              <TextInput.Icon>
                <MagnifyingGlassIcon weight="bold" />
              </TextInput.Icon>
              <TextInput.Input
                type="search"
                value={query}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Busque por nome ou número..."
                aria-label="Buscar Pokémon"
              />
            </TextInput.Root>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        {hasError ? (
          <Message icon={<SmileySadIcon size={48} />}>
            <p>Não foi possível carregar os Pokémon.</p>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-zinc-100 transition hover:bg-white/20"
            >
              <ArrowClockwiseIcon size={16} weight="bold" />
              Tentar novamente
            </button>
          </Message>
        ) : !allPokemon ? (
          <Grid>
            {Array.from({ length: 12 }, (_, i) => (
              <PokemonCardSkeleton key={i} />
            ))}
          </Grid>
        ) : filtered.length === 0 ? (
          <Message icon={<SmileySadIcon size={48} />}>
            <p>Nenhum Pokémon encontrado para “{query.trim()}”.</p>
          </Message>
        ) : (
          <>
            <Grid>
              {visible.map((pokemon) => (
                <PokemonCard key={pokemon.name} pokemon={pokemon} onSelect={setSelected} />
              ))}
            </Grid>

            {hasMore ? (
              <div ref={sentinelRef} className="flex justify-center py-12">
                <img src={pokeballImg} alt="Carregando" className="size-8 animate-spin" />
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-zinc-500">
                {filtered.length === allPokemon.length
                  ? "Você chegou ao fim da Pokédex!"
                  : `${filtered.length} resultado(s)`}
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] sm:gap-5">
      {children}
    </div>
  );
}

function Message({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center text-zinc-400">
      {icon}
      {children}
    </div>
  );
}
