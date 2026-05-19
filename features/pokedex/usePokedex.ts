import { useQuery } from "@tanstack/react-query";
import { PokemonService } from "@/services/api/pokeapi";
import { Pokemon, PokemonListResponseSchema } from "./pokedex.types";

export function usePokedex(limit = 151, offset = 0) {
  const query = useQuery({
    queryKey: ["pokemons", limit, offset],
    queryFn: async (): Promise<Pokemon[]> => {
      const data = await PokemonService.getList(limit, offset);
      const parsed = PokemonListResponseSchema.parse(data);

      return parsed.results.map((item) => {
        // Extract the numeric ID from the resource URL
        const segments = item.url.split("/").filter(Boolean);
        const id = Number(segments[segments.length - 1]);
        return {
          id,
          name: item.name,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        };
      });
    },
  });

  return {
    pokemons: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
