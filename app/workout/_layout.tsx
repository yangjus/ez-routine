import { router, Stack } from "expo-router";
import { Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Workout",
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
        name="add-workout"
        options={{ 
          title: "Create Workout", 
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <MaterialIcons
                name="arrow-back-ios-new"
                size={20}
                color="#0081F1"
              />
            </Pressable>
          ),
          presentation: "modal" }}
      />
    </Stack>
  );
}
