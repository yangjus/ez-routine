import {
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  View,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { FlatList } from "react-native-gesture-handler";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function Index() {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>EZ Routine</Text>
        <Text>"Results happen over time, not overnight"</Text>
      </View>
      <View style={styles.mainContainer}>
        <FlatList
          data={daysOfWeek}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 16 }}
        />
      </View>
      <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
  },
  headerContainer: {
    alignItems: "center",
    gap: 10,
    marginVertical: 20,
  },
  header: {
    fontWeight: "bold",
    fontSize: 36,
  },
  mainContainer: {
    flex: 1,
    width: "100%",
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
