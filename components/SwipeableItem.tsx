import SwipeableItem, {
  useSwipeableItemParams,
} from "react-native-swipeable-item";
import { contentProps, dataProps } from "@/data/placeholders";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Item from "./Item";
import { View, StyleSheet, Pressable } from "react-native";
import { RenderItemParams } from "react-native-draggable-flatlist";
import { Link } from "expo-router";
import { useSets } from "@/hooks/useWorkouts";

const SNAP_POINTS_LEFT: number = 60;
const SNAP_POINTS_RIGHT: number = 60;

const UnderlayLeft = ({
  onDelete,
  id,
}: {
  onDelete: (id: string) => Promise<void>;
  id: string;
}) => {
  return (
    <View style={[styles.row, styles.underlayLeft]}>
      <Pressable
        onPress={() => onDelete(id)}
        hitSlop={{ top: 40, bottom: 40, left: 10, right: 10 }}
      >
        <MaterialIcons name="delete" size={30} color="white" />
      </Pressable>
    </View>
  );
};

const UnderlayRight = ({ id }: { id: string }) => {
  const { close } = useSwipeableItemParams();
  return (
    <View style={[styles.row, styles.underlayRight]}>
      <Link
        href={{
          pathname: "/routine/edit-exercise",
          params: { exerciseId: id },
        }}
        asChild
      >
        <Pressable
          onPress={() => close()}
          hitSlop={{ top: 40, bottom: 40, left: 10, right: 10 }}
        >
          <MaterialIcons name="edit" size={30} color="white" />
        </Pressable>
      </Link>
    </View>
  );
};

export default function SwipeItem({
  props,
  onDelete,
}: {
  props: RenderItemParams<dataProps>;
  onDelete: (id: string) => Promise<void>;
}) {
  const { item, drag, isActive } = props;
  const { data: sets } = useSets(parseInt(item.id as string));

  return (
    <SwipeableItem
      item={item}
      renderUnderlayLeft={() => (
        <UnderlayLeft onDelete={onDelete} id={item.id} />
      )}
      renderUnderlayRight={() => <UnderlayRight id={item.id} />}
      snapPointsLeft={[SNAP_POINTS_LEFT]}
      snapPointsRight={[SNAP_POINTS_RIGHT]}
      key={item.id}
    >
      <Item
        title={item.title}
        minRep={item.repRange[0]}
        maxRep={item.repRange[1]}
        sets={sets?.length ?? 0}
        content={sets as contentProps[]}
        rearrange={drag}
        disableRearrange={isActive}
      />
    </SwipeableItem>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    margin: 0,
  },
  underlayLeft: {
    flex: 1,
    backgroundColor: "#FF3131",
    justifyContent: "flex-end",
    borderRadius: 10,
    marginVertical: 10,
  },
  underlayRight: {
    flex: 1,
    backgroundColor: "#0096FF",
    justifyContent: "flex-start",
    borderRadius: 10,
    marginVertical: 10,
  },
});
