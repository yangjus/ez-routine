import {
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  View
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

export default function Index() {

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.header}>EZ Routine</Text>
        </View>
      </Text>
      <View style={styles.mainContainer}>
        <Link href="/routine">
          Routines
        </Link>
      </View>
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
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  textContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 30
  },
  mainContainer: {
    flex: 8,
    width: '100%',
  },
});
