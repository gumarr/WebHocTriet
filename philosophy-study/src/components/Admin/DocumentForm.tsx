import React, { useState } from "react";
import { Document, Chapter, Lesson } from "@/src/lib/types";
import { supabaseServices } from "@/src/lib/supabase/services";

interface DocumentFormData {
  title: string;
  category: "slide" | "doc" | "sheet";
  description: string;
  source_type: "upload" | "link";
  display_order: number;
  file_path?: string;
  file_extension?: string;
  external_url?: string;
}

interface DocumentFormProps {
  document?: Document | null;
  chapters: Chapter[];
  lessons: Lesson[];
  onSubmit: (documentData: DocumentFormData) => void;
  onClose: () => void;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  document,
  chapters,
  lessons,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    title: document?.title || "",
    category: (document?.category as "slide" | "doc" | "sheet") || "slide",
    description: document?.description || "",
    source_type: (document?.source_type as "upload" | "link") || "upload",
    external_url: document?.external_url || "",
    linked_lesson_ids: document?.linked_lessons?.map(dl => dl.lesson_id) || [],
    display_order: document?.display_order || 1,
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      let fileData = {};
      
      // Handle file upload if in upload mode
      if (formData.source_type === "upload" && file) {
        setIsUploading(true);
        
        // Generate a unique document ID for the file
        const documentId = document?.id || crypto.randomUUID();
        
        try {
          const fileName = await supabaseServices.uploadDocumentFile(file, documentId);
          
          fileData = {
            file_path: fileName,
            file_extension: file.name.split(".").pop(),
          };
        } catch (uploadError) {
          console.error("File upload error:", uploadError);
          setError("Lỗi khi tải lên tệp tin. Vui lòng thử lại.");
          return;
        }
      } else if (formData.source_type === "link" && formData.external_url) {
        fileData = {
          external_url: formData.external_url,
        };
      }

      const documentData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        source_type: formData.source_type,
        display_order: formData.display_order,
        ...fileData,
      };

        // Create or update document
      if (document?.id) {
        // Update existing document
        await supabaseServices.updateDocument(document.id, documentData);
        
        // Update linked lessons
        if (formData.linked_lesson_ids.length > 0) {
          await supabaseServices.createDocumentLessons(document.id, formData.linked_lesson_ids);
        }
      } else {
      // Create new document
      const newDocument = await supabaseServices.createDocument(documentData);
      
      // Create linked lessons if any
      if (formData.linked_lesson_ids.length > 0) {
        await supabaseServices.createDocumentLessons(newDocument.id, formData.linked_lesson_ids);
      }
      }

      onSubmit(documentData);
    } catch (error) {
      console.error("Error saving document:", error);
      setError("Lỗi khi lưu tài liệu. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLessonToggle = (lessonId: string) => {
    setFormData(prev => ({
      ...prev,
      linked_lesson_ids: prev.linked_lesson_ids.includes(lessonId)
        ? prev.linked_lesson_ids.filter(id => id !== lessonId)
        : [...prev.linked_lesson_ids, lessonId]
    }));
  };

  const getLessonsForChapter = (chapterId: string) => {
    return lessons.filter(lesson => lesson.chapter_id === chapterId);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {document ? "Chỉnh sửa Tài liệu" : "Tạo Tài liệu Mới"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề tài liệu *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                category: e.target.value as "slide" | "doc" | "sheet" 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
              required
            >
              <option value="slide">Slide</option>
              <option value="doc">Tài liệu</option>
              <option value="sheet">Bảng tính</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
            placeholder="Mô tả ngắn về tài liệu..."
          />
        </div>

        {/* Source Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại nguồn *
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="upload"
                checked={formData.source_type === "upload"}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  source_type: e.target.value as "upload" | "link" 
                }))}
                className="mr-2"
              />
              Tải lên tệp tin
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="link"
                checked={formData.source_type === "link"}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  source_type: e.target.value as "upload" | "link" 
                }))}
                className="mr-2"
              />
              Liên kết ngoài
            </label>
          </div>
        </div>

        {/* File Upload or Link Input */}
        {formData.source_type === "upload" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tệp tin (pptx, pdf, docx, xlsx)
            </label>
            <input
              type="file"
              accept=".pptx,.pdf,.docx,.xlsx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
            />
            {document && document.file_path && !file && (
              <p className="mt-2 text-sm text-gray-600">
                Tệp tin hiện tại: {document.file_path}
              </p>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL liên kết *
            </label>
            <input
              type="url"
              value={formData.external_url}
              onChange={(e) => setFormData(prev => ({ ...prev, external_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
              placeholder="https://docs.google.com/..."
              required={formData.source_type === "link"}
            />
          </div>
        )}

        {/* Display Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thứ tự hiển thị *
          </label>
          <input
            type="number"
            min="1"
            value={formData.display_order}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              display_order: parseInt(e.target.value) || 1 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
            required
          />
        </div>

        {/* Linked Lessons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Liên kết với bài học
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Chọn các bài học mà tài liệu này sẽ được liên kết (có thể chọn nhiều)
          </p>
          
          <div className="space-y-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {chapters.map((chapter) => {
              const chapterLessons = getLessonsForChapter(chapter.id);
              if (chapterLessons.length === 0) return null;

              return (
                <div key={chapter.id} className="space-y-2">
                  <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
                    {chapter.title}
                  </h4>
                  <div className="space-y-1 pl-4">
                    {chapterLessons.map((lesson) => (
                      <label key={lesson.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.linked_lesson_ids.includes(lesson.id)}
                          onChange={() => handleLessonToggle(lesson.id)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{lesson.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {formData.linked_lesson_ids.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Tài liệu này sẽ không được liên kết với bài học nào
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:text-emerald-600 transition-colors border border-gray-300 rounded-lg"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Đang xử lý..." : document ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </form>
    </div>
  );
};