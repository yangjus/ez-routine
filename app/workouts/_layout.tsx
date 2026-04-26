import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";

const BackButton = () => (
  <Pressable onPress={() => router.back()}>
    <MaterialIcons name="arrow-back-ios-new" size={20} color="#0081F1" />
  </Pressable>
);

export default function WorkoutsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="new"
        options={{
          title: "Create Workout",
          headerLeft: BackButton,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="[workoutId]/index"
        options={{
          title: "Workout",
          headerLeft: BackButton,
        }}
      />
      <Stack.Screen
        name="[workoutId]/exercises/new"
        options={{ title: "Add Exercise", presentation: "modal" }}
      />
      <Stack.Screen
        name="[workoutId]/exercises/[exerciseId]/edit"
        options={{ title: "Edit Exercise", presentation: "modal" }}
      />
    </Stack>
  );
}
