"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppContext } from "@/src/lib/context/AppContext";
import { getLessonById } from "@/src/lib/utils/data";
import { Lesson } from "@/src/lib/types/lesson";
import { LessonContent } from "@/src/components/Lesson/LessonContent";

export default function LessonDetail() {
  const router = useRouter();
  const params = useParams();
  const { userProgress, updateUserProgress } = useAppContext();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load lesson data
  useEffect(() => {
    const loadLesson = async () => {
      try {
        const data = await getLessonById(params.lessonId as string);
        setLesson(data);
      } catch (error) {
        console.error("Error loading lesson:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLesson();
  }, [params.lessonId]);

  const handleMarkCompleted = () => {
    if (lesson && !userProgress.completedLessons.includes(lesson.id)) {
      updateUserProgress({
        completedLessons: [...userProgress.completedLessons, lesson.id],
      });
    }
  };

  const handleBackToKnowledgeMap = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bài học không tồn tại
          </h2>
          <p className="text-gray-600">
            Vui lòng quay lại trang chủ và chọn bài học khác.
          </p>
          <button
            onClick={handleBackToKnowledgeMap}
            className="mt-4 btn-primary px-6 py-2"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="philosophy-card p-6 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToKnowledgeMap}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                ← Quay về trang chính
              </button>
              <button
                onClick={handleMarkCompleted}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  userProgress.completedLessons.includes(lesson.id)
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors`}
              >
                {userProgress.completedLessons.includes(lesson.id)
                  ? "Đã hoàn thành"
                  : "Đánh dấu hoàn thành"}
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="philosophy-card p-8">
          <LessonContent lesson={lesson} />
        </div>
      </div>
    </div>
  );
}
