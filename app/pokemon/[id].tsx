import { ScrollView, Text, View, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { usePokemonDetail } from "@/features/pokemon";
import { Spinner } from "@/components/feedback/Spinner";
import { ErrorState } from "@/components/feedback/ErrorState";
import { PokemonTypeBadge } from "@/components/PokemonTypeBadge";
import {
  formatPokemonName,
  formatStatName,
  formatHeight,
  formatWeight,
  getOfficialArtwork,
  padId,
  TYPE_BG_COLORS,
  TYPE_COLORS,
} from "@/lib/pokemon.utils";

const MAX_STAT = 255;

function StatBar({ name, value }: { name: string; value: number }) {
  const percent = Math.min((value / MAX_STAT) * 100, 100);
  const color =
    value >= 90 ? "#4CAF50" : value >= 55 ? "#FF9800" : "#F44336";

  return (
    <View className="flex-row items-center gap-3 mb-3">
      <Text className="text-xs text-gray-400 font-semibold w-16">
        {formatStatName(name)}
      </Text>
      <Text className="text-sm font-bold text-gray-800 w-8 text-right">
        {value}
      </Text>
      <View className="flex-1 bg-gray-100 rounded-full h-2">
        <View
          className="h-2 rounded-full"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
}

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pokemonId = parseInt(id, 10);

  const { data: pokemon, isLoading, isError, refetch } = usePokemonDetail(pokemonId);

  if (isLoading) return <Spinner />;
  if (isError || !pokemon)
    return <ErrorState message="Failed to load Pokémon." onRetry={refetch} />;

  const primaryType = pokemon.types[0]?.type.name ?? "normal";
  const bgColor = TYPE_BG_COLORS[primaryType] ?? "#F5F5F5";
  const accentColor = TYPE_COLORS[primaryType] ?? "#A8A878";
  const artwork =
    pokemon.sprites.other?.["official-artwork"].front_default ??
    getOfficialArtwork(pokemon.id);

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
    >
      {/* Header */}
      <View
        className="items-center pb-6"
        style={{ backgroundColor: bgColor, paddingTop: insets.top + 8 }}
      >
        <View className="w-full flex-row items-center px-4 mb-2">
          <Pressable onPress={() => router.back()} hitSlop={12} className="p-2">
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="flex-1 text-center text-gray-400 font-semibold text-sm">
            {padId(pokemon.id)}
          </Text>
          <View className="w-10" />
        </View>

        <Image
          source={{ uri: artwork ?? undefined }}
          style={{ width: 200, height: 200 }}
          contentFit="contain"
          transition={300}
        />
      </View>

      {/* Content */}
      <View className="px-6 pt-6">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          {formatPokemonName(pokemon.name)}
        </Text>

        {/* Types */}
        <View className="flex-row gap-2 mb-6">
          {pokemon.types.map((t) => (
            <PokemonTypeBadge key={t.type.name} typeName={t.type.name} />
          ))}
        </View>

        {/* Physical */}
        <View className="flex-row gap-4 mb-6">
          <View
            className="flex-1 rounded-2xl p-4 items-center"
            style={{ backgroundColor: bgColor }}
          >
            <Text className="text-xs text-gray-500 mb-1">Height</Text>
            <Text className="text-base font-bold text-gray-800">
              {formatHeight(pokemon.height)}
            </Text>
          </View>
          <View
            className="flex-1 rounded-2xl p-4 items-center"
            style={{ backgroundColor: bgColor }}
          >
            <Text className="text-xs text-gray-500 mb-1">Weight</Text>
            <Text className="text-base font-bold text-gray-800">
              {formatWeight(pokemon.weight)}
            </Text>
          </View>
          {pokemon.base_experience != null && (
            <View
              className="flex-1 rounded-2xl p-4 items-center"
              style={{ backgroundColor: bgColor }}
            >
              <Text className="text-xs text-gray-500 mb-1">Base XP</Text>
              <Text className="text-base font-bold text-gray-800">
                {pokemon.base_experience}
              </Text>
            </View>
          )}
        </View>

        {/* Abilities */}
        <Text
          className="text-base font-bold text-gray-900 mb-3"
          style={{ color: accentColor }}
        >
          Abilities
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {pokemon.abilities.map((a) => (
            <View
              key={a.ability.name}
              className="px-3 py-1.5 rounded-full border"
              style={{ borderColor: accentColor }}
            >
              <Text className="text-xs font-semibold capitalize text-gray-700">
                {formatPokemonName(a.ability.name)}
                {a.is_hidden ? " (Hidden)" : ""}
              </Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <Text
          className="text-base font-bold mb-4"
          style={{ color: accentColor }}
        >
          Base Stats
        </Text>
        {pokemon.stats.map((s) => (
          <StatBar
            key={s.stat.name}
            name={s.stat.name}
            value={s.base_stat}
          />
        ))}
      </View>
    </ScrollView>
  );
}
