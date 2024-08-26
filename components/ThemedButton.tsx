import { GestureResponderEvent, Pressable, StyleSheet, Text } from "react-native";

type ThemedButtonProps = {
  content: string
  onPress: (event: GestureResponderEvent) => void
  type?: string
}

export default function ThemedButton({ content, onPress, type = "default" }: ThemedButtonProps) {
  const buttonStyle = [
    styles.button,
    type === "warning" && styles.warningButton,
  ];

  const buttonTextStyle = [
    styles.buttonText,
    type === "warning" && styles.warningButtonText,
  ];

  return (
    <Pressable style={buttonStyle} onPress={onPress}>
      <Text style={buttonTextStyle}>{content}</Text>
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
  warningButton: {
    backgroundColor: "#DC143C",
  },
  warningButtonText: {
    color: "white",
  },
});