import { ActivityIndicator, View } from "react-native";

type Props = {
  size?: "small" | "large";
  color?: string;
};

export function Spinner({ size = "large", color = "#EF4444" }: Props) {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
