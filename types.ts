export interface Person {
  id: string;
  name: string;
  birthday: string;
  status: 'alive' | 'deceased';
  photoUrl: string;
  notes: string;
  profession?: string;
}