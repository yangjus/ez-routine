import {
  Text,
  SafeAreaView,
  StyleSheet,
  Platform
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

export default function Index() {

  return (
    <SafeAreaView style={styles.container}>
      <Text>This is the home page.</Text>
      <Link href="/routine">
        Routines
      </Link>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30
  },
});
