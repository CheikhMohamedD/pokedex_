'use client'

import Image from 'next/image'
import { usePokemonSpecies } from '@/hooks/usePokemon'
import { typeColors } from '@/theme'
import { Pokemon } from '@/types/pokemon'

export default function PokemonModal({ pokemon, isOpen, onClose }: { pokemon: Pokemon, isOpen: boolean, onClose: () => void }) {
  const { data: speciesData } = usePokemonSpecies(pokemon?.id)

  if (!isOpen) return null

  const primaryType = pokemon.types[0].type.name
  const cardBgColor = typeColors[primaryType] || 'bg-gray-400'

  const getDescription = () => {
    if (!speciesData?.flavor_text_entries) return null
    
    const frenchEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'fr')
    const englishEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')
    
    return frenchEntry?.flavor_text || englishEntry?.flavor_text || null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 text-black">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className={`${cardBgColor} p-6 rounded-t-lg`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-white text-2xl font-bold capitalize">
                {pokemon.name}
              </h2>
              <p className="text-white opacity-75">
                #{pokemon.id.toString().padStart(3, '0')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="text-center">
            <Image
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              width={192}
              height={192}
              className="w-48 h-48 object-contain mx-auto"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
          
          <div className="flex justify-center gap-2 mt-4">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={`${typeColors[type.type.name] || 'bg-gray-400'} text-white px-3 py-1 rounded-full text-sm capitalize shadow-md`}
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6">
          {getDescription() && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {getDescription()?.replace(/\f/g, ' ') || ''}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Taille</p>
              <p className="font-bold">{pokemon.height / 10} m</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm">Poids</p>
              <p className="font-bold">{pokemon.weight / 10} kg</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Statistiques</h3>
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm capitalize">{stat.stat.name}</span>
                  <span className="text-sm font-bold">{stat.base_stat}</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className={`${cardBgColor} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${Math.min(stat.base_stat, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">Capacités</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((ability) => (
                <span
                  key={ability.ability.name}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm capitalize"
                >
                  {ability.ability.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}