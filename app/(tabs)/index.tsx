import {
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { FlatList } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import Animated, { SharedValue, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";

function AccordionItem({
  isExpanded,
  children,
  viewKey,
  duration = 500,
}: { isExpanded: SharedValue<boolean>, children: any, viewKey: string, duration?: number }) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    })
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View
      key={`accordionItem_${viewKey}`}
      style={[accordionStyles.animatedView, bodyStyle]}>
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={accordionStyles.wrapper}>
        {children}
      </View>
    </Animated.View>
  );
}

const DayItem = ({ item }: { item: Day }) => {
  const open = useSharedValue(false);
  const onPress = () => {
    open.value = !open.value;
  };

  const temp: string[] = [
    'Workout 1',
    'A very long workout name that no one knows about',
  ];

  return (
    <View style={itemStyles.mainContainer}>
      {/* <Link
        href={{
          pathname: "/routine",
          params: { dayOfWeek: item.day },
        }}
        asChild
      > */}
      <Pressable style={itemStyles.dayContainer} onPress={onPress}>
        <Text style={itemStyles.dayText}>{item.day}</Text>
      </Pressable>
      {/* </Link> */}
      <AccordionItem isExpanded={open} viewKey="Accordion">
        {temp.map((workout: string, idx: number) =>
          <TouchableOpacity style={itemStyles.workoutContainer} key={`${item.id}-${idx}`}>
            <Text style={itemStyles.workoutText}>{workout}</Text>
          </TouchableOpacity>
        )}
      </AccordionItem>
    </View>
  );
};

const renderItem = ({ item }: { item: Day }) => <DayItem item={item} />;

interface Day {
  id: number;
  day: string;
};

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
        <Text>"Results happen over time, not overnight"</Text>
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
    padding: 12,
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
  }
});

const accordionStyles = StyleSheet.create({
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },
  wrapper: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  },
});
