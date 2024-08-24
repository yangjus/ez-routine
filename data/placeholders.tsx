export type contentProps = {
  id: string
  weight: number
  reps: number
}

export type dataProps = {
  id: string
  title: string
  repRange: number[]
  sets: number
  content: contentProps[]
}

export const data_placeholder: dataProps[] = [
  {
    id: '1',
    title: 'Barbell Row (bar +)',
    repRange: [6, 10],
    sets: 4,
    content: [
      { id: '1-1', weight: 80, reps: 8 },
      { id: '1-2', weight: 90, reps: 8 },
      { id: '1-3', weight: 90, reps: 9 },
      { id: '1-4', weight: 90, reps: 10 },
    ],
  },
  {
    id: '2',
    title: 'Lat Pulldown',
    repRange: [8, 12],
    sets: 3,
    content: [
      { id: '2-1', weight: 80, reps: 10 },
      { id: '2-2', weight: 80, reps: 12 },
      { id: '2-3', weight: 80, reps: 12 },
    ],
  },
  {
    id: '3',
    title: 'Cable Row',
    repRange: [10, 15],
    sets: 3,
    content: [
      { id: '3-1', weight: 60, reps: 15 },
      { id: '3-2', weight: 70, reps: 10 },
      { id: '3-3', weight: 70, reps: 10 },
    ],
  },
  {
    id: '4',
    title: 'Rear Delt Flys',
    repRange: [10, 15],
    sets: 3,
    content: [
      { id: '4-1', weight: 80, reps: 13 },
      { id: '4-2', weight: 80, reps: 13 },
      { id: '4-3', weight: 100, reps: 12 },
    ],
  },
  {
    id: '5',
    title: 'Upright Row',
    repRange: [8, 12],
    sets: 4,
    content: [
      { id: '5-1', weight: 50, reps: 8 },
      { id: '5-2', weight: 50, reps: 10 },
      { id: '5-3', weight: 50, reps: 10 },
      { id: '5-4', weight: 50, reps: 10 },
    ],
  },
  {
    id: '6',
    title: 'Standing Calf Raise (bar +)',
    repRange: [8, 12],
    sets: 4,
    content: [
      { id: '6-1', weight: 140, reps: 12 },
      { id: '6-2', weight: 160, reps: 10 },
      { id: '6-3', weight: 160, reps: 10 },
      { id: '6-4', weight: 160, reps: 10 },
    ],
  }

];