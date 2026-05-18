'use client'

import { useState, useMemo, useEffect } from 'react'

import { usePokemonList } from '@/hooks/usePokemon'
import { usePokemonBatch } from '@/hooks/usePokemon'
import PokemonCard from '@/components/PokemonCard'
import SearchBar from '@/components/SearchBar'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
import { Pokemon } from '@/types/pokemon'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  const { data: pokemonListData, isLoading: listLoading, error: listError } = usePokemonList(151)
  const pokemonQueries = usePokemonBatch(pokemonListData?.results || [])

  const pokemons = useMemo(() => {
    return pokemonQueries
      .filter(query => query.isSuccess && query.data)
      .map(query => query.data)
      .sort((a, b) => a.id - b.id)
  }, [pokemonQueries])

  const filteredPokemons = useMemo(() => {
    return pokemons.filter((pokemon: Pokemon) => {
      const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === '' || pokemon.types.some((type: Pokemon['types'][0]) => type.type.name === selectedType)
      return matchesSearch && matchesType
    })
  }, [pokemons, searchTerm, selectedType])

  const isLoadingQueries = listLoading || pokemonQueries.some(query => query.isLoading)
  const isError = listError || pokemonQueries.some(query => query.isError)
  
  const hasPokemonData = pokemons.length > 0

  useEffect(() => {
    if (hasPokemonData || isError) {
      setIsInitialLoad(false)
    }
  }, [hasPokemonData, isError])
  
  const isLoading = isInitialLoad || (isLoadingQueries && !hasPokemonData)

  const availableTypes = useMemo(() => {
    const types = new Set<string>()
    pokemons.forEach((pokemon: Pokemon) => {
      pokemon.types.forEach((type: Pokemon['types'][0]) => types.add(type.type.name))
    })
    return Array.from(types).sort()
  }, [pokemons])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <ErrorMessage message="Erreur lors du chargement des Pokémon" />
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Pokédex</h1>
        <p className="text-gray-600">Découvrez tous les Pokémon de la première génération</p>
        <p className="text-sm text-gray-500 mt-2">
          {filteredPokemons.length} Pokémon trouvé{filteredPokemons.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <div className="flex justify-center">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les types</option>
            {availableTypes.map((type: string) => (
              <option key={type} value={type} className="capitalize">
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredPokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {filteredPokemons.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun Pokémon trouvé</p>
        </div>
      )}
    </div>
  )
}