import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Monday Routine' }} />
        <Stack.Screen name="add-exercise" options={{ title: 'Add Exercise', presentation: 'modal' }} />
        <Stack.Screen name="edit-exercise" options={{ title: 'Edit Exercise', presentation: 'modal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
