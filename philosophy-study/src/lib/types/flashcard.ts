export type FlashcardDifficulty = "easy" | "medium" | "hard";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: FlashcardDifficulty;
  created_at: Date;
  lastReviewed?: Date;
  review_count: number;
  correct_count: number;
  is_marked: boolean;
  lesson_id?: string;
}

export interface FlashcardProgress {
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  newCards: number;
}

export interface SpacedRepetitionConfig {
  easyInterval: number; // days
  mediumInterval: number; // days
  hardInterval: number; // days
  maxInterval: number; // days
}
