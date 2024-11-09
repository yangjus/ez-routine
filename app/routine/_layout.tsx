import { router, Stack } from "expo-router";
import { Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Routine",
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <MaterialIcons
                name="arrow-back-ios-new"
                size={20}
                color="#0081F1"
              />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="add-exercise"
        options={{ title: "Add Exercise", presentation: "modal" }}
      />
      <Stack.Screen
        name="edit-exercise"
        options={{ title: "Edit Exercise", presentation: "modal" }}
      />
    </Stack>
  );
}
