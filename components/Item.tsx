import { contentProps, dataProps } from "@/data/placeholders";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable
} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type ItemProps = {
  id: string
  title: string
  minRep: number
  maxRep: number
  sets: number
  content: contentProps[]
  rearrange: any
  disableRearrange: boolean
};

const SetItem = ({ item, parentId }: { item: contentProps, parentId: string }) => {
  const [isComplete, setComplete] = useState<boolean>();

  useEffect(() => {
    setComplete(item.check);
  }, [item.check])

  const setId: string = item.id;
  
  const saveComplete = async () => {
    // change in storage based on parentId and item.id
    const jsonValue = await AsyncStorage.getItem('@data');
    const data: dataProps[] = jsonValue != null ? JSON.parse(jsonValue) : [];
    console.log(data)
    const setData: dataProps[] = data!.map((item: dataProps) => ({
      ...item,
      content: item.content.map((set: contentProps) => ({
        ...set,
        check: item.id === parentId && set.id === setId ? !isComplete : set.check,
      })),
    }));
    await AsyncStorage.setItem('@data', JSON.stringify(setData));
    setComplete(!isComplete);
  };

  return (
    <Pressable onPress={() => saveComplete()}>
      <View style={[styles.setContainer, isComplete && styles.isComplete]}>
        <View style={{ flex: 1 }}>
          <Text>{item.weight} lbs</Text>
          <Text>{item.reps} reps</Text>
        </View>
        {isComplete && <MaterialIcons name="check-circle-outline" size={24} color="green" />}
      </View>
    </Pressable>
  );
};

export default function Item({
  id,
  title,
  minRep,
  maxRep,
  sets,
  content,
  rearrange,
  disableRearrange
}: ItemProps) {

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{title}</Text>
        <Pressable
          onLongPress={rearrange}
          disabled={disableRearrange}
          hitSlop={10}
        >
          <MaterialIcons name="reorder" size={24} color="black" />
        </Pressable>
      </View>
      <Text style={styles.subheader}>Reps: {minRep} - {maxRep} | Sets: {sets}</Text>
      <FlatList
        data={content}
        renderItem={({ item }) =>
          <SetItem item={item} parentId={id}/>
        }
        horizontal={true}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  header: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
    flexWrap: 'wrap',
  },
  subheader: {
    fontSize: 14,
    marginVertical: 6
  },
  setContainer: {
    flex: 1,
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
  },
  isComplete: {
    backgroundColor: '#90EE90',
    paddingHorizontal: 10,
  }
});