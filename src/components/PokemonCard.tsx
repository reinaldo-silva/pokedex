import React, { useEffect, useState } from "react";
import pokeImg from "../assets/images/pokeball.png";
import { Pokemon } from "../pages/Home";
import { api } from "../services/api";

interface PokemonData {
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
    };
  };
}

interface PokemonCard extends Pokemon {
  handleClick: () => void;
}

const PokemonCard: React.FC<PokemonCard> = ({ name, url, handleClick }) => {
  const [pokemonData, setPokemonData] = useState({} as PokemonData);

  useEffect(() => {
    api.get(url).then((response) => {
      setPokemonData(response.data);
    });
  }, []);

  return (
    <div
      onClick={handleClick}
      className="flex w-72 bg-slate-800 h-80 flex-col shadow-md rounded-md p-4 items-center justify-evenly cursor-pointer relative"
    >
      <section className="z-10 h-full w-full flex flex-col items-center justify-around">
        {!pokemonData.sprites ? (
          <div className="w-full flex justify-center flex-col items-center gap-4">
            <img src={pokeImg} alt="" className="animate-bounce h-10 w-10" />
            <h2 className="font-bold text-zinc-400">Carregando</h2>
          </div>
        ) : (
          <>
            <img
              className="w-auto h-40"
              src={pokemonData.sprites.other.dream_world.front_default}
              alt={`img-${name}`}
            />
            <h2 className="font-normal text-2xl capitalize text-zinc-300">
              {name}
            </h2>
          </>
        )}
      </section>
      <div className="w-44 h-44 absolute bg-slate-400 bg-opacity-40 rounded-full top-10" />
    </div>
  );
};

export default PokemonCard;
