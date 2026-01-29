export interface Lesson {
  id: string;
  title: string;
  chapter_id: string;
  display_order: number;
  content?: string;
  sections?: Section[];
  summary: string;
  flashcards: LessonFlashcard[];
  test: LessonTest;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  display_order: number;
  lesson_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LessonFlashcard {
  lesson_id: string;
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  created_at: Date;
  last_reviewed?: Date;
  review_count: number;
  correct_count: number;
  is_marked: boolean;
}

export interface LessonTest {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  questions: TestQuestion[];
  lessonIds: string[];
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}
