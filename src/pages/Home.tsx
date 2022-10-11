import { CaretCircleDown } from "phosphor-react";
import React, { useCallback, useEffect, useState } from "react";
import pokemonLogo from "../assets/images/pokemonLogo.png";
import PokemonCard from "../components/PokemonCard";
import { PokemonModal } from "../components/PokemonModal";
import { api } from "../services/api";

export interface Pokemon {
  name: string;
  url: string;
}

const Home: React.FC = () => {
  const [pokemons, setPokemons] = useState([] as Pokemon[]);
  const [offset, setOffset] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
          ...(oldPokemons.findIndex(
            (pokemon) => pokemon.name === response.data.results[0].name
          ) >= 0
            ? []
            : response.data.results),
        ]);
      });
  }, [offset]);

  const handleViewMore = useCallback(() => {
    setOffset((oldOffset) => oldOffset + 21);
  }, []);

  return (
    <div className="flex flex-col items-center bg-slate-900 min-h-screen relative">
      <PokemonModal isOpen={modalIsOpen} setIsOpen={setModalIsOpen} />
      <header className="p-4">
        <img className="w-44" src={pokemonLogo} alt="" />
      </header>
      <div className="w-full flex flex-wrap justify-around gap-6 p-4">
        {pokemons.map((poke) => (
          <PokemonCard
            name={poke.name}
            url={poke.url}
            key={poke.name}
            handleClick={() => setModalIsOpen(true)}
          />
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
