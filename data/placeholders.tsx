export type contentProps = {
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

export const data_placeholder = [
  {
    id: '1',
    title: 'Barbell Row (bar +)',
    repRange: [6, 10],
    sets: 4,
    content: [
      { weight: 80, reps: 8 },
      { weight: 90, reps: 8 },
      { weight: 90, reps: 9 },
      { weight: 90, reps: 10 },
    ],
  },
  {
    id: '2',
    title: 'Lat Pulldown',
    repRange: [8, 12],
    sets: 3,
    content: [
      { weight: 80, reps: 10 },
      { weight: 80, reps: 12 },
      { weight: 80, reps: 12 },
    ],
  },
  {
    id: '3',
    title: 'Cable Row',
    repRange: [10, 15],
    sets: 3,
    content: [
      { weight: 60, reps: 15 },
      { weight: 70, reps: 10 },
      { weight: 70, reps: 10 },
    ],
  },
  {
    id: '4',
    title: 'Rear Delt Flys',
    repRange: [10, 15],
    sets: 3,
    content: [
      { weight: 80, reps: 13 },
      { weight: 80, reps: 13 },
      { weight: 100, reps: 12 },
    ],
  },
  {
    id: '5',
    title: 'Upright Row',
    repRange: [8, 12],
    sets: 4,
    content: [
      { weight: 50, reps: 8 },
      { weight: 50, reps: 10 },
      { weight: 50, reps: 10 },
    ],
  },
  {
    id: '6',
    title: 'Standing Calf Raise (bar +)',
    repRange: [8, 12],
    sets: 4,
    content: [
      { weight: 140, reps: 12 },
      { weight: 160, reps: 10 },
      { weight: 160, reps: 10 },
      { weight: 160, reps: 10 },
    ],
  }

];