import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Platform
} from "react-native";
import { data_placeholder, dataProps } from '@/data/placeholders';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SwipeItem from "@/components/SwipeableItem";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { useState } from "react";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  const [data, setData] = useState<dataProps[]>(data_placeholder);

  const renderItem = (params: RenderItemParams<dataProps>) => {
    return (
      <ScaleDecorator>
        <SwipeItem props={params} />
      </ScaleDecorator>
    );
  };

  const onPress = () => {
    // remove all green checkmarks
    alert('You have finished your workout!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.header}>Pull Day</Text>
          <Text>Estimated Time: 65 minutes</Text>
        </View>
        <View style={styles.addButton}>
          <Link href="/modal" asChild>
            <Pressable hitSlop={20} children={({ pressed }) => (
              <MaterialIcons name="add-circle" size={30} color={pressed ? "gray" : "black"} />
            )}/>
          </Link>
        </View>
      </View>
      <View style={styles.mainContainer}>
        <DraggableFlatList
          data={data}
          renderItem={renderItem}
          onDragEnd={({ data }) => setData(data)}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          activationDistance={20}
        />
      </View>
      <View style={styles.footerContainer}>
        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Finish Workout</Text>
        </Pressable>
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
  addButton: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 8,
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
