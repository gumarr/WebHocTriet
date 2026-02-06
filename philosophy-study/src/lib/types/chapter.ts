import { Test } from './test';
import { Flashcard } from './flashcard';
import { Section } from './lesson';

export interface Chapter {
  id: string;
  title: string;
  description: string;
  display_order: number;
  lessons: ChapterLesson[];
  image_url?: string;
  updated_at?: string;
}

export interface ChapterLesson {
  id: string;
  title: string;
  chapter_id: string;
  display_order: number;
  content?: string;
  sections?: Section[];
  summary: string;
  flashcards: Flashcard[];
  test: Test;
}
