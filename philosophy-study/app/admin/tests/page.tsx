"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/context/AuthContext";
import { supabaseServices } from "@/src/lib/supabase/services";
import { Test } from "@/src/lib/types/test";

export default function AdminTestsPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonTitles, setLessonTitles] = useState<Record<string, string[]>>(
    {},
  );
  const [chapterTitles, setChapterTitles] = useState<Record<string, string>>(
    {},
  );

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [sortBy, setSortBy] = useState<"created_at" | "updated_at">(
    "created_at",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and sort tests
  const filteredTests = tests
    .filter((test) => {
      // Filter by search term
      const matchesSearch =
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (test.description &&
          test.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filter by lesson
      const matchesLesson =
        !selectedLesson ||
        (lessonTitles[test.id] &&
          lessonTitles[test.id].includes(selectedLesson));

      return matchesSearch && matchesLesson;
    })
    .sort((a, b) => {
      const aValue = new Date(a[sortBy]).getTime();
      const bValue = new Date(b[sortBy]).getTime();
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

  // Load tests data
  useEffect(() => {
    const loadTests = async () => {
      try {
        const data = await supabaseServices.getAllTestsWithLessons();
        setTests(data);

        // Create lesson titles map from the related_lessons data
        const titlesMap: Record<string, string[]> = {};
        for (const test of data) {
          if (test.related_lessons && test.related_lessons.length > 0) {
            const titles = test.related_lessons.map(lesson => lesson.title);
            // Remove duplicates using Set
            const uniqueTitles = [...new Set(titles)];
            titlesMap[test.id] = uniqueTitles;
          }
        }
        setLessonTitles(titlesMap);
      } catch (error) {
        console.error("Error loading tests:", error);
        setError("Lỗi khi tải danh sách bài test");
      } finally {
        setIsLoading(false);
      }
    };
    loadTests();
  }, []);

  // Load chapters for filter dropdown
  useEffect(() => {
    const loadChapters = async () => {
      try {
        const chapters = await supabaseServices.getChapters();
        const chapterMap: Record<string, string> = {};
        chapters.forEach((chapter) => {
          chapterMap[chapter.id] = chapter.title;
        });
        setChapterTitles(chapterMap);
      } catch (error) {
        console.error("Error loading chapters:", error);
      }
    };
    loadChapters();
  }, []);

  // Function to get lesson titles from lesson IDs
  const getLessonTitles = async (lessonIds: string[]): Promise<string[]> => {
    if (lessonIds.length === 0) return [];

    try {
      const lessons = await Promise.all(
        lessonIds.map(async (lessonId) => {
          const lesson = await supabaseServices.getLessonById(lessonId);
          return lesson;
        }),
      );
      return lessons.filter(Boolean).map((lesson) => lesson!.title);
    } catch (error) {
      console.error("Error fetching lesson titles:", error);
      return [];
    }
  };

  // Redirect to login if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/login");
    }
  }, [isAdmin, isLoading, router]);

  const handleDeleteTest = async (testId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài test này không?")) {
      return;
    }

    try {
      await supabaseServices.deleteTest(testId);
      setTests(tests.filter((test) => test.id !== testId));
    } catch (error) {
      console.error("Error deleting test:", error);
      setError("Lỗi khi xóa bài test");
    }
  };

  const handleEditTest = (testId: string) => {
    router.push(`/admin/tests/${testId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý Bài Test
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý các bài kiểm tra đánh giá triết học
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
                onClick={() => router.push("/admin/tests/new")}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                + Tạo bài test mới
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Statistics Overview */}
        <div className="philosophy-card p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Tổng quan</h3>
              <p className="text-purple-100">
                {tests.length} bài test đang được quản lý
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{tests.length}</div>
              <div className="text-purple-100 text-sm">Bài test</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="philosophy-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search by name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm theo tên
              </label>
              <input
                type="text"
                placeholder="Nhập tên bài test..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
              />
            </div>

            {/* Filter by lesson */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo bài học
              </label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
              >
                <option value="">Tất cả các bài học</option>
                {Array.from(new Set(Object.values(lessonTitles).flat())).map(
                  (title, index) => (
                    <option key={index} value={title}>
                      {title}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Sort options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp theo
              </label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "created_at" | "updated_at")
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                >
                  <option value="created_at">Ngày tạo</option>
                  <option value="updated_at">Ngày cập nhật</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "asc" | "desc")
                  }
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                >
                  <option value="desc">Giảm dần</option>
                  <option value="asc">Tăng dần</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tests List */}
        <div className="philosophy-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Danh sách Bài Test
            </h3>
            <div className="text-sm text-gray-600">
              {filteredTests.length} bài test được tìm thấy
            </div>
          </div>

          {filteredTests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy bài test nào
              </h3>
              <p className="text-gray-600 mb-6">
                Hãy thử thay đổi các bộ lọc hoặc tạo bài test mới
              </p>
              <button
                onClick={() => router.push("/admin/tests/new")}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Tạo bài test mới
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="philosophy-card p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {test.title}
                      </h4>
                      <p className="text-gray-600 mb-2">{test.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          📚 {lessonTitles[test.id]?.length || 0} bài học
                        </span>
                        <span>⏱️ {test.duration} phút</span>
                        <span>❓ {test.total_questions} câu</span>
                        <span>🎯 {test.passing_score}% đạt</span>
                      </div>
                      {lessonTitles[test.id] &&
                        lessonTitles[test.id].length > 0 && (
                          <div className="mt-3">
                            <span className="text-xs text-gray-400 font-medium">
                              Các bài học liên quan:
                            </span>
                            <div className="mt-1 space-y-1">
                              {lessonTitles[test.id]?.map((title, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded"
                                >
                                  {index + 1}. {title}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEditTest(test.id)}
                        className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteTest(test.id)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* Test Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
                    <span>
                      Cập nhật:{" "}
                      {new Date(test.updated_at).toLocaleDateString("vi-VN")}
                    </span>
                    <span>
                      Tạo:{" "}
                      {new Date(test.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
