import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { PokemonCard } from "./PokemonCard";
import { usePokedex } from "./usePokedex";

export function PokedexList() {
  const { pokemons, isLoading, isError } = usePokedex();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#ef4444" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500 font-bold">Erreur de chargement...</Text>
      </View>
    );
  }

  return (
    <View className="px-4 py-6 flex-1">
      <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        Pokédex
      </Text>
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, justifyContent: "space-between" }}
        contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
      />
    </View>
  );
}