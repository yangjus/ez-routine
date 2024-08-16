import {
  View,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Slider } from '@miblanchard/react-native-slider';
import { FlatList } from 'react-native-gesture-handler';

const MAX_NUM_SETS = 10;
const MAX_REPS = 20;

const weightPlaceholder: weightProps[] =
  Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
    weight: 0,
    reps: 1,
  }))

type weightProps = {
  id: string,
  weight: number,
  reps: number,
}

const Separator = ({ text }: { text: string }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
      <View>
        <Text style={{ paddingHorizontal: 8, textAlign: 'center' }}>{text}</Text>
      </View>
      <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
    </View>
  );
};

export default function Modal() {
  const isPresented = router.canGoBack();
  const [text, onChangeText] = useState<string>('');
  const [repRange, setRepRange] = useState<number[]>([1, 20]);
  const [numSets, setNumSets] = useState<number>(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [weights, setWeights] = useState<weightProps[]>(weightPlaceholder);

  const onPress = () => {
    alert(`Exercise Added: ${repRange[0]} - ${repRange[1]} ${text} x ${numSets}`);
  };

  return (
    <View style={styles.container}>
      {!isPresented && <Link href="../">Dismiss</Link>}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : 'height'}
        style={styles.formContainer}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.fieldName}>Exercise Name</Text>
          <TextInput
            style={[styles.input, isFocused && { borderWidth: 2, borderColor: '#378CFD' }]}
            onChangeText={onChangeText}
            value={text}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.fieldName}>Number of Sets</Text>
          <FlatList
            data={[...Array(MAX_NUM_SETS).keys()].map(x => x + 1)}
            renderItem={({ item }) =>
              <Pressable style={[styles.radioButton, numSets === item && styles.selectedRadioButton]} onPress={() => setNumSets(item)}>
                <Text style={[{ fontSize: 20 }, numSets === item && { color: '#fff' }]}>{item}</Text>
              </Pressable>
            }
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.fieldName}>Range of Reps</Text>
          <View style={styles.rangeLabels}>
            <Text style={{ fontSize: 16 }}>{repRange[0]}</Text>
            <Text style={{ fontSize: 16 }}>{repRange[1]}</Text>
          </View>
          <Slider
            trackStyle={{ height: 5 }}
            thumbStyle={styles.sliderThumbStyle}
            animateTransitions
            maximumTrackTintColor="#d3d3d3"
            maximumValue={MAX_REPS}
            minimumTrackTintColor="#378CFD"
            minimumValue={1}
            thumbTouchSize={{
              width: 40,
              height: 40,
            }}
            step={1}
            value={repRange}
            onValueChange={value => setRepRange(value)}
            thumbTintColor="#fff"
          />
        </View>
        <View style={styles.inputContainer}>
          <Separator text={"Weights"} />
        </View>
        <View style={styles.inputContainer}>
          <FlatList
            data={weights.slice(0, numSets)}
            renderItem={({ item }) =>
              <View style={styles.gridItem}>
                <Text>Set {item.id}:</Text>
                <Text>{item.weight}</Text>
                <Text>{item.reps}</Text>
              </View>
            }
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Finish Workout</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
    alignContent: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    width: '100%',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 24,
    borderColor: '#D3D3D3',
  },
  fieldName: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 20,
  },
  radioButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#D3D3D3',
    borderWidth: 1,
  },
  sliderThumbStyle: {
    height: 30,
    width: 30,
    borderColor: '#378CFD',
    borderWidth: 4,
    borderRadius: 50,
  },
  selectedRadioButton: {
    backgroundColor: '#378CFD',
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 6
  },
  gridItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 20,
  },
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
