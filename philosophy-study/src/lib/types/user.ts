export interface UserProgress {
  id: string;
  userId: string;
  chapterId: string;
  lessonId: string;
  progress: number;
  completedAt?: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  studyReminder: boolean;
  dailyGoal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalStudyTime: number;
  totalLessonsCompleted: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestResult {
  id: string;
  userId: string;
  lessonId: string;
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number;
  createdAt: Date;
}
