import { View, Text, Pressable } from "react-native";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: Props) {
  return (
    <View className="flex-1 items-center justify-center px-8 gap-4">
      <Text className="text-4xl">⚠️</Text>
      <Text className="text-gray-700 text-base text-center">{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="bg-red-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </Pressable>
      )}
    </View>
  );
}
