import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import {
  formatPokemonName,
  getOfficialArtwork,
  getPokemonId,
  padId,
  TYPE_BG_COLORS,
} from "@/lib/pokemon.utils";
import type { PokemonListItem } from "@/types/pokemon";

type Props = {
  item: PokemonListItem;
  onPress: (id: number) => void;
};

export function PokemonCard({ item, onPress }: Props) {
  const id = getPokemonId(item.url);
  const sprite = getOfficialArtwork(id);

  return (
    <Pressable
      onPress={() => onPress(id)}
      className="flex-1 m-2 rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <View className="items-center pt-4 pb-2 px-3">
        <Text className="text-gray-400 text-xs font-semibold self-end">
          {padId(id)}
        </Text>
        <Image
          source={{ uri: sprite }}
          style={{ width: 90, height: 90 }}
          contentFit="contain"
          transition={200}
        />
        <Text
          className="text-gray-800 font-bold text-sm text-center mt-1"
          numberOfLines={1}
        >
          {formatPokemonName(item.name)}
        </Text>
      </View>
    </Pressable>
  );
}
