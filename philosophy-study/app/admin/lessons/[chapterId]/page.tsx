"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/src/lib/context/AuthContext";
import {
  getLessonsByChapterId,
  createLesson,
  updateLesson,
  deleteLesson,
} from "@/src/lib/supabase/services";
import { Lesson, Section } from "@/src/lib/types/lesson";
import { motion } from "framer-motion";
import { ChapterImageUpload } from "@/src/components/Chapter/ChapterImageUpload";

export default function AdminChapterLessonsPage() {
  const router = useRouter();
  const params = useParams();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [chapterId] = useState(params.chapterId as string);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    order: 0,
    content: "",
    summary: "",
    sections: [] as Section[],
  });

  // Load lessons data
  useEffect(() => {
    if (!authLoading) {
      loadLessons();
    }
  }, [authLoading]);

  const loadLessons = async () => {
    try {
      const data = await getLessonsByChapterId(chapterId);
      setLessons(
        data.map((lesson) => ({
          ...lesson,
          chapterId: lesson.chapter_id, // Map snake_case to camelCase
        })),
      );
    } catch (error) {
      console.error("Error loading lessons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to login if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/login");
    }
  }, [isAdmin, authLoading, router]);

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      order: lesson.display_order || 1,
      content: lesson.content || "",
      summary: lesson.summary || "",
      sections: lesson.sections || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (lessonId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài học này không?")) {
      try {
        await deleteLesson(lessonId);
        setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
      } catch (error) {
        console.error("Error deleting lesson:", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingLesson) {
        // Update existing lesson
        const updatedLesson = await updateLesson(editingLesson.id, {
          title: formData.title,
          chapter_id: chapterId,
          display_order: formData.order,
          content: formData.content,
          summary: formData.summary,
        });
        setLessons(
          lessons.map((lesson) =>
            lesson.id === editingLesson.id
              ? { ...updatedLesson, chapterId: updatedLesson.chapter_id } // Map snake_case to camelCase
              : lesson,
          ),
        );
      } else {
        // Create new lesson
        const newLesson = await createLesson({
          title: formData.title,
          chapterId: chapterId,
          display_order: formData.order,
          content: formData.content,
          summary: formData.summary,
        });
        setLessons([
          ...lessons,
          { ...newLesson, chapterId: newLesson.chapter_id },
        ]); // Map snake_case to camelCase
      }
      // ✅ Close modal after successful save
      setIsModalOpen(false);
      setEditingLesson(null);
      setFormData({
        title: "",
        order: 1,
        content: "",
        summary: "",
        sections: [],
      });
      // ✅ Reload lessons to ensure data is up-to-date
      await loadLessons();
    } catch (error) {
      console.error("Error saving lesson:", error);
    }
  };

  const handleNewLesson = () => {
    setEditingLesson(null);
    setFormData({
      title: "",
      order: 1,
      content: "",
      summary: "",
      sections: [],
    });
    setIsModalOpen(true);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Truy cập bị từ chối
          </h1>
          <p className="text-gray-600 mb-8">
            Bạn cần quyền admin để truy cập trang này
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Quay về trang đăng nhập
          </button>
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
                Quản lý Bài học
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý các bài học trong chương
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/admin/lessons")}
                className="px-4 py-2 text-sm text-gray-700 hover:text-emerald-600 transition-colors border border-gray-300 rounded-lg"
              >
                Quay về Quản lý Chương
              </button>
              <button
                onClick={handleNewLesson}
                className="px-4 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-lg font-semibold"
              >
                Thêm Bài học mới
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="philosophy-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tổng quan</h3>
              <p className="text-gray-600">
                Hiện có {lessons.length} bài học trong chương này
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-600">
                {lessons.length}
              </div>
              <div className="text-sm text-gray-600">Bài học</div>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="philosophy-card p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Bài {lesson.display_order}: {lesson.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {lesson.summary || "Chưa có mô tả"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Thứ tự: {lesson.display_order}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/admin/lessons/${chapterId}/${lesson.id}`,
                          )
                        }
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Quản lý nội dung
                      </button>
                      <button
                        onClick={() => handleEdit(lesson)}
                        className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections Preview */}
              {lesson.sections && lesson.sections.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Phần nội dung:
                  </h4>
                  <div className="space-y-1">
                    {lesson.sections
                      .slice(0, 3)
                      .map((section, sectionIndex) => (
                        <div
                          key={section.id}
                          className="flex items-center justify-between text-sm text-gray-600"
                        >
                          <span>• {section.title}</span>
                          <span className="text-xs text-gray-400">
                            #{sectionIndex + 1}
                          </span>
                        </div>
                      ))}
                    {lesson.sections.length > 3 && (
                      <div className="text-xs text-gray-400 text-right">
                        +{lesson.sections.length - 3} phần khác
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {lessons.length === 0 && (
          <div className="philosophy-card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có bài học nào
            </h3>
            <p className="text-gray-600 mb-6">
              Hãy tạo bài học đầu tiên cho chương này
            </p>
            <button
              onClick={handleNewLesson}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Tạo bài học mới
            </button>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingLesson ? "Chỉnh sửa Bài học" : "Tạo Bài học mới"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề bài học
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-800 text-gray-800"
                  placeholder="Nhập tiêu đề bài học"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thứ tự
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 || e.target.value === "") {
                      setFormData({ ...formData, order: value || 1 });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-800 text-gray-800"
                  placeholder="Nhập thứ tự hiển thị (tối thiểu 1)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tóm tắt
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-800 text-gray-800"
                  placeholder="Nhập tóm tắt bài học"
                  rows={3}
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-800 text-gray-800"
                  placeholder="Nhập nội dung bài học"
                  rows={5}
                />
              </div> */}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                {editingLesson ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
