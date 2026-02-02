"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/context/AuthContext";
import { supabaseServices } from "@/src/lib/supabase/services";
import { Document, Chapter, Lesson } from "@/src/lib/types";
import { DocumentForm } from "@/src/components/Admin/DocumentForm";

export default function AdminDocumentsPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [specialFilter, setSpecialFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "display_order" | "created_at" | "updated_at"
  >("display_order");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [docsData, chaptersData, lessonsData] = await Promise.all([
          supabaseServices.getDocuments(),
          supabaseServices.getChapters(),
          supabaseServices.getLessons(),
        ]);

        setDocuments(docsData);
        setChapters(chaptersData);
        setLessons(lessonsData);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Redirect to login if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/login");
    }
  }, [isAdmin, isLoading, router]);

  // Filter and sort documents
  const filteredDocuments = documents
    .filter((doc) => {
      // Filter by search term
      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.description &&
          doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by chapter
      const matchesChapter =
        !selectedChapter ||
        doc.linked_lessons?.some(
          (lesson) => lesson.lesson?.chapter_id === selectedChapter,
        );

      // Filter by lesson
      const matchesLesson =
        !selectedLesson ||
        doc.linked_lessons?.some(
          (lesson) => lesson.lesson_id === selectedLesson,
        );

      // Filter by special filters
      let matchesSpecialFilter = true;
      if (specialFilter === "no_lesson") {
        matchesSpecialFilter = (doc.linked_lessons?.length || 0) === 0;
      } else if (specialFilter === "no_chapter") {
        matchesSpecialFilter =
          doc.linked_lessons?.every((lesson) => !lesson.lesson?.chapter_id) ||
          false;
      }

      return (
        matchesSearch && matchesChapter && matchesLesson && matchesSpecialFilter
      );
    })
    .sort((a, b) => {
      let aValue: number, bValue: number;

      if (sortBy === "display_order") {
        aValue = a.display_order;
        bValue = b.display_order;
      } else if (sortBy === "created_at") {
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
      } else {
        aValue = new Date(a.updated_at).getTime();
        bValue = new Date(b.updated_at).getTime();
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setIsFormOpen(true);
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài liệu này không?")) {
      return;
    }

    try {
      await supabaseServices.deleteDocument(documentId);
      setDocuments(documents.filter((doc) => doc.id !== documentId));
    } catch (error) {
      console.error("Error deleting document:", error);
      setError("Lỗi khi xóa tài liệu");
    }
  };

  const handleFormSubmit = async (documentData: {
    title: string;
    description?: string;
    category: "slide" | "doc" | "sheet";
    source_type: "upload" | "link";
    file_path?: string;
    external_url?: string;
    display_order: number;
    linked_lessons?: { document_id: string; lesson_id: string }[];
  }) => {
    try {
      if (editingDocument?.id) {
        // Update existing document
        await supabaseServices.updateDocument(editingDocument.id, documentData);
        setDocuments(
          documents.map((doc) =>
            doc.id === editingDocument.id ? { ...doc, ...documentData } : doc,
          ),
        );
      } else {
        // Create new document
        const newDocument = await supabaseServices.createDocument(documentData);
        setDocuments([...documents, newDocument]);
      }

      setIsFormOpen(false);
      setEditingDocument(null);
    } catch (error) {
      console.error("Error saving document:", error);
      setError("Lỗi khi lưu tài liệu");
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingDocument(null);
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
                Quản lý Tài liệu
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý các tài liệu học tập (slide, tài liệu, bảng tính)
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
                onClick={() => {
                  setEditingDocument(null);
                  setIsFormOpen(true);
                }}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                + Tạo tài liệu mới
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
                {documents.length} tài liệu đang được quản lý
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{documents.length}</div>
              <div className="text-purple-100 text-sm">Tài liệu</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="philosophy-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search by name */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm theo tên
              </label>
              <input
                type="text"
                placeholder="Nhập tên tài liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
              />
            </div>

            {/* Filter by chapter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo chương
              </label>
              <select
                value={selectedChapter}
                onChange={(e) => {
                  setSelectedChapter(e.target.value);
                  setSelectedLesson(""); // Reset lesson filter when chapter changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
              >
                <option value="">Tất cả các chương</option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
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
                {lessons
                  .filter(
                    (lesson) =>
                      !selectedChapter || lesson.chapter_id === selectedChapter,
                  )
                  .map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
              </select>
            </div>

            {/* Special filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bộ lọc đặc biệt
              </label>
              <select
                value={specialFilter}
                onChange={(e) => setSpecialFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
              >
                <option value="">Không có</option>
                <option value="no_lesson">Tài liệu không có bài học</option>
                <option value="no_chapter">Tài liệu không có chương</option>
              </select>
            </div>
          </div>

          {/* Sort options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp theo
              </label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | "display_order"
                        | "created_at"
                        | "updated_at",
                    )
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                >
                  <option value="display_order">Thứ tự hiển thị</option>
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
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
              </div>
            </div>

            {/* Clear filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedChapter("");
                  setSelectedLesson("");
                  setSpecialFilter("");
                  setSortBy("display_order");
                  setSortOrder("asc");
                }}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:text-emerald-600 transition-colors border border-gray-300 rounded-lg"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="philosophy-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Danh sách Tài liệu
            </h3>
            <div className="text-sm text-gray-600">
              {filteredDocuments.length} tài liệu được tìm thấy
            </div>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy tài liệu nào
              </h3>
              <p className="text-gray-600 mb-6">
                Hãy thử thay đổi các bộ lọc hoặc tạo tài liệu mới
              </p>
              <button
                onClick={() => {
                  setEditingDocument(null);
                  setIsFormOpen(true);
                }}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Tạo tài liệu mới
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className="philosophy-card p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-xl font-semibold text-gray-900">
                          {document.title}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            document.category === "slide"
                              ? "bg-blue-100 text-blue-800"
                              : document.category === "doc"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {document.category === "slide"
                            ? "Slide"
                            : document.category === "doc"
                              ? "Tài liệu"
                              : "Bảng tính"}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          Thứ tự: {document.display_order}
                        </span>
                      </div>

                      {document.description && (
                        <p className="text-gray-600 mb-3">
                          {document.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>
                          📁{" "}
                          {document.source_type === "upload"
                            ? "Tải lên"
                            : "Liên kết"}
                        </span>
                        {document.source_type === "upload" &&
                          document.file_path && (
                            <span>📄 {document.file_path}</span>
                          )}
                        {document.source_type === "link" &&
                          document.external_url && (
                            <span>🔗 {document.external_url}</span>
                          )}
                      </div>

                      {/* Linked lessons */}
                      {document.linked_lessons &&
                      document.linked_lessons.length > 0 ? (
                        <div className="space-y-2">
                          <span className="text-xs text-gray-400 font-medium">
                            Các bài học liên quan:
                          </span>
                          <div className="space-y-1">
                            {document.linked_lessons.map((dl) => (
                              <div
                                key={dl.lesson_id}
                                className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded"
                              >
                                <div className="font-medium">
                                  {dl.lesson?.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {dl.lesson?.chapter?.title}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Không có bài học liên quan
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEditDocument(document)}
                        className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(document.id)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* Document stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
                    <span>
                      Cập nhật:{" "}
                      {new Date(document.updated_at).toLocaleDateString(
                        "vi-VN",
                      )}
                    </span>
                    <span>
                      Tạo:{" "}
                      {new Date(document.created_at).toLocaleDateString(
                        "vi-VN",
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <DocumentForm
              document={editingDocument}
              chapters={chapters}
              lessons={lessons}
              onSubmit={handleFormSubmit}
              onClose={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}
