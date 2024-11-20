import { View } from "react-native";
import { IconButton, MD3Colors } from "react-native-paper";
import { Ionicons, AntDesign } from "@expo/vector-icons";

export type PlayButtonsGroupProps = {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkip: (dir: "forward" | "backward") => void;
  disabled?: boolean;
};
export function PlayButtonsGroup({
  isPlaying,
  onTogglePlay,
  onSkip,
  disabled,
}: PlayButtonsGroupProps) {
  return (
    <View className="flex flex-row items-center justify-center gap-6">
      <IconButton
        mode="contained-tonal"
        icon={() => <AntDesign name="banckward" size={16} />}
        iconColor={MD3Colors.neutral90}
        size={24}
        onPress={() => onSkip("backward")}
        disabled={disabled}
      />

      <IconButton
        mode="contained-tonal"
        icon={() => <Ionicons name={isPlaying ? "pause" : "play"} size={24} />}
        onPress={onTogglePlay}
        iconColor={MD3Colors.neutral90}
        size={40}
        disabled={disabled}
      />
      <IconButton
        mode="contained-tonal"
        icon={() => <AntDesign name="forward" size={16} />}
        onPress={() => onSkip("forward")}
        iconColor={MD3Colors.neutral90}
        size={24}
        disabled={disabled}
      />
    </View>
  );
}
