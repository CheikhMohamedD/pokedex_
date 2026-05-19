import { useLocalSearchParams } from "expo-router";
import { PokemonDetailScreen } from "@/features/pokedex";

export default function PokemonDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PokemonDetailScreen id={Number(id)} />;
}
