import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePokemonList } from "@/features/pokemon";
import { PokemonCard } from "@/components/PokemonCard";
import { Spinner } from "@/components/feedback/Spinner";
import { ErrorState } from "@/components/feedback/ErrorState";
import type { PokemonListItem } from "@/types/pokemon";

export default function PokedexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } =
    usePokemonList();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState message="Failed to load Pokémon." onRetry={refetch} />;

  const allPokemon: PokemonListItem[] = data?.pages.flatMap((p) => p.results) ?? [];

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="px-4 pt-4 pb-2">
        <Text className="text-3xl font-bold text-gray-900">Pokédex</Text>
        <Text className="text-gray-400 text-sm mt-1">
          {data?.pages[0].count ?? 0} Pokémon total
        </Text>
      </View>

      <FlatList
        data={allPokemon}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 6, paddingBottom: insets.bottom + 16 }}
        renderItem={({ item }) => (
          <PokemonCard
            item={item}
            onPress={(id) => router.push(`/pokemon/${id}`)}
          />
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4 items-center">
              <ActivityIndicator color="#EF4444" />
            </View>
          ) : null
        }
      />
    </View>
  );
}
