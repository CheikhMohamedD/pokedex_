import { useQuery, useQueries } from '@tanstack/react-query'
import { pokemonApi } from '../lib/api'
import type { Pokemon, PokemonListResponse, PokemonSpecies } from '../types/pokemon'

export const usePokemonList = (limit = 151, offset = 0) => {
  return useQuery<PokemonListResponse>({
    queryKey: ['pokemon', 'list', limit, offset],
    queryFn: () => pokemonApi.getPokemonList(limit, offset),
    staleTime: 10 * 60 * 1000,
  })
}

export const usePokemon = (id: string | number) => {
  return useQuery<Pokemon>({
    queryKey: ['pokemon', id],
    queryFn: () => pokemonApi.getPokemonById(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,  
  })
}

export const usePokemonSpecies = (id: string | number) => {
  return useQuery<PokemonSpecies>({
    queryKey: ['pokemon', 'species', id],
    queryFn: () => pokemonApi.getPokemonSpecies(id),
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  })
}

export const usePokemonBatch = (pokemonList: Array<{ name: string; url: string }>) => {
  return useQueries({
    queries: pokemonList.map((pokemon) => ({
      queryKey: ['pokemon', pokemon.name],
      queryFn: () => pokemonApi.getPokemonById(pokemon.name),
      staleTime: 30 * 60 * 1000,
    })),
  })
}