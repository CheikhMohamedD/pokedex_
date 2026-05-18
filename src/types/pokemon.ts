export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
  types: Array<{
    type: {
      name: string
    }
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
  abilities: Array<{
    ability: {
      name: string
    }
  }>
}

export interface PokemonListResponse {
  results: Array<{
    name: string
    url: string
  }>
}

export interface PokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
    }
  }>
}