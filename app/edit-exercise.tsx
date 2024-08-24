import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { contentProps, dataProps } from '@/data/placeholders';
import Modal, { modalProps, weightProps } from '../components/ExerciseModal';
import { useEffect, useState } from 'react';
import { weightPlaceholder } from './add-exercise';
import { UnknownOutputParams, useLocalSearchParams } from "expo-router";
import { Text } from 'react-native';

export default function EditExercise() {
  const props: UnknownOutputParams = useLocalSearchParams();
  const { exerciseId } = props;
  const [text, onChangeText] = useState<string>('');
  const [repRange, setRepRange] = useState<number[]>([1, 20]);
  const [numSets, setNumSets] = useState<number>(0);
  const [weights, setWeights] = useState<weightProps[]>(weightPlaceholder);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@data');
        const data: dataProps[] = jsonValue != null ? JSON.parse(jsonValue) : [];
        const exercise: dataProps | undefined = data.find((e: dataProps) => {
          return e.id === exerciseId;
        });
        if (exercise !== undefined) {
          onChangeText(exercise.title);
          setRepRange(exercise.repRange);
          setNumSets(exercise.sets);
          // format content
          const initialWeights: weightProps[] = exercise.content.map((item: contentProps) => ({
            id: item.id,
            weight: String(item.weight),
            reps: String(item.reps),
          }));
          // fill in rest of empty sets
          setWeights([...initialWeights, ...weightPlaceholder.splice(exercise.sets)]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  const editItemFromStorage = async ({ text, repRange, numSets, weights }: modalProps) => {
    const content: contentProps[] = weights!.splice(0, numSets).map((item: weightProps) => ({
      // change id only if need a new uuid (placeholder before)
      id: item.id.length > 2 ? item.id : uuid.v4() as string,
      weight: Number(item.weight),
      reps: Number(item.reps),
    }));
    const newItem: dataProps = {
      id: exerciseId as string,
      title: text!,
      repRange: repRange!,
      sets: numSets!,
      content
    };
    const jsonValue = await AsyncStorage.getItem('@data');
    const data: dataProps[] = jsonValue != null ? JSON.parse(jsonValue) : [];
    const newData: dataProps[] = data.map((item: dataProps) =>
      item.id === exerciseId ? newItem : item
    );
    await AsyncStorage.setItem('@data', JSON.stringify(newData));
  };

  //TODO: Handle loading of data better (better styling)
  if (isLoading) {
    return (
      <Text>
        Loading...
      </Text>
    );
  };

  return (
    <Modal 
      props={{ text, repRange, numSets, weights }} 
      func={editItemFromStorage} 
      onPressAlertContent='Edited'
      onPressButtonContent='Edit'
    />
  );
};
