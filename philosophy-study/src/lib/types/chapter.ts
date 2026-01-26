import { Test } from './test';
import { Flashcard } from './flashcard';

export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  imageUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  chapterId: string;
  order: number;
  content?: string;
  sections?: Section[];
  summary: string;
  flashcards: Flashcard[];
  test: Test;
}

export interface Section {
  id: string;
  title: string;
  content: string;
}
