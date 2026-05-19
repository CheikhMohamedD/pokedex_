import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePokemonDetail } from "./usePokemonDetail";

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "Sp.ATK",
  "special-defense": "Sp.DEF",
  speed: "SPD",
};

const MAX_STAT = 255;

interface Props {
  id: number;
}

export function PokemonDetailScreen({ id }: Props) {
  const router = useRouter();
  const { pokemon, isLoading, isError } = usePokemonDetail(id);

  const primaryType = pokemon?.types[0]?.type.name ?? "normal";
  const bgColor = TYPE_COLORS[primaryType] ?? "#A8A878";

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#ef4444" />
      </View>
    );
  }

  if (isError || !pokemon) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-red-500 font-bold">Erreur de chargement...</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-500">← Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: bgColor }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="px-6 pt-12 pb-2 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-2xl font-bold">←</Text>
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg">
          #{String(pokemon.id).padStart(3, "0")}
        </Text>
      </View>

      {/* Name */}
      <Text className="text-white text-4xl font-bold capitalize px-6 mb-2">
        {pokemon.name}
      </Text>

      {/* Types */}
      <View className="flex-row px-6 gap-2 mb-4">
        {pokemon.types.map(({ type }) => (
          <View
            key={type.name}
            className="rounded-full px-4 py-1"
            style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
          >
            <Text className="text-white font-semibold capitalize text-sm">
              {type.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Pokemon image */}
      <View className="items-center">
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 220, height: 220 }}
          resizeMode="contain"
        />
      </View>

      {/* Info card */}
      <View className="bg-white rounded-t-3xl px-6 pt-8 pb-10 -mt-6">
        {/* Height & Weight */}
        <View className="flex-row justify-around mb-8">
          <View className="items-center">
            <Text className="text-gray-800 font-bold text-xl">
              {(pokemon.height / 10).toFixed(1)} m
            </Text>
            <Text className="text-gray-400 text-sm mt-1">Taille</Text>
          </View>
          <View className="w-px bg-gray-200" />
          <View className="items-center">
            <Text className="text-gray-800 font-bold text-xl">
              {(pokemon.weight / 10).toFixed(1)} kg
            </Text>
            <Text className="text-gray-400 text-sm mt-1">Poids</Text>
          </View>
        </View>

        {/* Abilities */}
        <Text className="text-gray-800 font-bold text-lg mb-3">Capacités</Text>
        <View className="flex-row flex-wrap gap-2 mb-8">
          {pokemon.abilities.map(({ ability, is_hidden }) => (
            <View
              key={ability.name}
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: bgColor + "33" }}
            >
              <Text
                className="font-semibold capitalize text-sm"
                style={{ color: bgColor }}
              >
                {ability.name.replace("-", " ")}
                {is_hidden ? " (caché)" : ""}
              </Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <Text className="text-gray-800 font-bold text-lg mb-4">
          Statistiques
        </Text>
        {pokemon.stats.map(({ stat, base_stat }) => (
          <View key={stat.name} className="flex-row items-center mb-3">
            <Text
              className="font-bold text-xs w-16"
              style={{ color: bgColor }}
            >
              {STAT_LABELS[stat.name] ?? stat.name.toUpperCase()}
            </Text>
            <Text className="text-gray-700 font-bold w-8 text-right mr-3">
              {base_stat}
            </Text>
            <View className="flex-1 bg-gray-200 rounded-full h-2">
              <View
                className="rounded-full h-2"
                style={{
                  backgroundColor: bgColor,
                  width: `${Math.min((base_stat / MAX_STAT) * 100, 100)}%`,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
