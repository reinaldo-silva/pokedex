/** Item returned by the `/pokemon` list endpoint. */
export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

/** List item enriched with the national dex number parsed from its URL. */
export interface PokemonEntry extends PokemonListItem {
  id: number;
}

interface NamedResource {
  name: string;
  url: string;
}

/** Subset of the `/pokemon/{id}` response that the app uses. */
export interface PokemonDetails {
  id: number;
  name: string;
  /** Decimetres. */
  height: number;
  /** Hectograms. */
  weight: number;
  types: { slot: number; type: NamedResource }[];
  abilities: { is_hidden: boolean; slot: number; ability: NamedResource }[];
  stats: { base_stat: number; stat: NamedResource }[];
  sprites: {
    front_default: string | null;
    other: {
      "official-artwork": { front_default: string | null };
    };
  };
}
