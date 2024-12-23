import {
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  View,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { FlatList } from "react-native-gesture-handler";
import { Link, router } from "expo-router";
import ThemedButton from "@/components/ThemedButton";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function Workouts() {
  const renderItem = ({ item }: { item: string }) => {
    return (
      <Link
        href={{
          pathname: "/routine",
          params: { dayOfWeek: item },
        }}
        asChild
      >
        <Pressable style={itemStyles.container}>
          <Text style={itemStyles.text}>{item}</Text>
        </Pressable>
      </Link>
    );
  };

  const createWorkout = () => {
    router.push('/workout/add-workout');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Workouts</Text>
      </View>
      <View style={styles.mainContainer}>
        <FlatList
          data={daysOfWeek}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 16 }}
        />
      </View>
      <View style={styles.footerContainer}>
        <ThemedButton content={"Create New Workout"} onPress={createWorkout}/>
      </View>
      <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  header: {
    fontWeight: "bold",
    fontSize: 30,
  },
  mainContainer: {
    flex: 1,
    width: "100%",
  },
  footerContainer: {
    marginBottom: 20,
  },
});

const itemStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
