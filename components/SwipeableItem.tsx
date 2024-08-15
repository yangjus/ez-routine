import SwipeableItem, { useSwipeableItemParams } from 'react-native-swipeable-item';
import { dataProps } from '@/data/placeholders';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Item from './Item';
import {
  View,
  StyleSheet,
  Pressable
} from "react-native";
import { RenderItemParams } from 'react-native-draggable-flatlist';

const SNAP_POINTS_LEFT: number = 60;
const SNAP_POINTS_RIGHT: number = 60;

const UnderlayLeft = () => {
  const { close } = useSwipeableItemParams();
  return (
    <View style={[styles.row, styles.underlayLeft]}>
      <Pressable onPress={() => close()}>
        <MaterialIcons name="delete" size={30} color="white" />
      </Pressable>
    </View>
  );
};

const UnderlayRight = () => {
  const { close } = useSwipeableItemParams();
  return (
    <View style={[styles.row, styles.underlayRight]}>
      <Pressable onPress={() => close()}>
        <MaterialIcons name="edit" size={30} color="white" />
      </Pressable>
    </View>
  );
};

export default function SwipeItem({props}: {props: RenderItemParams<dataProps>}) {
  const {item, drag, isActive} = props;

  return (
    <SwipeableItem
      item={item}
      renderUnderlayLeft={() => <UnderlayLeft />}
      renderUnderlayRight={() => <UnderlayRight />}
      snapPointsLeft={[SNAP_POINTS_LEFT]}
      snapPointsRight={[SNAP_POINTS_RIGHT]}
    >
      <Item
        title={item.title}
        minRep={item.repRange[0]}
        maxRep={item.repRange[1]}
        sets={item.sets}
        content={item.content}
        rearrange={drag}
        disableRearrange={isActive}
      />
    </SwipeableItem>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    margin: 0
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