"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/context/AuthContext";
import {
  getChapters,
  getChaptersWithLessons,
  createChapter,
  updateChapter,
  deleteChapter,
} from "@/src/lib/supabase/services";
import { Chapter } from "@/src/lib/types/chapter";
import { motion } from "framer-motion";
import { ChapterImageUpload } from "@/src/components/Chapter/ChapterImageUpload";

export default function AdminLessonsPage() {
  const router = useRouter();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 1,
    image_url: "",
  });

  // Load chapters data
  useEffect(() => {
    if (!authLoading) {
      loadChapters();
    }
  }, [authLoading]);

  const loadChapters = async () => {
    try {
      const data = await getChaptersWithLessons();
      setChapters(data);
    } catch (error) {
      console.error("Error loading chapters:", error);
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

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setFormData({
      title: chapter.title,
      description: chapter.description || "",
      order: chapter.display_order || 1,
      image_url: chapter.image_url || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (chapterId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa chương này không?")) {
      try {
        await deleteChapter(chapterId);
        setChapters(chapters.filter((ch) => ch.id !== chapterId));
      } catch (error) {
        console.error("Error deleting chapter:", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingChapter) {
        // Update existing chapter
        const updatedChapter = await updateChapter(editingChapter.id, {
          ...formData,
          display_order: formData.order,
        });
        setChapters(
          chapters.map((ch) =>
            ch.id === editingChapter.id ? updatedChapter : ch,
          ),
        );
      } else {
        // Create new chapter
        const newChapter = await createChapter({
          ...formData,
          display_order: formData.order,
        });
        setChapters([...chapters, newChapter]);
      }
      // ✅ Close modal after successful save
      setIsModalOpen(false);
      setEditingChapter(null);
      setFormData({ title: "", description: "", order: 1, image_url: "" });
      // ✅ Reload chapters to ensure data is up-to-date
      await loadChapters();
    } catch (error) {
      console.error("Error saving chapter:", error);
    }
  };

  const handleNewChapter = () => {
    setEditingChapter(null);
    setFormData({ title: "", description: "", order: 1, image_url: "" });
    setIsModalOpen(true);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center">
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý Chương học
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý các chương và bài học trong hệ thống triết học
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
                onClick={handleNewChapter}
                className="px-4 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-lg font-semibold"
              >
                Thêm Chương mới
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
                Hiện có {chapters.length} chương học
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-600">
                {chapters.length}
              </div>
              <div className="text-sm text-gray-600">Chương</div>
            </div>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="philosophy-card p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Chương {chapter.display_order}: {chapter.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {chapter.description || "Chưa có mô tả"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {chapter.lessons?.length || 0} bài học
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/lessons/${chapter.id}`)
                        }
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Quản lý bài học
                      </button>
                      <button
                        onClick={() => handleEdit(chapter)}
                        className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(chapter.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lessons Preview */}
              {chapter.lessons && chapter.lessons.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Bài học:
                  </h4>
                  <div className="space-y-1">
                    {chapter.lessons.slice(0, 3).map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between text-sm text-gray-600"
                      >
                        <span>• {lesson.title}</span>
                        <span className="text-xs text-gray-400">
                          #{lesson.display_order}
                        </span>
                      </div>
                    ))}
                    {chapter.lessons.length > 3 && (
                      <div className="text-xs text-gray-400 text-right">
                        +{chapter.lessons.length - 3} bài học khác
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {chapters.length === 0 && (
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
              Chưa có chương học nào
            </h3>
            <p className="text-gray-600 mb-6">
              Hãy tạo chương học đầu tiên để bắt đầu quản lý nội dung
            </p>
            <button
              onClick={handleNewChapter}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Tạo chương học mới
            </button>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingChapter ? "Chỉnh sửa Chương" : "Tạo Chương mới"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề chương
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-800 text-gray-800"
                  placeholder="Nhập tiêu đề chương"
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
                {formData.order < 1 && (
                  <p className="text-red-600 text-sm mt-1">
                    Thứ tự phải lớn hơn hoặc bằng 1
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-800 text-gray-800"
                  placeholder="Nhập mô tả chương"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh chương
                </label>
                <div className="space-y-4">
                  {/* File Upload Component */}
                  <ChapterImageUpload
                    chapterId={editingChapter?.id || ""}
                    currentImageUrl={formData.image_url}
                    onImageChange={(imageUrl) => {
                      setFormData({ ...formData, image_url: imageUrl || "" });
                    }}
                  />

                  {/* Divider */}
                  <div className="flex items-center my-4">
                    <hr className="flex-1 border-gray-300" />
                    <span className="px-4 text-sm text-gray-500">Hoặc</span>
                    <hr className="flex-1 border-gray-300" />
                  </div>

                  {/* URL Upload Section */}
                  <div className="space-y-3">
                    <label className="block text-xs font-medium text-gray-600">
                      Tải lên từ URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        id="imageUrlInput"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-800 text-gray-800"
                        placeholder="Dán URL ảnh từ web vào đây..."
                      />
                      <button
                        onClick={async () => {
                          const urlInput = document.getElementById(
                            "imageUrlInput",
                          ) as HTMLInputElement;
                          const imageUrl = urlInput.value.trim();

                          if (!imageUrl) {
                            alert("Vui lòng nhập URL ảnh");
                            return;
                          }

                          try {
                            // Upload to Supabase via API route with chapter ID for automatic override
                            const response = await fetch("/api/upload-image", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                imageUrl: imageUrl,
                                chapterId: editingChapter?.id,
                              }),
                            });

                            const result = await response.json();

                            if (response.ok && result.success) {
                              setFormData({
                                ...formData,
                                image_url: result.imageUrl,
                              });
                              urlInput.value = "";
                              alert("Tải ảnh lên thành công!");
                            } else {
                              alert(
                                result.error ||
                                  "Tải ảnh lên thất bại. Vui lòng thử lại.",
                              );
                            }
                          } catch (error) {
                            console.error("Error uploading image:", error);
                            alert("Tải ảnh lên thất bại. Vui lòng thử lại.");
                          }
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                      >
                        Tải lên từ URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
                {editingChapter ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
