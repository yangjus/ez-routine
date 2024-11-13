import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import * as SQLite from "expo-sqlite";

export default function App() {
  const db = SQLite.useSQLiteContext();
  useDrizzleStudio(db);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="routine" options={{ headerShown: false }} />
      <Stack.Screen name="workout" options={{ headerShown: false }} />
    </Stack>
  );
}