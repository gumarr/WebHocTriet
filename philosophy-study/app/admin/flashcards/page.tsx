"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/context/AuthContext";
import {
  getChaptersWithLessons,
  deleteFlashcard,
} from "@/src/lib/supabase/services";
import { supabase } from "@/src/lib/supabase/client";
import { Flashcard, Chapter } from "@/src/lib/types";

export default function AdminFlashcardsPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "created_at" | "difficulty" | "question"
  >("created_at");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
        const chaptersData = await getChaptersWithLessons();
        const { data: flashcardsData } = await supabase
          .from("flashcards")
          .select("*")
          .order("created_at", { ascending: false });

        setChapters(chaptersData);
        setFlashcards(flashcardsData || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const filteredFlashcards = flashcards
    .filter((card: Flashcard) => {
      // Check if flashcard belongs to selected chapter
      // Logic: If no chapter selected, show all. If chapter selected, show flashcards where lessonId is in the lessons of that chapter
      // Equivalent to: SELECT * FROM flashcards WHERE lesson_id IN (SELECT lesson_id FROM lessons WHERE chapter_id = {selectedChapter})

      const matchesChapter =
        !selectedChapter ||
        (card.lesson_id &&
          chapters
            .find((c) => c.id === selectedChapter)
            ?.lessons?.some((l) => l.id === card.lesson_id));

      // Check if flashcard belongs to selected lesson
      const matchesLesson =
        !selectedLesson || card.lesson_id === selectedLesson;

      // Check search term
      const matchesSearch =
        !searchTerm ||
        card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.answer.toLowerCase().includes(searchTerm.toLowerCase());

      const result = matchesChapter && matchesLesson && matchesSearch;

      return result;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "question":
          return a.question.localeCompare(b.question);
        case "difficulty":
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "created_at":
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredFlashcards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFlashcards = filteredFlashcards.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedChapter, selectedLesson, searchTerm, sortBy]);

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa flashcard này?")) {
      try {
        await deleteFlashcard(id);
        setFlashcards((prev) => prev.filter((card) => card.id !== id));
      } catch (error) {
        console.error("Error deleting flashcard:", error);
      }
    }
  };

  const getLessonTitle = (lessonId: string) => {
    for (const chapter of chapters) {
      const lesson = chapter.lessons?.find((l) => l.id === lessonId);
      if (lesson) return lesson.title;
    }
    return "Unknown";
  };

  const getChapterTitle = (lessonId: string) => {
    for (const chapter of chapters) {
      const lesson = chapter.lessons?.find((l) => l.id === lessonId);
      if (lesson) return chapter.title;
    }
    return "Unknown";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý Flashcards
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý các thẻ học cho các bài học
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/admin")}
                className="px-4 py-2 text-sm text-gray-700 hover:text-emerald-600 transition-colors border border-gray-300 rounded-lg"
              >
                Quay về Admin
              </button>
              <button
                onClick={() => router.push("/admin/flashcards/new")}
                className="philosophy-button bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Thêm Flashcard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="philosophy-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chương học
              </label>
              <select
                value={selectedChapter}
                onChange={(e) => {
                  setSelectedChapter(e.target.value);
                  setSelectedLesson("");
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
              >
                <option value="">Tất cả chương</option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bài học
              </label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
                disabled={!selectedChapter}
              >
                <option value="">Tất cả bài học</option>
                {chapters
                  .find((c) => c.id === selectedChapter)
                  ?.lessons?.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo câu hỏi hoặc câu trả lời..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "created_at" | "difficulty" | "question",
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
              >
                <option value="created_at">Mới nhất</option>
                <option value="question">Theo câu hỏi</option>
                <option value="difficulty">Theo độ khó</option>
              </select>
            </div>
          </div>
        </div>

        {/* Flashcards List */}
        <div className="philosophy-card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Danh sách Flashcards ({filteredFlashcards.length})
              </h2>
              <div className="text-sm text-gray-600">
                Trang {currentPage} / {totalPages}
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredFlashcards.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Không có flashcard nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              currentFlashcards.map((card) => (
                <div
                  key={card.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {getChapterTitle(card.lesson_id || "")}
                        </span>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                          {getLessonTitle(card.lesson_id || "")}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            card.difficulty === "easy"
                              ? "bg-green-100 text-green-800"
                              : card.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {card.difficulty === "easy"
                            ? "Dễ"
                            : card.difficulty === "medium"
                              ? "Trung bình"
                              : "Khó"}
                        </span>
                      </div>

                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Câu hỏi:
                        </h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                          {card.question}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Câu trả lời:
                        </h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                          {card.answer}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() =>
                          router.push(`/admin/flashcards/${card.id}/edit`)
                        }
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Ngày tạo:{" "}
                      {new Date(card.created_at).toLocaleDateString("vi-VN")}
                    </span>
                    <div className="flex gap-4">
                      <span>Đã xem: {card.review_count}</span>
                      <span>Đúng: {card.correct_count}</span>
                      <span>
                        Đã đánh dấu: {card.is_marked ? "Có" : "Không"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Hiển thị {startIndex + 1} -{" "}
                  {Math.min(endIndex, filteredFlashcards.length)} trên{" "}
                  {filteredFlashcards.length} flashcards
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Đầu
                  </button>

                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 ${
                        currentPage === page
                          ? "bg-emerald-100 border-emerald-300 text-emerald-700 font-medium"
                          : ""
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>

                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cuối
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
