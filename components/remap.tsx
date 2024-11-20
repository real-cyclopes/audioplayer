import { Platform } from "react-native";
import { remapProps } from "nativewind";
import { Surface, ProgressBar } from "react-native-paper";

export const CustomSurface =
  Platform.OS === "web"
    ? remapProps(Surface, {
        className: "style",
      })
    : Surface;

export const CustomProgressBar =
  Platform.OS === "web"
    ? remapProps(ProgressBar, {
        className: "style",
      })
    : ProgressBar;
