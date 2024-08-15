import { contentProps } from "@/data/placeholders";
import { View, Text, StyleSheet, FlatList } from "react-native";

type ItemProps = { 
  title: string
  minRep: number
  maxRep: number
  sets: number
  content: contentProps[]
};

const SetItem = ({weight, reps}: contentProps) => {
  return (
    <View style={styles.setContainer}>
      <Text>{weight} lbs</Text>
      <Text>for {reps}</Text>
    </View>
  );
};

export default function Item({ title, minRep, maxRep, sets, content }: ItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <Text style={styles.subheader}>Reps: {minRep} - {maxRep} | Sets: {sets}</Text>
      <FlatList 
        data={content}
        renderItem={({item}) => 
          <SetItem weight={item.weight} reps={item.reps}/>
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