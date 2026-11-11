# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start the Vite dev server
- `pnpm typecheck` — run `tsc -b` (project references: `tsconfig.app.json` for `src/`, `tsconfig.node.json` for `vite.config.ts`)
- `pnpm build` — type-check, then build with Vite
- `pnpm preview` — serve the production build

The package manager is pnpm (`pnpm-lock.yaml`; `pnpm-workspace.yaml` only holds pnpm settings). Requires Node >= 22.22 (React Router 8). There is no linter, formatter, or test framework.

## Stack

React 19, TypeScript 7 (strict, `verbatimModuleSyntax`, so type-only imports must use `import type`), Vite 8, Tailwind CSS v4 through `@tailwindcss/vite` (no `tailwind.config`/PostCSS; theme tokens and base styles are in `src/assets/global.css`), React Router 8 (`react-router`, not `react-router-dom`), axios, `@phosphor-icons/react`. The Outfit font is loaded from Google Fonts in `index.html`.

## Architecture

A single-page Pokédex that reads all data from the public PokéAPI; there is no backend.

- **Entry flow:** `main.tsx` → `App.tsx` (`RouterProvider`) → `router.tsx` (`createBrowserRouter`; `/` → `pages/Home`).
- **Client-side list:** PokéAPI has no search endpoint. `getAllPokemon()` in `services/api.ts` downloads the full name list once (about 100 KB), parses each id from its URL, and drops alternate forms (id ≥ 10000). `Home` filters that list by name or number for search. Infinite scroll reveals it `PAGE_SIZE` cards at a time: an `IntersectionObserver` watches a sentinel below the grid and is recreated after each page, so it keeps loading until the screen is filled.
- **Per-card details and cache:** each card and the modal call `usePokemonDetails(url)`. That hook calls `getPokemonDetails`, which shares one promise per URL and also caches resolved data, so `peekPokemonDetails` can supply the initial state synchronously. The modal reuses what the card already loaded. Failed requests are removed from the cache so a retry works. Components ignore stale results with an `active` flag instead of aborting, because the requests are shared.
- **Images:** artwork URLs are built from the id (`getArtworkUrl` in `lib/pokemon.ts`), so images show before details arrive. Type colors and their Portuguese labels, the stat labels, and the formatters are also in `lib/pokemon.ts`.
- **Dynamic colors:** a type color reaches Tailwind through a CSS variable (`style={{ "--type": color }}` with classes like `bg-(--type)` or `shadow-[…var(--type)]`), or through inline `tint()` (`color-mix`). Tailwind cannot generate classes from runtime values.
- **Modal:** `PokemonModal` is a native `<dialog>` opened with `showModal()` whenever `selected` is set. It closes on Escape, a backdrop click, or the X button, and each path calls `onClose`. `global.css` locks page scroll with `html:has(dialog[open])`. The content component is keyed by Pokémon so its state resets.
- **Compound component:** `TextInput` is `{ Root, Icon, Input }`, used as `<TextInput.Root>…`. `Icon` uses Radix `Slot` to pass its classes to the child icon.

## Conventions

- Import Phosphor icons one at a time from `@phosphor-icons/react/dist/csr/<Name>` (they export `<Name>Icon`). The barrel import makes Vite transform about 4,500 modules.
- Use Tailwind v4 class names (`bg-black/60`, `outline-hidden`, `size-*`, `starting:` for enter animations), and add `cursor-pointer` to buttons because v4 no longer sets it.
- Components are named-export function components with an explicit props interface. User-facing text is in Portuguese.
