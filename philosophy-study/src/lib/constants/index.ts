export const APP_CONFIG = {
  title: 'Triết Học Mác - Lênin',
  description: 'Hệ thống ôn tập triết học Mác - Lênin',
  version: '1.0.0',
  theme: {
    primary: '#1f2937',
    secondary: '#64748b',
    accent: '#22c55e',
    background: '#f8fafc',
    text: '#0f172a',
    muted: '#64748b'
  }
};

export const STORAGE_KEYS = {
  USER_PROGRESS: 'philosophy_user_progress',
  USER_SETTINGS: 'philosophy_user_settings',
  OFFLINE_DATA: 'philosophy_offline_data'
};

export const SPACED_REPETITION = {
  EASY_INTERVAL: 7,    // days
  MEDIUM_INTERVAL: 3,  // days
  HARD_INTERVAL: 1,    // days
  MAX_INTERVAL: 30     // days
};

export const TEST_CONFIG = {
  DEFAULT_DURATION: 10, // minutes
  PASSING_SCORE: 70,    // percentage
  TIMER_WARNING: 2      // minutes
};

export const VALIDATION = {
  SUMMARY_MAX_LENGTH: 300,
  QUESTION_MIN_OPTIONS: 2,
  QUESTION_MAX_OPTIONS: 4
};