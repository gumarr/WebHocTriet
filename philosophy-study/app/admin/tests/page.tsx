"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/context/AuthContext";
import { supabaseServices } from "@/src/lib/supabase/services";
import { Test, TestQuestion } from "@/src/lib/types/test";
import { Lesson } from "@/src/lib/types/lesson";

export default function AdminTestsPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonTitles, setLessonTitles] = useState<Record<string, string[]>>(
    {},
  );

  // Load tests data
  useEffect(() => {
    const loadTests = async () => {
      try {
        const data = await supabaseServices.getAllTests();
        setTests(data);

        // Load lesson titles for all tests
        const titlesMap: Record<string, string[]> = {};
        for (const test of data) {
          // Fetch lesson IDs for this test using the service function
          const lessonIds = await supabaseServices.getTestLessons(test.id);
          if (lessonIds && lessonIds.length > 0) {
            const titles = await getLessonTitles(lessonIds);
            titlesMap[test.id] = titles;
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
      console.log("Redirecting to login - not admin");
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

  const handleViewQuestions = (testId: string) => {
    router.push(`/admin/tests/${testId}/questions`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
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

        {/* Tests List */}
        <div className="philosophy-card p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Danh sách Bài Test
          </h3>

          {tests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có bài test nào
              </h3>
              <p className="text-gray-600 mb-6">
                Hãy tạo bài test đầu tiên để bắt đầu quản lý nội dung đánh giá
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
              {tests.map((test) => (
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
                        <span>❓ {test.totalQuestions} câu</span>
                        <span>🎯 {test.passingScore}% đạt</span>
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
                        onClick={() => handleViewQuestions(test.id)}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                      >
                        Xem câu hỏi
                      </button>
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
