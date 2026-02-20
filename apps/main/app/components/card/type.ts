import type { StaticImageData } from 'next/image';
export interface quizType {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  image: StaticImageData | string;
  sold?:string|number
};