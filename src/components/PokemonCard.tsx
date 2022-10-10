import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Pokemon } from "../pages/Home";
import { CircleNotch } from "phosphor-react";
import pokeImg from "../assets/images/pokeball.png";

interface PokemonData {
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
    };
  };
}

const PokemonCard: React.FC<Pokemon> = ({ name, url }) => {
  const [pokemonData, setPokemonData] = useState({} as PokemonData);

  useEffect(() => {
    api.get(url).then((response) => {
      console.log(response);

      setPokemonData(response.data);
    });
  }, []);

  return (
    <div className="flex w-80 bg-slate-800 h-96 flex-col shadow-md rounded-md p-4 items-center justify-evenly">
      {!pokemonData.sprites ? (
        // <CircleNotch size={32} weight="bold" className="animate-spin" />
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
