import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity } from "react-native";
import { Pokemon } from "./pokedex.types";

interface Props {
  pokemon: Pokemon;
}

export function PokemonCard({ pokemon }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 items-center"
      activeOpacity={0.7}
      onPress={() => router.push(`/pokemon/${pokemon.id}`)}
    >
      <Text className="text-gray-400 dark:text-gray-500 font-bold self-end text-xs mb-2">
        #{String(pokemon.id).padStart(3, "0")}
      </Text>

      <Image
        source={{ uri: pokemon.imageUrl }}
        className="w-24 h-24 mb-3"
        resizeMode="contain"
      />

      <Text className="text-gray-800 dark:text-gray-200 font-bold text-lg capitalize">
        {pokemon.name}
      </Text>
    </TouchableOpacity>
  );
}
