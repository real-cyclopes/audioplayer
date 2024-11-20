import "../global.css";
import { useCallback } from "react";
import { Platform } from "react-native";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 3000);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider
      onLayout={onLayoutRootView}
      style={{
        flex: 1,
        width: "100%",
        maxWidth: Platform.OS === "web" ? 500 : "100%",
        marginHorizontal: "auto",
      }}
    >
      <PaperProvider>
        <Stack>
          <Stack.Screen name="+not-found" />
        </Stack>

        <StatusBar style="auto" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
