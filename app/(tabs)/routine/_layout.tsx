import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Routine' }} />
      <Stack.Screen name="add-exercise" options={{ title: 'Add Exercise', presentation: 'modal' }} />
      <Stack.Screen name="edit-exercise" options={{ title: 'Edit Exercise', presentation: 'modal' }} />
    </Stack>
  );
};