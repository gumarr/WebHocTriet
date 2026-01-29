"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/src/lib/context/AuthContext";
import {
  getChaptersWithLessons,
  getUserFlashcards,
  updateFlashcard,
} from "@/src/lib/supabase/services";
import { FlashcardDifficulty, Flashcard } from "@/src/lib/types/flashcard";
import { Chapter, Lesson } from "@/src/lib/types";

export default function EditFlashcardPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAdmin } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [flashcard, setFlashcard] = useState<Flashcard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    difficulty: "medium" as FlashcardDifficulty,
    chapterId: "",
    lessonId: "",
  });

  const [errors, setErrors] = useState({
    question: "",
    answer: "",
    category: "",
    chapterId: "",
    lessonId: "",
  });

  // Redirect to login if not admin
  useEffect(() => {
    if (!isAdmin) {
      router.push("/login");
    }
  }, [isAdmin, router]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [chaptersData, flashcardsData] = await Promise.all([
          getChaptersWithLessons(),
          getUserFlashcards(),
        ]);

        setChapters(chaptersData);

        const currentFlashcard = flashcardsData.find((f) => f.id === params.id);
        if (currentFlashcard) {
          setFlashcard(currentFlashcard);

          // Find chapter and lesson for the flashcard
          let foundChapterId = "";
          let foundLessonId = "";

          for (const chapter of chaptersData) {
            const lesson = chapter.lessons?.find(
              (l) => l.id === currentFlashcard.lesson_id,
            );
            if (lesson) {
              foundChapterId = chapter.id;
              foundLessonId = lesson.id;
              break;
            }
          }

          setFormData({
            question: currentFlashcard.question,
            answer: currentFlashcard.answer,
            category: currentFlashcard.category,
            difficulty: currentFlashcard.difficulty,
            chapterId: foundChapterId,
            lessonId: foundLessonId,
          });
        } else {
          router.push("/admin/flashcards");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        router.push("/admin/flashcards");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadData();
    }
  }, [params.id, router]);

  const validateForm = () => {
    const newErrors = {
      question: "",
      answer: "",
      category: "",
      chapterId: "",
      lessonId: "",
    };
    let isValid = true;

    if (!formData.question.trim()) {
      newErrors.question = "Câu hỏi không được để trống";
      isValid = false;
    }

    if (!formData.answer.trim()) {
      newErrors.answer = "Câu trả lời không được để trống";
      isValid = false;
    }

    if (!formData.category.trim()) {
      newErrors.category = "Danh mục không được để trống";
      isValid = false;
    }

    if (!formData.chapterId) {
      newErrors.chapterId = "Vui lòng chọn chương học";
      isValid = false;
    }

    if (!formData.lessonId) {
      newErrors.lessonId = "Vui lòng chọn bài học";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateFlashcard(params.id as string, {
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        difficulty: formData.difficulty,
        lesson_id: formData.lessonId,
      });

      router.push("/admin/flashcards");
    } catch (error) {
      console.error("Error updating flashcard:", error);
      alert("Có lỗi xảy ra khi cập nhật flashcard. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const selectedChapter = chapters.find((c) => c.id === formData.chapterId);
  const selectedLesson = selectedChapter?.lessons?.find(
    (l) => l.id === formData.lessonId,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!flashcard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Flashcard không tồn tại
          </h2>
          <button
            onClick={() => router.push("/admin/flashcards")}
            className="philosophy-button bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sửa Flashcard
              </h1>
              <p className="text-gray-600 mt-1">Cập nhật thông tin flashcard</p>
            </div>
            <button
              onClick={() => router.push("/admin/flashcards")}
              className="philosophy-button bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="philosophy-card max-w-2xl mx-auto">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Câu hỏi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) =>
                    handleInputChange("question", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                  placeholder="Nhập câu hỏi cho flashcard..."
                />
                {errors.question && (
                  <p className="mt-1 text-red-600 text-sm">{errors.question}</p>
                )}
              </div>

              {/* Answer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Câu trả lời <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => handleInputChange("answer", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                  placeholder="Nhập câu trả lời cho flashcard..."
                />
                {errors.answer && (
                  <p className="mt-1 text-red-600 text-sm">{errors.answer}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                  placeholder="Nhập danh mục (ví dụ: Triết học, Duy vật, v.v.)"
                />
                {errors.category && (
                  <p className="mt-1 text-red-600 text-sm">{errors.category}</p>
                )}
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ khó
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    handleInputChange(
                      "difficulty",
                      e.target.value as FlashcardDifficulty,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                >
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Khó</option>
                </select>
              </div>

              {/* Chapter Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chương học <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.chapterId}
                  onChange={(e) => {
                    handleInputChange("chapterId", e.target.value);
                    handleInputChange("lessonId", "");
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                >
                  <option value="">Chọn chương học</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
                {errors.chapterId && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.chapterId}
                  </p>
                )}
              </div>

              {/* Lesson Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bài học <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.lessonId}
                  onChange={(e) =>
                    handleInputChange("lessonId", e.target.value)
                  }
                  disabled={!formData.chapterId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800"
                >
                  <option value="">Chọn bài học</option>
                  {selectedChapter?.lessons?.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
                {errors.lessonId && (
                  <p className="mt-1 text-red-600 text-sm">{errors.lessonId}</p>
                )}
              </div>

              {/* Preview */}
              {formData.question && formData.answer && (
                <div className="philosophy-card p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Xem trước Flashcard:
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Câu hỏi:</span>
                      <p className="mt-1 p-2 bg-white rounded-md text-gray-800">
                        {formData.question}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        Câu trả lời:
                      </span>
                      <p className="mt-1 p-2 bg-white rounded-md text-gray-800">
                        {formData.answer}
                      </p>
                    </div>
                    {selectedChapter && selectedLesson && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Chương:</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {selectedChapter.title}
                        </span>
                        <span>Bài:</span>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                          {selectedLesson.title}
                        </span>
                        <span>Độ khó:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            formData.difficulty === "easy"
                              ? "bg-green-100 text-green-800"
                              : formData.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {formData.difficulty === "easy"
                            ? "Dễ"
                            : formData.difficulty === "medium"
                              ? "Trung bình"
                              : "Khó"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push("/admin/flashcards")}
                  className="philosophy-button bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="philosophy-button bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-md flex items-center"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang cập nhật...
                    </div>
                  ) : (
                    "Cập nhật Flashcard"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
