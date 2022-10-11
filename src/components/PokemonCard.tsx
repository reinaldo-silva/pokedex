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
      className="flex w-80 bg-slate-800 h-96 flex-col shadow-md rounded-md p-4 items-center justify-evenly cursor-pointer"
    >
      {!pokemonData.sprites ? (
        <div className="w-full flex justify-center flex-col items-center gap-4">
          <img src={pokeImg} alt="" className="animate-bounce h-10 w-10" />
          <h2 className="font-bold text-zinc-400">Carregando</h2>
        </div>
      ) : (
        <>
          <img
            className="w-auto h-52"
            src={pokemonData.sprites.other.dream_world.front_default}
            alt={`img-${name}`}
          />
          <h2 className="font-normal text-2xl capitalize text-zinc-300">
            {name}
          </h2>
        </>
      )}
    </div>
  );
};

export default PokemonCard;
