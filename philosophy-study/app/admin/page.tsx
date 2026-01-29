"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/context/AuthContext";
import { getChapters } from "@/src/lib/utils/data";
import { Chapter, ChapterLesson } from "@/src/lib/types/chapter";
import { supabaseServices } from "@/src/lib/supabase/services";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChapters: 0,
    totalLessons: 0,
    totalFlashcards: 0,
    totalTests: 0,
  });

  // Load chapters data
  useEffect(() => {
    const loadChapters = async () => {
      try {
        const data = await getChapters();
        setChapters(data);
      } catch (error) {
        console.error("Error loading chapters:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadChapters();
  }, []);

  // Redirect to login if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/login");
    }
  }, [isAdmin, isLoading, router]);

  const getStats = async () => {
    // Tính tổng số bài học
    const totalLessons = chapters.reduce(
      (acc, chapter) => acc + (chapter.lessons?.length || 0),
      0,
    );

    // Tính tổng số flashcards
    const totalFlashcards = chapters.reduce(
      (acc, chapter) =>
        acc +
        (chapter.lessons?.reduce(
          (lessonAcc: number, lesson: ChapterLesson) =>
            lessonAcc + (lesson.flashcards?.length || 0),
          0,
        ) || 0),
      0,
    );

    // Lấy tổng số bài test từ Supabase
    let totalTests = 0;
    try {
      const tests = await supabaseServices.getAllTests();
      totalTests = tests.length;
    } catch (error) {
      console.error("Error fetching tests count:", error);
      totalTests = 0;
    }

    return {
      totalChapters: chapters.length,
      totalLessons,
      totalFlashcards,
      totalTests,
    };
  };

  // Cập nhật stats khi chapters thay đổi
  useEffect(() => {
    if (chapters.length > 0) {
      getStats().then(setStats);
    }
  }, [chapters]);

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
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bảng Điều Khiển Quản Trị
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý nội dung triết học Mác - Lênin
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Xin chào,
                  <span className="font-semibold text-gray-900">
                    {" " + user?.email.split("@")[0]}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="philosophy-card p-6 bg-linear-to-r from-emerald-500 to-emerald-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Chương học</h3>
                <p className="text-emerald-100">Tổng số chương hiện có</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{stats.totalChapters}</div>
              </div>
            </div>
          </div>

          <div className="philosophy-card p-6 bg-linear-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Thẻ ghi nhớ</h3>
                <p className="text-blue-100">Tổng số thẻ</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">
                  {stats.totalFlashcards}
                </div>
              </div>
            </div>
          </div>

          <div className="philosophy-card p-6 bg-linear-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Bài kiểm tra</h3>
                <p className="text-purple-100">Tổng số bài kiểm tra</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{stats.totalTests}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Manage Lessons */}
          <div
            className="philosophy-card p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => router.push("/admin/lessons")}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">
                  {stats.totalLessons}
                </div>
                <div className="text-sm text-gray-600">Bài học</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
              Quản lý Bài học
            </h3>
            <p className="text-gray-600 mb-4">
              Thêm, sửa, xóa các bài học và nội dung chi tiết
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-emerald-600 font-medium">
                Quản lý ngay
              </span>
              <span className="text-2xl text-emerald-600">→</span>
            </div>
          </div>

          {/* Manage Flashcards */}
          <div
            className="philosophy-card p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => router.push("/admin/flashcards")}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {/* The "Back" Card */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2"
                  />
                  {/* The "Front" Card */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2z"
                  />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalFlashcards}
                </div>
                <div className="text-sm text-gray-600">Flashcards</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              Quản lý Flashcards
            </h3>
            <p className="text-gray-600 mb-4">
              Quản lý các thẻ học và câu hỏi ôn tập
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600 font-medium">
                Quản lý ngay
              </span>
              <span className="text-2xl text-blue-600">→</span>
            </div>
          </div>

          {/* Manage Tests */}
          <div
            className="philosophy-card p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => router.push("/admin/tests")}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalTests}
                </div>
                <div className="text-sm text-gray-600">Bài test</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              Quản lý Bài Test
            </h3>
            <p className="text-gray-600 mb-4">
              Tạo và quản lý các bài kiểm tra đánh giá
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-600 font-medium">
                Quản lý ngay
              </span>
              <span className="text-2xl text-purple-600">→</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="philosophy-card p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Hành động nhanh
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push("/admin/flashcards/new")}
              className="philosophy-card p-4 text-center hover:bg-blue-50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">
                Thêm flashcard mới
              </span>
            </button>

            <button
              onClick={() => router.push("/admin/tests/new")}
              className="philosophy-card p-4 text-center hover:bg-purple-50 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6l4 2"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">
                Tạo bài test mới
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
