import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function Settings() {

  return (
    <SafeAreaView style={styles.container}>
      <Text>
        This is the settings page.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});