const BASE_URL = 'https://pokeapi.co/api/v2'

export const pokemonApi = {
  getPokemonList: async (limit = 151, offset = 0) => {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de la liste des Pokémon')
    }
    return response.json()
  },

  getPokemonById: async (id: string | number) => {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`)
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération du Pokémon ${id}`)
    }
    return response.json()
  },

  getPokemonSpecies: async (id: string | number) => {
    const response = await fetch(`${BASE_URL}/pokemon-species/${id}`)
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des détails de l'espèce ${id}`)
    }
    return response.json()
  }
}