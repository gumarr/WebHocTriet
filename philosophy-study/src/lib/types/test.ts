export interface Test {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  passingScore: number; // percentage
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