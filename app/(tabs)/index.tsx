import {
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  View,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { FlatList } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import AccordionItem from "@/components/AccordionItem";
import { useSharedValue } from "react-native-reanimated";
import useWorkouts, { Workout } from "@/hooks/useWorkouts";
import { Link } from "expo-router";

interface Day {
  id: number;
  day: string;
};


const DayItem = ({ item }: { item: Day }) => {
  const { data: workouts } = useWorkouts(item.id);
  console.log("workouts: ", workouts);

  const open = useSharedValue(false);
  const onPress = () => {
    open.value = !open.value;
  };

  return (
    <View style={itemStyles.mainContainer}>
      <Pressable style={itemStyles.dayContainer} onPress={onPress}>
        <Text style={itemStyles.dayText}>{item.day}</Text>
      </Pressable>
      <AccordionItem isExpanded={open} viewKey="Accordion">
        {workouts ?
          workouts.length > 0 ?
            workouts.map((workout: Workout) =>
              <Link
                href={{
                  pathname: "/routine",
                  params: { dayOfWeek: item.day, workoutId: workout.id },
                }}
                key={`${workout.id}`}
                asChild
              >
                <TouchableOpacity style={itemStyles.workoutContainer}>
                  <Text style={itemStyles.workoutText}>{workout.name}</Text>
                </TouchableOpacity>
              </Link>)
            : <View style={itemStyles.workoutContainer}>
              <Text style={itemStyles.noWorkoutText}>Add workouts to this day in the workouts tab.</Text>
            </View>
          : <ActivityIndicator />}
      </AccordionItem>
    </View>
  );
};

const renderItem = ({ item }: { item: Day }) => <DayItem item={item} />;

export default function Index() {
  const db = useSQLiteContext();
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    const setup = async () => {
      const allDays = await db.getAllAsync<Day>('SELECT * FROM days');
      setDays(allDays);
    }
    setup();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>EZ Routine</Text>
        <Text style={styles.subheader}>"Results happen over time, not overnight"</Text>
      </View>
      <View style={styles.mainContainer}>
        <FlatList
          data={days}
          renderItem={renderItem}
          keyExtractor={(item: Day) => `${item.id}`}
          contentContainerStyle={{ gap: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
    marginBottom: 30,
  },
  headerContainer: {
    alignItems: "center",
    gap: 10,
    marginVertical: 20,
    marginBottom: 20,
  },
  header: {
    fontWeight: "bold",
    fontSize: 36,
  },
  subheader: {
    fontStyle: "italic",
  },
  mainContainer: {
    flex: 1,
    width: "100%",
  },
});

const itemStyles = StyleSheet.create({
  mainContainer: {
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  dayContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 10,
  },
  workoutContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopWidth: 1,
    borderColor: 'lightgrey',
    width: '100%',
  },
  dayText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  workoutText: {
    fontSize: 16,
    textAlign: "center",
  },
  noWorkoutText: {
    fontSize: 16,
    color: 'grey',
    fontStyle: 'italic',
    textAlign: "center",
  }
});
