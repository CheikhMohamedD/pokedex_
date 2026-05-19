import { SafeAreaView } from "react-native";
import { PokedexList } from "@/features/pokedex";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <PokedexList />
    </SafeAreaView>
  );
}