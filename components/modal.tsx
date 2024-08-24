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
import ThemedButton from '@/components/ThemedButton';

const MAX_NUM_SETS = 10;
const MAX_REPS = 20;

const weightPlaceholder: weightProps[] =
  Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
    weight: '0',
    reps: '1',
  }))

export type weightProps = {
  id: string,
  weight: string,
  reps: string,
}

export type modalProps = {
  text: string,
  repRange: number[],
  numSets: number,
  weights: weightProps[],
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

export default function Modal( 
  {props, func} : {
    props: modalProps, 
    func: ({text, repRange, numSets, weights}: modalProps) => Promise<void>
  }) {
  const isPresented = router.canGoBack();
  const [text, onChangeText] = useState<string>(props.text);
  const [repRange, setRepRange] = useState<number[]>(props.repRange);
  const [numSets, setNumSets] = useState<number>(props.numSets);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [weights, setWeights] = useState<weightProps[]>(props.weights);

  const onPress = async () => {
    if (text.trim() === '') {
      alert("Add exercise name");
      return;
    }
    console.log(numSets);
    await func({text, repRange, numSets, weights});
    onChangeText('');
    setRepRange([1, 20]);
    setNumSets(0);
    setIsFocused(false);
    setWeights(weightPlaceholder);
    alert(`Added exercise: ${text}`);
    router.back();
  };

  return (
    <View style={styles.container}>
      {!isPresented && <Link href="../">Dismiss</Link>}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : 'height'}
        style={styles.formContainer}
      >
        {/* Exercise Name */}
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
        {/* Number of Sets */}
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
        {/* Range of Reps */}
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
        {/* Separator */}
        <View style={styles.inputContainer}>
          <Separator text={"Weights"} />
        </View>
        {/* Weights */}
        <View style={styles.inputContainer}>
          <FlatList
            data={weights.slice(0, numSets)}
            style={{ flexGrow: 0, height: 200 }}
            renderItem={({ item, index }) =>
              <View style={styles.gridItem}>
                <Text style={{ fontSize: 20 }}>Set {item.id}: </Text>
                <TextInput
                  style={styles.weightInput}
                  value={weights[index].weight}
                  onChangeText={(text) => setWeights(
                    (prev) => {
                      const newWeight = [...prev];
                      newWeight[index].weight = text;
                      return newWeight;
                    }
                  )}
                  keyboardType='numeric'
                />
                <Text style={{ fontSize: 20 }}>lbs</Text>
                <TextInput
                  style={[styles.weightInput, { width: 60 }]}
                  value={weights[index].reps}
                  onChangeText={(text) => setWeights(
                    (prev) => {
                      const newWeight = [...prev];
                      newWeight[index].reps = text;
                      return newWeight;
                    }
                  )}
                  keyboardType='numeric'
                />
                <Text style={{ fontSize: 20 }}>reps</Text>
              </View>
            }
            keyExtractor={item => item.id}
            contentContainerStyle={{ gap: 10 }}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedButton content={"Add Exercise"} onPress={onPress} />
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
    gap: 10,
    alignItems: 'center',
  },
  weightInput: {
    height: 50,
    backgroundColor: '#fff',
    width: 80,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 20,
    borderColor: '#D3D3D3',
  }
});
