import { api } from "./client";
import {
  PokemonListSchema,
  PokemonDetailSchema,
  type PokemonList,
  type PokemonDetail,
} from "@/types/pokemon";

export const PokemonService = {
  getList: async (limit: number, offset: number): Promise<PokemonList> => {
    const data = await api<unknown>(`/pokemon?limit=${limit}&offset=${offset}`);
    return PokemonListSchema.parse(data);
  },

  getById: async (id: number | string): Promise<PokemonDetail> => {
    const data = await api<unknown>(`/pokemon/${id}`);
    return PokemonDetailSchema.parse(data);
  },
};
