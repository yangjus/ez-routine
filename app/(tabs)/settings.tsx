import {
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  View,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import ThemedButton from "@/components/ThemedButton";

export default function Settings() {
  const confirmationDialog = () =>
    Alert.alert(
      "Clear All Data",
      "Permanently delete all local storage data? You can't undo this.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: clearAllData },
      ],
    );

  const clearAllData = () => {
    // remove all local storage, reset to defaults
    console.log("Removed all data.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.header}>Settings</Text>
        </View>
      </Text>
      <View style={styles.mainContainer}>
        <ThemedButton
          content="Clear All Data"
          onPress={confirmationDialog}
          type="warning"
        />
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  textContainer: {
    flex: 3,
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    fontSize: 30,
  },
  mainContainer: {
    flex: 8,
    width: "100%",
  },
});
