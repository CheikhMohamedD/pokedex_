import { api } from "./client";

export const PokemonService = {
  getList: (limit: number, offset: number) =>
    api<unknown>(`/pokemon?limit=${limit}&offset=${offset}`),

  getById: (id: number) =>
    api<unknown>(`/pokemon/${id}`),
};
