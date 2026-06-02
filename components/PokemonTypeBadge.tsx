import { Text, View } from "react-native";
import { TYPE_COLORS } from "@/lib/pokemon.utils";

type Props = {
  typeName: string;
};

export function PokemonTypeBadge({ typeName }: Props) {
  const color = TYPE_COLORS[typeName] ?? "#A8A878";
  return (
    <View
      className="px-3 py-1 rounded-full"
      style={{ backgroundColor: color }}
    >
      <Text className="text-white text-xs font-bold capitalize">
        {typeName}
      </Text>
    </View>
  );
}
