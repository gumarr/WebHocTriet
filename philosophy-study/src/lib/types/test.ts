export interface Test {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  total_questions: number;
  passing_score: number; // percentage
  questions: TestQuestion[];
  created_at: Date;
  updated_at: Date;
}

export interface TestLesson {
  id: string;
  test_id: string;
  lesson_id: string;
  display_order: number;
  created_at: Date;
  updated_at: Date;
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

export interface TestResult {
  id: string;
  testId: string;
  lessonId: string;
  score: number; // percentage
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  answers: TestAnswer[];
  completedAt: Date;
}

export interface TestAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

export interface TestSession {
  id: string;
  testId: string;
  startTime: Date;
  currentQuestionIndex: number;
  answers: TestAnswer[];
  timeRemaining: number; // in seconds
}
