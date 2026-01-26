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

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  lastReviewed?: Date;
  reviewCount: number;
  correctCount: number;
  isMarked: boolean;
}

export interface Test {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  questions: TestQuestion[];
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}
