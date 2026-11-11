import axios from "axios";
import type {
  PokemonDetails,
  PokemonEntry,
  PokemonListResponse,
} from "../types/pokemon";

export const api = axios.create({ baseURL: "https://pokeapi.co/api/v2/" });

/** Alternate forms (megas, regional variants…) use ids starting at 10001. */
const FORM_ID_START = 10000;

let allPokemonRequest: Promise<PokemonEntry[]> | null = null;

/**
 * PokéAPI has no search endpoint, so the whole name list (~100 KB) is loaded
 * once and paged/filtered on the client. The promise is shared so concurrent
 * callers (e.g. StrictMode's double effect) reuse one request.
 */
export function getAllPokemon() {
  allPokemonRequest ??= api
    .get<PokemonListResponse>("pokemon", { params: { limit: 100_000 } })
    .then(({ data }) =>
      data.results
        .map((item) => ({ ...item, id: getIdFromUrl(item.url) }))
        .filter((pokemon) => pokemon.id < FORM_ID_START),
    )
    .catch((error) => {
      allPokemonRequest = null; // allow retrying
      throw error;
    });
  return allPokemonRequest;
}

const detailsRequests = new Map<string, Promise<PokemonDetails>>();
const detailsCache = new Map<string, PokemonDetails>();

/** Cached by URL, so the card and the modal share the same request. */
export function getPokemonDetails(url: string) {
  let request = detailsRequests.get(url);
  if (!request) {
    request = api
      .get<PokemonDetails>(url)
      .then(({ data }) => {
        detailsCache.set(url, data);
        return data;
      })
      .catch((error) => {
        detailsRequests.delete(url); // allow retrying
        throw error;
      });
    detailsRequests.set(url, request);
  }
  return request;
}

/** Synchronous read of already-loaded details. */
export function peekPokemonDetails(url: string) {
  return detailsCache.get(url) ?? null;
}

function getIdFromUrl(url: string) {
  return Number(url.split("/").filter(Boolean).at(-1));
}
