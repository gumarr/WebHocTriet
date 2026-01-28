import { supabase } from "./client";
import type {
  Flashcard,
  TestResult,
  UserProgress,
  Chapter,
  Lesson,
} from "../types";
import type { Test, TestQuestion, Section } from "../types/lesson";

// Export supabase for use in other modules
export { supabase };

// Export individual functions for direct import
export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data || [];
}

export async function updateUserProgress(
  userId: string,
  chapterId: string,
  lessonId: string,
  progress: number,
): Promise<void> {
  const { error } = await supabase.from("user_progress").upsert({
    user_id: userId,
    chapter_id: chapterId,
    lesson_id: lessonId,
    progress,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function getUserFlashcards(userId: string): Promise<Flashcard[]> {
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data || [];
}

export async function createFlashcard(
  userId: string,
  flashcard: Omit<Flashcard, "id" | "created_at" | "updated_at">,
): Promise<Flashcard> {
  const { data, error } = await supabase
    .from("flashcards")
    .insert([
      {
        ...flashcard,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .single();

  if (error) throw error;
  return data;
}

export async function updateFlashcard(
  id: string,
  updates: Partial<Flashcard>,
): Promise<Flashcard> {
  const { data, error } = await supabase
    .from("flashcards")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFlashcard(id: string): Promise<void> {
  const { error } = await supabase.from("flashcards").delete().eq("id", id);

  if (error) throw error;
}

export async function getUserTestResults(
  userId: string,
): Promise<TestResult[]> {
  const { data, error } = await supabase
    .from("test_results")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function saveTestResult(
  userId: string,
  testResult: Omit<TestResult, "id" | "created_at">,
): Promise<TestResult> {
  const { data, error } = await supabase
    .from("test_results")
    .insert([
      {
        ...testResult,
        user_id: userId,
        created_at: new Date().toISOString(),
      },
    ])
    .single();

  if (error) throw error;
  return data;
}

export async function getChapters(): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getChaptersWithLessons(): Promise<Chapter[]> {
  // First get all chapters
  const { data: chapters, error: chaptersError } = await supabase
    .from("chapters")
    .select("*")
    .order("display_order", { ascending: true });

  if (chaptersError) throw chaptersError;

  if (!chapters || chapters.length === 0) {
    return [];
  }

  // Then get all lessons and group them by chapter
  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("*")
    .order("display_order", { ascending: true });

  if (lessonsError) throw lessonsError;

  // Group lessons by chapter_id
  const lessonsByChapter = lessons
    ? lessons.reduce(
        (acc, lesson) => {
          if (!acc[lesson.chapter_id]) {
            acc[lesson.chapter_id] = [];
          }
          acc[lesson.chapter_id].push(lesson);
          return acc;
        },
        {} as Record<string, Lesson[]>,
      )
    : {};

  // For each lesson, fetch its flashcards
  const chaptersWithLessons = await Promise.all(
    chapters.map(async (chapter) => {
      const chapterLessons = lessonsByChapter[chapter.id] || [];

      // Fetch flashcards for each lesson in this chapter
      const lessonsWithFlashcards = await Promise.all(
        chapterLessons.map(async (lesson: { id: string }) => {
          const { data: flashcards, error: flashcardsError } = await supabase
            .from("flashcards")
            .select("*")
            .eq("lesson_id", lesson.id);

          if (flashcardsError) throw flashcardsError;

          return {
            ...lesson,
            flashcards: flashcards || [],
          };
        }),
      );

      return {
        ...chapter,
        lessons: lessonsWithFlashcards,
      };
    }),
  );

  return chaptersWithLessons;
}

export async function getChapterById(id: string): Promise<Chapter | null> {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
  return data || null;
}

export async function createChapter(chapterData: {
  title: string;
  description?: string;
  display_order: number;
  imageUrl?: string;
}): Promise<Chapter> {
  // Validate display_order constraint: must be >= 0
  if (chapterData.display_order < 1) {
    throw new Error("Display order must be greater than or equal to 1");
  }

  const { data, error } = await supabase
    .from("chapters")
    .insert([
      {
        title: chapterData.title,
        description: chapterData.description,
        display_order: chapterData.display_order,
        image_url: chapterData.imageUrl, // Map camelCase to snake_case
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select("*")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Failed to create chapter");
  return mapChapterFromSupabase(data);
}

export async function updateChapter(
  id: string,
  updates: Partial<Chapter>,
): Promise<Chapter> {
  const { error } = await supabase
    .from("chapters")
    .update({
      title: updates.title,
      description: updates.description,
      display_order: updates.display_order,
      image_url: updates.image_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;

  // Since Supabase update doesn't return data, fetch the updated record
  const { data: updatedData, error: fetchError } = await supabase
    .from("chapters")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;
  if (!updatedData) throw new Error("Failed to fetch updated chapter");

  return mapChapterFromSupabase(updatedData);
}

export async function deleteChapter(id: string): Promise<void> {
  const { error } = await supabase.from("chapters").delete().eq("id", id);
  if (error) throw error;
}

export async function getLessonsByChapterId(
  chapterId: string,
): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("chapter_id", chapterId)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("❌ Error fetching lessons by chapter ID:", error);
    throw error;
  }

  return data?.map(mapLessonFromSupabase) || [];
}

export async function createLesson(lessonData: {
  title: string;
  chapterId: string;
  display_order: number;
  content?: string;
  summary: string;
}): Promise<Lesson> {
  // Validate display_order constraint: must be >= 1
  if (lessonData.display_order < 1) {
    throw new Error("Display order must be greater than hoặc bằng 1");
  }

  const { error } = await supabase.from("lessons").insert([
    {
      title: lessonData.title,
      chapter_id: lessonData.chapterId, // Map camelCase to snake_case
      display_order: lessonData.display_order,
      content: lessonData.content,
      summary: lessonData.summary,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  if (error) throw error;

  // Since Supabase insert doesn't return data with .single() in some cases,
  // we need to fetch the created lesson to get its ID
  const { data: createdLesson, error: fetchError } = await supabase
    .from("lessons")
    .select("*")
    .eq("title", lessonData.title)
    .eq("chapter_id", lessonData.chapterId)
    .eq("display_order", lessonData.display_order)
    .eq("summary", lessonData.summary)
    .order("created_at", { ascending: false })
    .limit(1);

  if (fetchError) {
    // If there's an error fetching the lesson, but the insert was successful,
    // we'll try to get the latest lesson by created_at to work around the issue
    console.warn(
      "Error fetching created lesson, trying fallback method:",
      fetchError,
    );
    const { data: fallbackLesson, error: fallbackError } = await supabase
      .from("lessons")
      .select("*")
      .eq("title", lessonData.title)
      .eq("chapter_id", lessonData.chapterId)
      .eq("summary", lessonData.summary)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fallbackError) {
      console.error("Fallback method also failed:", fallbackError);
      throw new Error("Failed to fetch created lesson");
    }

    if (!fallbackLesson || fallbackLesson.length === 0) {
      throw new Error("Failed to fetch created lesson");
    }

    return mapLessonFromSupabase(fallbackLesson[0]);
  }

  if (!createdLesson || createdLesson.length === 0)
    throw new Error("Failed to fetch created lesson");

  return mapLessonFromSupabase(createdLesson[0]);
}

export async function updateLesson(
  id: string,
  updates: Partial<Lesson>,
): Promise<Lesson> {
  const { data, error } = await supabase
    .from("lessons")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .single();

  if (error) throw error;
  return mapLessonFromSupabase(data);
}

export async function deleteLesson(id: string): Promise<void> {
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) throw error;
}

// Sections
export async function getSectionsByLessonId(
  lessonId: string,
): Promise<Section[]> {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("❌ Error fetching sections:", error);
    throw error;
  }
  return data || [];
}

export async function createSection(sectionData: {
  title: string;
  content: string;
  lesson_id: string;
  display_order: number;
}): Promise<Section> {
  // Validate display_order constraint: must be >= 0
  if (sectionData.display_order < 0) {
    throw new Error("Display order must be greater than or equal to 0");
  }

  const { data, error } = await supabase
    .from("sections")
    .insert([
      {
        title: sectionData.title,
        content: sectionData.content,
        lesson_id: sectionData.lesson_id,
        display_order: sectionData.display_order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .single();

  if (error) throw error;
  return data;
}

export async function updateSection(
  id: string,
  updates: Partial<Section>,
): Promise<Section> {
  const { data, error } = await supabase
    .from("sections")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSection(id: string): Promise<void> {
  const { error } = await supabase.from("sections").delete().eq("id", id);
  if (error) throw error;
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
  return data ? mapLessonFromSupabase(data) : null;
}

// Helper function to map Supabase data to Chapter type
function mapChapterFromSupabase(data: {
  id: string;
  title: string;
  description?: string;
  display_order: number;
  image_url?: string;
}): Chapter {
  return {
    id: data.id,
    title: data.title,
    description: data.description || "",
    display_order: data.display_order,
    image_url: data.image_url || "",
    lessons: [], // Add empty lessons array for new chapters
  };
}

// Helper function to map Supabase data to Lesson type
function mapLessonFromSupabase(data: {
  id: string;
  title: string;
  chapter_id: string;
  display_order: number;
  content?: string;
  summary: string;
  flashcards?: Flashcard[];
  test?: Test;
}): Lesson {
  if (!data) {
    // Return a default lesson object when data is null
    // This allows the update to complete successfully even if Supabase doesn't return data
    return {
      id: "",
      title: "",
      chapter_id: "",
      display_order: 0,
      content: "",
      summary: "",
      flashcards: [],
      test: {
        id: "",
        lessonId: "",
        title: "Bài kiểm tra",
        description: "",
        duration: 0,
        totalQuestions: 0,
        passingScore: 0,
        questions: [],
      },
    };
  }
  
  return {
    id: data.id,
    title: data.title,
    chapter_id: data.chapter_id,
    display_order: data.display_order,
    content: data.content,
    summary: data.summary,
    flashcards: data.flashcards || [],
    test: data.test || {
      id: "",
      lessonId: data.id,
      title: "Bài kiểm tra",
      description: "",
      duration: 0,
      totalQuestions: 0,
      passingScore: 0,
      questions: [],
    },
  };
}

// Keep the services object for backward compatibility
export const supabaseServices = {
  getUserProgress,
  updateUserProgress,
  getUserFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getUserTestResults,
  saveTestResult,
  getChapters,
  getChaptersWithLessons,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
  getLessonsByChapterId,
  createLesson,
  updateLesson,
  deleteLesson,

  // Lessons
  async getLessons(): Promise<Lesson[]> {
    console.log("🔍 Fetching all lessons from Supabase...");
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("❌ Error fetching lessons:", error);
      throw error;
    }
    console.log(`✅ Found ${data?.length || 0} lessons`);
    return data?.map(mapLessonFromSupabase) || [];
  },

  async getLessonById(id: string): Promise<Lesson | null> {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.log(`⚠️  Lesson with ID ${id} not found in Supabase`);
        return null;
      }
      console.error("❌ Error fetching lesson by ID:", error);
      throw error;
    }
    return data ? mapLessonFromSupabase(data) : null;
  },

  // Helper function to map Supabase data to Lesson type
  mapLessonFromSupabase(data: {
    id: string;
    title: string;
    chapter_id: string;
    display_order: number;
    content?: string;
    summary: string;
    flashcards?: Flashcard[];
    test?: Test;
  }): Lesson {
    return {
      id: data.id,
      title: data.title,
      chapter_id: data.chapter_id, // Map snake_case to camelCase
      display_order: data.display_order,
      content: data.content,
      summary: data.summary,
      flashcards: data.flashcards || [],
      test: data.test || {
        id: "",
        lessonId: data.id,
        title: "Bài kiểm tra",
        description: "",
        duration: 0,
        totalQuestions: 0,
        passingScore: 0,
        questions: [],
      },
    };
  },

  // Sections
  async getSectionsByLessonId(lessonId: string): Promise<Section[]> {
    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("display_order", { ascending: true });

    if (error) {
      // Hiển thị chi tiết lỗi thay vì dấu {}
      console.error("❌ Chi tiết lỗi Supabase:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }

    return data || [];
  },

  // Flashcards
  async getFlashcardsByLessonId(lessonId: string): Promise<Flashcard[]> {
    const { data, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("lesson_id", lessonId);

    if (error) throw error;
    return data || [];
  },

  // Tests
  async getTestByLessonId(lessonId: string): Promise<Test | null> {
    const { data, error } = await supabase
      .from("tests")
      .select("*")
      .eq("lesson_id", lessonId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
    return data || null;
  },

  async getTestQuestionsByTestId(testId: string): Promise<TestQuestion[]> {
    const { data, error } = await supabase
      .from("test_questions")
      .select("*")
      .eq("test_id", testId);

    if (error) throw error;
    return data || [];
  },

  // Lesson Completion
  async markLessonCompleted(
    userId: string,
    chapterId: string,
    lessonId: string,
  ): Promise<void> {
    const { error } = await supabase.from("user_progress").upsert({
      user_id: userId,
      chapter_id: chapterId,
      lesson_id: lessonId,
      progress: 100,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
  },

  async markLessonIncomplete(
    userId: string,
    chapterId: string,
    lessonId: string,
  ): Promise<void> {
    const { error } = await supabase.from("user_progress").upsert({
      user_id: userId,
      chapter_id: chapterId,
      lesson_id: lessonId,
      progress: 0,
      completed_at: null,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
  },

  async toggleLessonCompletion(
    userId: string,
    chapterId: string,
    lessonId: string,
  ): Promise<boolean> {
    // First check current status
    const { data: progressData, error: checkError } = await supabase
      .from("user_progress")
      .select("progress, completed_at")
      .eq("user_id", userId)
      .eq("chapter_id", chapterId)
      .eq("lesson_id", lessonId)
      .single();

    if (checkError && checkError.code !== "PGRST116") throw checkError;

    const isCurrentlyCompleted =
      progressData?.progress === 100 && progressData?.completed_at;

    if (isCurrentlyCompleted) {
      // Mark as incomplete
      await this.markLessonIncomplete(userId, chapterId, lessonId);
      return false;
    } else {
      // Mark as completed
      await this.markLessonCompleted(userId, chapterId, lessonId);
      return true;
    }
  },
};
