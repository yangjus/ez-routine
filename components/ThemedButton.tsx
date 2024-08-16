import { GestureResponderEvent, Pressable, StyleSheet, Text } from "react-native";

type ThemedButtonProps = {
  content: string
  onPress: (event: GestureResponderEvent) => void
}

export default function ThemedButton({ content, onPress }: ThemedButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{content}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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