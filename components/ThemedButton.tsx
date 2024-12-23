import { GestureResponderEvent, Pressable, StyleSheet, Text } from "react-native";

type ThemedButtonProps = {
  content: string
  onPress: (event: GestureResponderEvent) => void
  isSelected?: boolean
  type?: string
}

export default function ThemedButton({ content, onPress, type = "default", isSelected = false }: ThemedButtonProps) {
  const buttonStyle = [
    styles.button,
    type === "warning" && styles.warningButton,
    isSelected && styles.selectedButton,
  ];

  const buttonTextStyle = [
    styles.buttonText,
    type === "warning" && styles.warningButtonText,
    isSelected && styles.selectedButtonText,
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
  selectedButton: {
    backgroundColor: 'white',
  },
  selectedButtonText: {
    color: 'black',
  },
  warningButton: {
    backgroundColor: "#DC143C",
  },
  warningButtonText: {
    color: "white",
  },
});