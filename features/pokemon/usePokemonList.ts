import { useInfiniteQuery } from "@tanstack/react-query";
import { PokemonService } from "@/services/api/pokeapi";

const PAGE_SIZE = 20;

export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: ["pokemon", "list"],
    queryFn: ({ pageParam }) => PokemonService.getList(PAGE_SIZE, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length * PAGE_SIZE;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });
}
