import { CaretCircleDown } from "phosphor-react";
import React, { useCallback, useEffect, useState } from "react";
import PokemonCard from "../components/PokemonCard";
import { api } from "../services/api";

export interface Pokemon {
  name: string;
  url: string;
}

const Home: React.FC = () => {
  const [pokemons, setPokemons] = useState([] as Pokemon[]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    api
      .get("/pokemon", {
        params: {
          limit: 21,
          offset: offset,
        },
      })
      .then((response) => {
        setPokemons((oldPokemons) => [
          ...oldPokemons,
          ...response.data.results,
        ]);
      });
  }, [offset]);

  const handleViewMore = useCallback(() => {
    setOffset((oldOffset) => oldOffset + 21);
  }, []);

  return (
    <div className="flex flex-col items-center bg-slate-900 py-4 min-h-screen">
      <header>Pokemons</header>
      <div className="w-full flex flex-wrap justify-around gap-6 p-4">
        {pokemons.map((poke) => (
          <PokemonCard name={poke.name} url={poke.url} key={poke.name} />
        ))}
      </div>

      <button
        className="p-2 flex flex-col items-center text-zinc-300 gap-2 transition-all hover:animate-pulse"
        type="button"
        onClick={handleViewMore}
      >
        View More
        <CaretCircleDown size={32} weight="bold" className="" />
      </button>
    </div>
  );
};

export { Home };
