import { useQuery } from "@tanstack/react-query";
import { PokemonService } from "@/services/api/pokeapi";

export function usePokemonDetail(id: number) {
  return useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => PokemonService.getById(id),
    staleTime: 10 * 60 * 1000,
    enabled: id > 0,
  });
}
