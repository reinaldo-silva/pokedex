import { useCallback, useEffect, useState } from "react";
import { getPokemonDetails, peekPokemonDetails } from "../services/api";
import type { PokemonDetails } from "../types/pokemon";

/** Assumes `url` is stable for the component's lifetime (key components by Pokémon). */
export function usePokemonDetails(url: string) {
  const [details, setDetails] = useState<PokemonDetails | null>(() =>
    peekPokemonDetails(url),
  );
  const [hasError, setHasError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getPokemonDetails(url).then(
      (data) => active && setDetails(data),
      () => active && setHasError(true),
    );
    return () => {
      active = false;
    };
  }, [url, attempt]);

  const retry = useCallback(() => {
    setHasError(false);
    setAttempt((current) => current + 1);
  }, []);

  return { details, hasError, retry };
}
