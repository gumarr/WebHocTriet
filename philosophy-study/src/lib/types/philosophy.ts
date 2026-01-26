import { z } from 'zod';

// Schema validation for philosophy content
export const PhilosophyContentBlockSchema = z.object({
  heading: z.string(),
  body: z.string(),
  keywords: z.array(z.string()).optional(),
  uiHint: z.enum(['tabs', 'timeline', 'bento-grid', 'tree-diagram', 'comparison-table', 'split-view']),
});

export const PhilosophySectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  contentBlocks: z.array(PhilosophyContentBlockSchema),
});

export const PhilosophyLessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  sections: z.array(PhilosophySectionSchema),
  metadata: z.object({
    author: z.string(),
    version: z.string(),
    lastUpdated: z.string(),
  }),
});

// TypeScript interfaces
export interface PhilosophyContentBlock {
  heading: string;
  body: string;
  keywords?: string[];
  uiHint: 'tabs' | 'timeline' | 'bento-grid' | 'tree-diagram' | 'comparison-table' | 'split-view';
}

export interface PhilosophySection {
  id: string;
  title: string;
  summary: string;
  contentBlocks: PhilosophyContentBlock[];
}

export interface PhilosophyLesson {
  id: string;
  title: string;
  sections: PhilosophySection[];
  metadata: {
    author: string;
    version: string;
    lastUpdated: string;
  };
}

// Type guards for runtime validation
export const isValidPhilosophyContentBlock = (data: unknown): data is PhilosophyContentBlock => {
  return PhilosophyContentBlockSchema.safeParse(data).success;
};

export const isValidPhilosophySection = (data: unknown): data is PhilosophySection => {
  return PhilosophySectionSchema.safeParse(data).success;
};

export const isValidPhilosophyLesson = (data: unknown): data is PhilosophyLesson => {
  return PhilosophyLessonSchema.safeParse(data).success;
};

// Utility types for component props
export interface SectionRendererProps {
  section: PhilosophySection;
  onContentChange?: (content: string) => void;
}

export interface ContentBlockRendererProps {
  block: PhilosophyContentBlock;
  index: number;
}

// Animation configuration types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
}

// Navigation state types
export interface NavigationState {
  currentSectionIndex: number;
  totalSections: number;
  isAnimating: boolean;
}

// Theme types for philosophy application
export interface PhilosophyTheme {
  colors: {
    primary: {
      50: string;
      500: string;
      600: string;
      700: string;
    };
    background: {
      50: string;
      100: string;
      900: string;
    };
    accent: {
      emerald: string;
      amber: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      sm: string;
      base: string;
      lg: string;
      xl: string;
    };
  };
}

// Export default theme
export const philosophyTheme: PhilosophyTheme = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1e3a8a',
    },
    background: {
      50: '#f8fafc',
      100: '#e2e8f0',
      900: '#0f172a',
    },
    accent: {
      emerald: '#10b981',
      amber: '#f59e0b',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    fontSize: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  },
};