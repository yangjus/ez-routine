import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Pressable
} from "react-native";
import { data } from '@/data/placeholders';
import SwipeItem from "@/components/SwipeableItem";

export default function Index() {
  const onPress = () => {
    alert('You have finished your workout!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Pull Day</Text>
        <Text>Estimated Time: 65 minutes</Text>
      </View>
      <View style={styles.mainContainer}>
        <FlatList
          data={data}
          renderItem={({ item }) => 
            <SwipeItem item={item} />
          }
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={styles.footerContainer}>
        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Finish Workout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  headerContainer: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 30
  },
  mainContainer: {
    flex: 8,
    marginHorizontal: 30
  },
  footerContainer: {
    flex: 1
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: 'black',
  },
  buttonText: {
    color: '#fff'
  },
});
