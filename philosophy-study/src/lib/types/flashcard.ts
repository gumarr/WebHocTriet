export type FlashcardDifficulty = "easy" | "medium" | "hard";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: FlashcardDifficulty;
  createdAt: Date;
  lastReviewed?: Date;
  reviewCount: number;
  correctCount: number;
  isMarked: boolean;
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
