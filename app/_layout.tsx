import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SQLiteProvider databaseName="data.db" assetSource={{ assetId: require('@/assets/data.db') }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="routine" options={{ headerShown: false }} />
          <Stack.Screen name="workout" options={{ headerShown: false }} />
        </Stack>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
