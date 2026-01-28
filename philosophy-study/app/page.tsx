"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/src/lib/context/AppContext";
import { useAuth } from "@/src/lib/context/AuthContext";
import { getChapters } from "@/src/lib/utils/data";
import { Chapter, Lesson } from "@/src/lib/types/chapter";

export default function Home() {
  const router = useRouter();
  const { userProgress } = useAppContext();
  const { isAdmin } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleStartLearning = () => {
    router.push("/knowledge-map");
  };

  const handleContinueLearning = () => {
    // Find the first incomplete chapter
    const incompleteChapter = chapters.find(
      (chapter) =>
        !chapter.lessons.every((lesson: Lesson) =>
          userProgress.completedLessons.includes(lesson.id),
        ),
    );

    if (incompleteChapter) {
      router.push(`/lessons/${incompleteChapter.id}`);
    } else {
      router.push("/lessons/chapter-1");
    }
  };

  const getProgressPercentage = () => {
    const totalLessons = chapters.reduce(
      (acc, chapter) => acc + (chapter.lessons?.length || 0),
      0,
    );
    const completed = userProgress.completedLessons.length;
    return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">TL</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Triết Học Mác - Lênin
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hệ thống ôn tập triết học Mác - Lênin hiện đại, giúp bạn hiểu sâu
            sắc các khái niệm triết học thông qua sơ đồ tư duy, flashcards và
            bài test được thiết kế theo lý thuyết học tập hiện đại.
          </p>
        </div>

        {/* Admin Management Section */}
        {isAdmin && (
          <div className="philosophy-card p-8 mb-12 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Quản trị viên
              </h2>
              <p className="text-gray-600">Quản lý nội dung và bài học</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => router.push("/admin/lessons")}
                className="philosophy-card p-6 hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 bg-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Quản lý Bài học
                </h3>
                <p className="text-gray-600">
                  Thêm, sửa, xóa các bài học và nội dung
                </p>
              </button>

              <button
                onClick={() => router.push("/admin/flashcards")}
                className="philosophy-card p-6 hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 bg-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11v4a2 2 0 002 2m0 0v-4m0 4h4m-4-4H9"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Quản lý Flashcards
                </h3>
                <p className="text-gray-600">Quản lý các thẻ học và câu hỏi</p>
              </button>

              <button
                onClick={() => router.push("/admin/tests")}
                className="philosophy-card p-6 hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 bg-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Quản lý Bài Test
                </h3>
                <p className="text-gray-600">Tạo và quản lý các bài kiểm tra</p>
              </button>
            </div>
          </div>
        )}

        {/* Progress Overview */}
        <div className="philosophy-card p-8 mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Tiến độ học tập của bạn
              </h3>
              <p className="text-gray-600">
                {userProgress.completedLessons.length} bài học đã hoàn thành
              </p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  {getProgressPercentage()}%
                </div>
                <div className="text-sm text-gray-600">Hoàn thành</div>
              </div>
              <div className="w-64 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-emerald-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Map Section */}
        <div className="philosophy-card p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bản Đồ Kiến Thức
            </h2>
            <p className="text-gray-600">
              Khám phá toàn bộ chương trình triết học Mác - Lênin thông qua sơ
              đồ tư duy trực quan
            </p>
          </div>

          {/* Progress Overview */}
          <div className="philosophy-card p-6 mb-8 bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Tiến độ tổng thể
                </h3>
                <p className="text-sm text-gray-600">
                  Tổng số chương: {chapters.length}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">
                  {userProgress.completedLessons.length} bài học hoàn thành
                </div>
              </div>
            </div>
          </div>

          {/* Knowledge Map Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chapters.map((chapter) => {
              const completedLessons =
                chapter.lessons?.filter((lesson: Lesson) =>
                  userProgress.completedLessons.includes(lesson.id),
                ).length || 0;
              const totalLessons = chapter.lessons?.length || 0;
              const progress =
                totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

              return (
                <div
                  key={chapter.id}
                  className="philosophy-card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() =>
                    router.push(`/lesson/${chapter.lessons?.[0]?.id || ""}`)
                  }
                >
                  {/* Chapter Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {chapter.description}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
                      {chapter.display_order}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Hoàn thành</span>
                      <span>
                        {completedLessons}/{totalLessons} bài
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-emerald-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Lessons List */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Các bài học:
                    </h4>
                    {chapter.lessons?.map((lesson: Lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors group"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent event bubbling to parent
                          router.push(`/lesson/${lesson.id}`);
                        }}
                      >
                        <span className="group-hover:text-emerald-600 transition-colors">
                          {lesson.title}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              userProgress.completedLessons.includes(lesson.id)
                                ? "bg-emerald-500"
                                : "bg-gray-300"
                            }`}
                          ></span>
                          <span className="text-xs text-gray-400 group-hover:text-emerald-600 transition-colors">
                            →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="w-full philosophy-button py-2 text-center text-sm font-medium group-hover:bg-emerald-600 transition-colors">
                      Khám phá chương
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="philosophy-card p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sơ đồ tư duy
            </h3>
            <p className="text-gray-600">
              Khám phá kiến thức triết học thông qua sơ đồ tư duy trực quan,
              giúp hiểu được mối liên hệ biện chứng giữa các khái niệm.
            </p>
          </div>

          <div className="philosophy-card p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Flashcards
            </h3>
            <p className="text-gray-600">
              Học thuộc các khái niệm triết học thông qua flashcards được thiết
              kế theo lý thuyết học tập ngắt quãng (spaced repetition).
            </p>
          </div>

          <div className="philosophy-card p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Bài test
            </h3>
            <p className="text-gray-600">
              Kiểm tra kiến thức thông qua các bài test được thiết kế theo chuẩn
              đánh giá, giúp củng cố và ghi nhớ kiến thức lâu dài.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="philosophy-card p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600">
                {chapters.length}
              </div>
              <div className="text-gray-600 mt-2">Chương học</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600">
                {chapters.reduce(
                  (acc, chapter) => acc + (chapter.lessons?.length || 0),
                  0,
                )}
              </div>
              <div className="text-gray-600 mt-2">Bài học</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600">
                {chapters.reduce(
                  (acc, chapter) =>
                    acc +
                    (chapter.lessons?.reduce(
                      (lessonAcc: number, lesson: Lesson) =>
                        lessonAcc + (lesson.flashcards?.length || 0),
                      0,
                    ) || 0),
                  0,
                )}
              </div>
              <div className="text-gray-600 mt-2">Flashcards</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
