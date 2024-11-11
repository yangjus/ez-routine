import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Platform,
  TextInput,
} from "react-native";
import { dataProps } from "@/data/placeholders";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SwipeItem from "@/components/SwipeableItem";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { useState } from "react";
import {
  Link,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import ThemedButton from "@/components/ThemedButton";

export default function AddWorkout() {
  const [data, setData] = useState<dataProps[]>([]);
  const [name, onChangeName] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const onPress = async () => {
    alert("Workout created successfully.");
  };

  const onDelete = async () => {
    console.log("delete");
  }

  const renderItem = (params: RenderItemParams<dataProps>) => {
    return (
      <ScaleDecorator>
        <SwipeItem props={params} onDelete={onDelete} />
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <TextInput
            style={[styles.input, isFocused && { borderWidth: 2, borderColor: '#378CFD' }]}
            onChangeText={onChangeName}
            value={name}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            placeholder="Workout name..."
          />
        </View>
        <View style={styles.addButton}>
          <Link href="/routine/add-exercise" asChild>
            <Pressable
              hitSlop={20}
              children={({ pressed }) => (
                <MaterialIcons
                  name="add-circle"
                  size={30}
                  color={pressed ? "gray" : "black"}
                />
              )}
            />
          </Link>
        </View>
      </View>
      <View style={styles.mainContainer}>
        <DraggableFlatList
          data={data ?? []}
          renderItem={renderItem}
          onDragEnd={({ data }) => setData(data)}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          activationDistance={20}
          ListEmptyComponent={<EmptyContainer />}
        />
      </View>
      <View style={styles.footerContainer}>
        <ThemedButton content={"Create Workout"} onPress={onPress} />
      </View>
      <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
    </SafeAreaView>
  );
}

const EmptyContainer = () => {
  return (
    <View>
      <Text>No exercises added. Press + icon on top right to add exercises.</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    width: '100%',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 24,
    borderColor: '#D3D3D3',
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    gap: 20,
  },
  textContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "flex-start",
  },
  header: {
    fontWeight: "bold",
    fontSize: 30,
  },
  addButton: {
    justifyContent: "center",
  },
  mainContainer: {
    flex: 1,
    width: "100%",
  },
  footerContainer: {
    marginVertical: 4,
  },
});
