import { useQuery } from "@tanstack/react-query";
import { PokemonService } from "@/services/api/pokeapi";
import { PokemonDetail, PokemonDetailSchema } from "./pokedex.types";

export function usePokemonDetail(id: number) {
  const query = useQuery({
    queryKey: ["pokemon", id],
    queryFn: async (): Promise<PokemonDetail> => {
      const data = await PokemonService.getById(id);
      return PokemonDetailSchema.parse(data);
    },
    enabled: id > 0,
  });

  return {
    pokemon: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
