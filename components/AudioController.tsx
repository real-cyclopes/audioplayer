import { View } from "react-native";
import { MD2Colors, Text } from "react-native-paper";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { PlayButtonsGroup } from "./PlayButtonsGroup";
import { CustomProgressBar } from "./remap";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

dayjs.extend(duration);

export type AudioControllerProps = {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  onSkip: (dir: "forward" | "backward") => void;
  onTogglePlayer: () => void;
  disabled: boolean;
};

export function AudioController({
  duration,
  currentTime,
  isPlaying,
  onSkip,
  onTogglePlayer,
}: AudioControllerProps) {
  return (
    <View className="flex w-full flex-col items-center gap-3 pb-10">
      <View className="w-full">
        <CustomProgressBar
          // progress={Math.round((currentTime * 100) / duration) / 100}
          progress={(currentTime / duration) as Float}
          color={MD2Colors.amber300}
          className="h-3"
        />
      </View>

      <View className="flex w-full flex-row items-center justify-between px-4">
        <Text variant="labelSmall" className="text-neutral-900">
          {dayjs.duration(currentTime).format("m:ss")}
        </Text>
        <Text variant="labelSmall">
          {dayjs.duration(duration).format("m:ss")}
        </Text>
      </View>

      <PlayButtonsGroup
        isPlaying={isPlaying}
        onSkip={onSkip}
        onTogglePlay={onTogglePlayer}
      />
    </View>
  );
}
