import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { contentProps, dataProps } from '@/data/placeholders';
import Modal, { modalProps, weightProps } from '../components/modal';

const weightPlaceholder: weightProps[] =
  Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
    weight: '0',
    reps: '1',
  }));

const initialInput: modalProps = {
    text: '',
    repRange: [1, 20],
    numSets: 0,
    weights: weightPlaceholder,
  };

export default function AddExercise() {

  const addItemToStorage = async ({text, repRange, numSets, weights}: modalProps) => {
    const id: string = uuid.v4() as string;
    const content: contentProps[] = weights.splice(0, numSets).map((item: weightProps) => ({
      id: uuid.v4() as string,
      weight: Number(item.weight),
      reps: Number(item.reps)
    }));
    const newItem = {
      id,
      title: text,
      repRange,
      sets: numSets,
      content
    };
    const jsonValue = await AsyncStorage.getItem('@data');
    const data: dataProps[] = jsonValue != null ? JSON.parse(jsonValue) : [];
    await AsyncStorage.setItem('@data', JSON.stringify([newItem, ...data]));
  };

  return (
    <Modal props={initialInput} func={addItemToStorage}/>
  );
};
