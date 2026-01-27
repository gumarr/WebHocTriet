'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../utils/storage';
import { supabaseServices } from '../supabase/services';

interface UserProgress {
  completedLessons: string[];
  flashcardProgress: Record<string, {
    total: number;
    mastered: number;
    due: number;
  }>;
  testResults: Record<string, {
    score: number;
    completedAt: Date;
  }>;
}

interface AppContextType {
  userProgress: UserProgress;
  updateUserProgress: (progress: Partial<UserProgress>) => void;
  resetProgress: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const savedProgress = storage.getItem<UserProgress>('user_progress');
    return savedProgress || {
      completedLessons: [],
      flashcardProgress: {},
      testResults: {}
    };
  });

  useEffect(() => {
    storage.setItem('user_progress', userProgress);
  }, [userProgress]);

  const updateUserProgress = (progress: Partial<UserProgress>) => {
    setUserProgress(prev => ({
      ...prev,
      ...progress
    }));
  };

  const resetProgress = () => {
    const initialProgress: UserProgress = {
      completedLessons: [],
      flashcardProgress: {},
      testResults: {}
    };
    setUserProgress(initialProgress);
    storage.setItem('user_progress', initialProgress);
  };

  const contextValue: AppContextType = {
    userProgress,
    updateUserProgress,
    resetProgress
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};