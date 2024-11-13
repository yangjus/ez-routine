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
import { useSQLiteContext } from "expo-sqlite";

export default function Settings() {
  const db = useSQLiteContext();

  const confirmationDialog = () =>
    Alert.alert(
      "Clear All Data",
      "Permanently delete all local storage data? You can't undo this.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: clearAllData },
      ],
    );

  const clearAllData = async () => {
    try {
      await db.execAsync(`
        BEGIN TRANSACTION;
        
        DELETE FROM sets;
        DELETE FROM exercises;
        DELETE FROM workouts;
        
        DELETE FROM sqlite_sequence WHERE name IN ('sets', 'exercises', 'workouts');
        
        COMMIT;
        
        VACUUM;
      `);
      alert('Successfully removed all data.');
    } catch (e) {
      alert(`Error: ${e}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Settings</Text>
      </View>
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
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  header: {
    fontWeight: "bold",
    fontSize: 30,
  },
  mainContainer: {
    flex: 1,
    width: "100%",
  },
});
