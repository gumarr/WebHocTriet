import { Test } from './test';
import { Flashcard } from './flashcard';
import { Section } from './lesson';

export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  image_url?: string;
  updated_at?: string;
}

export interface Lesson {
  id: string;
  title: string;
  chapter_id: string;
  order: number;
  content?: string;
  sections?: Section[];
  summary: string;
  flashcards: Flashcard[];
  test: Test;
}