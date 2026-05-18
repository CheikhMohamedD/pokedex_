'use client'

import { useState } from 'react'
import Image from 'next/image'

import { typeColors } from '@/theme'
import PokemonModal from './PokemonModal'
import { Pokemon } from '@/types/pokemon'

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const primaryType = pokemon.types[0].type.name
  const cardBgColor = typeColors[primaryType] || 'bg-gray-400'

  return (
    <>
      <div 
        className={`${cardBgColor} rounded-lg p-4 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="text-center">
          <div className="relative">
            <Image
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              width={128}
              height={128}
              className={`w-32 h-32 object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ width: 'auto', height: 'auto', margin: '0 auto' }}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          
          <h3 className="text-white font-bold text-lg capitalize mt-2">
            {pokemon.name}
          </h3>
          
          <p className="text-white opacity-75 text-sm">
            #{pokemon.id.toString().padStart(3, '0')}
          </p>
          
          <div className="flex justify-center gap-2 mt-2">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={`${typeColors[type.type.name] || 'bg-gray-400'} text-white px-2 py-1 rounded-full text-xs capitalize shadow-md`}
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <PokemonModal
        pokemon={pokemon}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}