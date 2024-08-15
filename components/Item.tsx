import { contentProps } from "@/data/placeholders";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable
} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type ItemProps = {
  title: string
  minRep: number
  maxRep: number
  sets: number
  content: contentProps[]
  rearrange: any
  disableRearrange: boolean
};

const SetItem = ({ weight, reps }: contentProps) => {
  return (
    <View style={styles.setContainer}>
      <Text>{weight} lbs</Text>
      <Text>{reps} reps</Text>
    </View>
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
        >
          <MaterialIcons name="reorder" size={24} color="black" />
        </Pressable>
      </View>
      <Text style={styles.subheader}>Reps: {minRep} - {maxRep} | Sets: {sets}</Text>
      <FlatList
        data={content}
        renderItem={({ item }) =>
          <SetItem weight={item.weight} reps={item.reps} />
        }
        horizontal={true}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#F2F2F2',
    borderRadius: 8
  }
});