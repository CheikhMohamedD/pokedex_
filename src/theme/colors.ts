export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice' 
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' 
  | 'bug' | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy'

export const typeColors: Record<PokemonType, string> & Record<string, string> = {
  normal: 'bg-pokemon-normal',
  fire: 'bg-pokemon-fire',
  water: 'bg-pokemon-water',
  electric: 'bg-pokemon-electric',
  grass: 'bg-pokemon-grass',
  ice: 'bg-pokemon-ice',
  fighting: 'bg-pokemon-fighting',
  poison: 'bg-pokemon-poison',
  ground: 'bg-pokemon-ground',
  flying: 'bg-pokemon-flying',
  psychic: 'bg-pokemon-psychic',
  bug: 'bg-pokemon-bug',
  rock: 'bg-pokemon-rock',
  ghost: 'bg-pokemon-ghost',
  dragon: 'bg-pokemon-dragon',
  dark: 'bg-pokemon-dark',
  steel: 'bg-pokemon-steel',
  fairy: 'bg-pokemon-fairy',
}