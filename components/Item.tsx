import { contentProps } from "@/data/placeholders";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable
} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from "react";

type ItemProps = {
  title: string
  minRep: number
  maxRep: number
  sets: number
  content: contentProps[]
  rearrange: any
  disableRearrange: boolean
};

const SetItem = ({ item }: { item: contentProps }) => {
  const [isComplete, setComplete] = useState<boolean>(false);

  return (
    <Pressable onPress={() => setComplete(!isComplete)}>
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
          <SetItem item={item} />
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
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
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