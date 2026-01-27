import {
  PhilosophyLesson,
  PhilosophySection,
  PhilosophyContentBlock,
} from "../types/philosophy";
import { Lesson } from "../types/lesson";

/**
 * Data processing pipeline for philosophy content
 * Converts raw lesson data to philosophy-specific types with validation
 */

// Convert lesson data to philosophy format
export function convertToPhilosophyLesson(lesson: Lesson): PhilosophyLesson {
  // Parse the content string into sections
  const contentBlocks = parsePhilosophyMarkdown(lesson.content || "");

  // Group content blocks into sections based on headings
  const sections = groupContentBlocksIntoSections(contentBlocks);

  return {
    id: lesson.id,
    title: lesson.title,
    sections: sections,
    metadata: {
      author: "MLN111 Team",
      version: "1.0.0",
      lastUpdated: new Date().toISOString().split("T")[0],
    },
  };
}

// Group content blocks into sections based on headings
function groupContentBlocksIntoSections(
  contentBlocks: PhilosophyContentBlock[],
): PhilosophySection[] {
  const sections: PhilosophySection[] = [];
  let currentSection: PhilosophySection | null = null;

  contentBlocks.forEach((block) => {
    // Check if this block represents a new section (based on heading structure)
    if (
      block.heading &&
      (block.heading.includes("Chương") || block.heading.includes("##"))
    ) {
      // Create new section
      if (currentSection) {
        sections.push(currentSection);
      }

      currentSection = {
        id: `section-${sections.length + 1}`,
        title: block.heading,
        summary: block.body.substring(0, 200) + "...", // First 200 chars as summary
        contentBlocks: [block],
      };
    } else {
      // Add to current section or create default section
      if (!currentSection) {
        currentSection = {
          id: "section-intro",
          title: "Giới thiệu",
          summary: "Nội dung giới thiệu bài học",
          contentBlocks: [],
        };
      }
      currentSection.contentBlocks.push(block);
    }
  });

  // Add the last section
  if (currentSection) {
    sections.push(currentSection);
  }

  // If no sections were created, create one with all content
  if (sections.length === 0) {
    sections.push({
      id: "section-1",
      title: "Nội dung bài học",
      summary: "Nội dung bài học",
      contentBlocks: contentBlocks,
    });
  }

  return sections;
}

// Convert section data to philosophy format
export function convertToPhilosophySection(section: {
  id: string;
  title: string;
  summary: string;
  contentBlocks: {
    heading: string;
    body: string;
    keywords?: string[];
    uiHint: string;
  }[];
}): PhilosophySection {
  return {
    id: section.id,
    title: section.title,
    summary: section.summary,
    contentBlocks: section.contentBlocks.map(convertToPhilosophyContentBlock),
  };
}

// Convert content block data to philosophy format
export function convertToPhilosophyContentBlock(block: {
  heading: string;
  body: string;
  keywords?: string[];
  uiHint: string;
}): PhilosophyContentBlock {
  return {
    heading: block.heading,
    body: block.body,
    keywords: block.keywords,
    uiHint: block.uiHint as PhilosophyContentBlock["uiHint"],
  };
}

// Validate and process philosophy content
export function validatePhilosophyContent(
  lesson: PhilosophyLesson,
): PhilosophyLesson {
  // Validate lesson structure
  if (!lesson.id || !lesson.title || !lesson.sections) {
    throw new Error("Invalid lesson structure");
  }

  // Validate sections
  lesson.sections.forEach((section, index) => {
    if (
      !section.id ||
      !section.title ||
      !section.summary ||
      !section.contentBlocks
    ) {
      throw new Error(`Invalid section at index ${index}`);
    }

    // Validate content blocks
    section.contentBlocks.forEach((block, blockIndex) => {
      if (!block.heading || !block.body || !block.uiHint) {
        throw new Error(
          `Invalid content block at section ${index}, block ${blockIndex}`,
        );
      }
    });
  });

  return lesson;
}

// Parse markdown content with enhanced processing
export function parsePhilosophyMarkdown(
  content: string,
): PhilosophyContentBlock[] {
  const blocks: PhilosophyContentBlock[] = [];
  const lines = content.split("\n");
  let currentBlock: Partial<PhilosophyContentBlock> = {};
  let bodyLines: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check for heading (## format)
    if (trimmedLine.startsWith("## ")) {
      // Save previous block if exists
      if (currentBlock.heading && bodyLines.length > 0) {
        blocks.push({
          heading: currentBlock.heading,
          body: bodyLines.join("\n"),
          keywords: currentBlock.keywords,
          uiHint: currentBlock.uiHint || "tabs",
        });
      }

      // Start new block
      currentBlock = {
        heading: trimmedLine.replace("## ", ""),
        keywords: [],
        uiHint: "tabs",
      };
      bodyLines = [];
    }
    // Check for keywords marker
    else if (trimmedLine.startsWith("**Từ khóa:**")) {
      const keywordsText = trimmedLine.replace("**Từ khóa:**", "").trim();
      currentBlock.keywords = keywordsText.split(",").map((k) => k.trim());
    }
    // Check for UI hint marker
    else if (trimmedLine.startsWith("**Gợi ý UI:**")) {
      const uiHint = trimmedLine.replace("**Gợi ý UI:**", "").trim();
      currentBlock.uiHint = uiHint as PhilosophyContentBlock["uiHint"];
    }
    // Regular content line
    else if (trimmedLine) {
      bodyLines.push(line);
    }
  }

  // Save final block
  if (currentBlock.heading && bodyLines.length > 0) {
    blocks.push({
      heading: currentBlock.heading,
      body: bodyLines.join("\n"),
      keywords: currentBlock.keywords,
      uiHint: currentBlock.uiHint || "tabs",
    });
  }

  return blocks;
}

// Generate content statistics
export function getContentStatistics(lesson: PhilosophyLesson): {
  totalSections: number;
  totalBlocks: number;
  totalWords: number;
  averageBlockLength: number;
  keywordsCount: number;
} {
  const totalSections = lesson.sections.length;
  const totalBlocks = lesson.sections.reduce(
    (acc, section) => acc + section.contentBlocks.length,
    0,
  );
  const totalWords = lesson.sections.reduce((acc, section) => {
    return (
      acc +
      section.contentBlocks.reduce((blockAcc, block) => {
        return blockAcc + block.body.split(/\s+/).length;
      }, 0)
    );
  }, 0);

  const keywordsCount = lesson.sections.reduce((acc, section) => {
    return (
      acc +
      section.contentBlocks.reduce((blockAcc, block) => {
        return blockAcc + (block.keywords?.length || 0);
      }, 0)
    );
  }, 0);

  const averageBlockLength =
    totalBlocks > 0 ? Math.round(totalWords / totalBlocks) : 0;

  return {
    totalSections,
    totalBlocks,
    totalWords,
    averageBlockLength,
    keywordsCount,
  };
}

// Search content by keywords
export function searchContentByKeywords(
  lesson: PhilosophyLesson,
  keywords: string[],
): PhilosophyContentBlock[] {
  const results: PhilosophyContentBlock[] = [];

  lesson.sections.forEach((section) => {
    section.contentBlocks.forEach((block) => {
      const blockKeywords = block.keywords || [];
      const matches = keywords.filter((keyword) =>
        blockKeywords.some((blockKeyword) =>
          blockKeyword.toLowerCase().includes(keyword.toLowerCase()),
        ),
      );

      if (matches.length > 0) {
        results.push(block);
      }
    });
  });

  return results;
}

// Filter content by UI hint type
export function filterContentByUIHint(
  lesson: PhilosophyLesson,
  uiHint: PhilosophyContentBlock["uiHint"],
): PhilosophyContentBlock[] {
  const results: PhilosophyContentBlock[] = [];

  lesson.sections.forEach((section) => {
    section.contentBlocks.forEach((block) => {
      if (block.uiHint === uiHint) {
        results.push(block);
      }
    });
  });

  return results;
}

// Get content blocks with specific keywords
export function getContentWithKeywords(
  lesson: PhilosophyLesson,
  keyword: string,
): PhilosophyContentBlock[] {
  return searchContentByKeywords(lesson, [keyword]);
}

// Validate lesson data integrity
export function validateLessonIntegrity(lesson: PhilosophyLesson): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check basic structure
  if (!lesson.id) errors.push("Lesson ID is missing");
  if (!lesson.title) errors.push("Lesson title is missing");
  if (!lesson.sections || lesson.sections.length === 0)
    errors.push("No sections found");

  // Check sections
  lesson.sections.forEach((section, index) => {
    if (!section.id) errors.push(`Section ${index} ID is missing`);
    if (!section.title) errors.push(`Section ${index} title is missing`);
    if (!section.summary) errors.push(`Section ${index} summary is missing`);
    if (!section.contentBlocks || section.contentBlocks.length === 0) {
      errors.push(`Section ${index} has no content blocks`);
    }

    // Check content blocks
    section.contentBlocks.forEach((block, blockIndex) => {
      if (!block.heading)
        errors.push(`Section ${index}, block ${blockIndex} heading is missing`);
      if (!block.body)
        errors.push(`Section ${index}, block ${blockIndex} body is missing`);
      if (!block.uiHint)
        errors.push(`Section ${index}, block ${blockIndex} UI hint is missing`);
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Generate lesson summary
export function generateLessonSummary(lesson: PhilosophyLesson): {
  title: string;
  sectionsCount: number;
  totalWords: number;
  keywords: string[];
  uiHints: string[];
} {
  const stats = getContentStatistics(lesson);
  const keywords = new Set<string>();
  const uiHints = new Set<string>();

  lesson.sections.forEach((section) => {
    section.contentBlocks.forEach((block) => {
      if (block.keywords) {
        block.keywords.forEach((keyword) => keywords.add(keyword));
      }
      uiHints.add(block.uiHint);
    });
  });

  return {
    title: lesson.title,
    sectionsCount: stats.totalSections,
    totalWords: stats.totalWords,
    keywords: Array.from(keywords),
    uiHints: Array.from(uiHints),
  };
}

// Import Supabase services
import { supabaseServices } from "../supabase/services";
import { supabase } from "../supabase/client";

// Get all chapters from Supabase with their lessons
export async function getChapters() {
  return await supabaseServices.getChaptersWithLessons();
}

// Get lesson by ID from Supabase with sections
export async function getLessonById(id: string) {
  try {
    // Test Supabase connection first
    const { error: connectionError } = await supabase
      .from("lessons")
      .select("id")
      .limit(1);
    if (connectionError) {
      throw new Error(`Supabase connection failed: ${connectionError.message}`);
    }

    const lesson = await supabaseServices.getLessonById(id);

    if (!lesson) {
      throw new Error(`Lesson with ID ${id} not found in Supabase`);
    }

    // Fetch sections for this lesson
    const sections = await supabaseServices.getSectionsByLessonId(id);

    // Combine lesson data with sections
    const lessonWithSections = {
      ...lesson,
      sections: sections.map((section, index) => ({
        id: section.id,
        title: section.title,
        content: section.content,
        order: index + 1,
      })),
    };

    return lessonWithSections;
  } catch (error) {
    throw error;
  }
}

// Get all chapters from Supabase
export async function getChaptersFromSupabase() {
  return await supabaseServices.getChapters();
}

// Get lesson by ID from Supabase
export async function getLessonByIdFromSupabase(id: string) {
  const lesson = await supabaseServices.getLessonById(id);
  if (!lesson) {
    throw new Error(`Lesson with ID ${id} not found`);
  }
  return lesson;
}

// Get lessons by chapter ID from Supabase
export async function getLessonsByChapterIdFromSupabase(chapterId: string) {
  return await supabaseServices.getLessonsByChapterId(chapterId);
}

// Get sections by lesson ID from Supabase
export async function getSectionsByLessonIdFromSupabase(lessonId: string) {
  return await supabaseServices.getSectionsByLessonId(lessonId);
}

// Get flashcards by lesson ID from Supabase
export async function getFlashcardsByLessonIdFromSupabase(lessonId: string) {
  return await supabaseServices.getFlashcardsByLessonId(lessonId);
}

// Get test by lesson ID from Supabase
export async function getTestByLessonIdFromSupabase(lessonId: string) {
  return await supabaseServices.getTestByLessonId(lessonId);
}

// Get test questions by test ID from Supabase
export async function getTestQuestionsByTestIdFromSupabase(testId: string) {
  return await supabaseServices.getTestQuestionsByTestId(testId);
}

// Export utility functions
export const dataUtils = {
  convertToPhilosophyLesson,
  convertToPhilosophySection,
  convertToPhilosophyContentBlock,
  validatePhilosophyContent,
  parsePhilosophyMarkdown,
  getContentStatistics,
  searchContentByKeywords,
  filterContentByUIHint,
  getContentWithKeywords,
  validateLessonIntegrity,
  generateLessonSummary,
};
