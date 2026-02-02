"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseServices } from "@/src/lib/supabase/services";
import { Document } from "@/src/lib/types/document";
import { getChapters } from "@/src/lib/utils/data";
import { Chapter } from "@/src/lib/types/chapter";

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    chapterId: "all",
    category: "all",
    sourceType: "all",
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [docs, chaps] = await Promise.all([
          supabaseServices.getDocuments(),
          getChapters(),
        ]);
        setDocuments(docs);
        setChapters(chaps);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter documents based on selected filters
  const filteredDocuments = documents.filter((doc) => {
    const chapterMatch =
      filters.chapterId === "all" ||
      doc.linked_lessons?.some((ll) => ll.lesson?.chapter_id === filters.chapterId);
    
    const categoryMatch =
      filters.category === "all" || doc.category === filters.category;
    
    const sourceTypeMatch =
      filters.sourceType === "all" || doc.source_type === filters.sourceType;

    return chapterMatch && categoryMatch && sourceTypeMatch;
  });

  const getChapterName = (chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    return chapter ? chapter.title : "Không xác định";
  };

  const getLessonName = (lessonId: string) => {
    // Find the lesson in the linked lessons
    const linkedLesson = documents
      .flatMap((doc) => doc.linked_lessons || [])
      .find((ll) => ll.lesson_id === lessonId);
    return linkedLesson?.lesson?.title || "Không xác định";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải tài liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-orange-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="philosophy-card p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tài liệu học tập
              </h1>
              <p className="text-gray-600">
                Các tài liệu học tập, slide bài giảng và tài liệu tham khảo
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-orange-600">
                {filteredDocuments.length}
              </span>
              <p className="text-sm text-gray-600">Tài liệu</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="philosophy-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo chương
              </label>
              <select
                value={filters.chapterId}
                onChange={(e) =>
                  setFilters({ ...filters, chapterId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Tất cả các chương</option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo loại tài liệu
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Tất cả loại</option>
                <option value="slide">Slide bài giảng</option>
                <option value="doc">Tài liệu học tập</option>
                <option value="sheet">Bảng tính</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo nguồn
              </label>
              <select
                value={filters.sourceType}
                onChange={(e) =>
                  setFilters({ ...filters, sourceType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Tất cả nguồn</option>
                <option value="upload">Tải lên</option>
                <option value="link">Liên kết ngoài</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                className="philosophy-card p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-lg">
                        {document.category === "slide" ? "📊" : 
                         document.category === "doc" ? "📄" : "📋"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {document.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {document.description || "Không có mô tả"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        document.category === "slide"
                          ? "bg-blue-100 text-blue-800"
                          : document.category === "doc"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {document.category === "slide"
                        ? "Slide"
                        : document.category === "doc"
                        ? "Tài liệu"
                        : "Bảng tính"}
                    </span>
                  </div>
                </div>

                {/* Linked Lessons */}
                {document.linked_lessons && document.linked_lessons.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Liên kết với bài học:
                    </h4>
                    <div className="space-y-1">
                      {document.linked_lessons.map((linkedLesson) => (
                        <div
                          key={linkedLesson.lesson_id}
                          className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1"
                        >
                          <span className="font-medium">
                            {getLessonName(linkedLesson.lesson_id)}
                          </span>
                          {" - "}
                          <span className="text-gray-500">
                            {getChapterName(linkedLesson.lesson?.chapter_id || "")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-3">
                  <div className="flex space-x-4">
                    <span>
                      Loại:{" "}
                      {document.source_type === "upload" ? "Tải lên" : "Liên kết"}
                    </span>
                    <span>Thứ tự: {document.display_order}</span>
                  </div>
                  <div className="flex space-x-2">
                    {document.source_type === "upload" && document.file_path ? (
                      <a
                        href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${document.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-orange-500 text-white px-3 py-1 rounded font-medium hover:bg-orange-600 transition-colors text-xs"
                      >
                        Tải xuống
                      </a>
                    ) : document.source_type === "link" && document.external_url ? (
                      <a
                        href={document.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-orange-500 text-white px-3 py-1 rounded font-medium hover:bg-orange-600 transition-colors text-xs"
                      >
                        Mở liên kết
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="philosophy-card p-8 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Không tìm thấy tài liệu
            </h3>
            <p className="text-gray-600 mb-4">
              Không có tài liệu nào phù hợp với bộ lọc hiện tại.
            </p>
            <button
              onClick={() =>
                setFilters({ chapterId: "all", category: "all", sourceType: "all" })
              }
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Xem tất cả tài liệu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}