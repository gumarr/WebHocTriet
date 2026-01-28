"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/src/lib/context/AuthContext";
import {
  getSectionsByLessonId,
  createSection,
  updateSection,
  deleteSection,
} from "@/src/lib/supabase/services";
import { Section } from "@/src/lib/types/lesson";
import { motion } from "framer-motion";
import {
  AnimatedQuote,
  AnimatedSection,
  AnimatedList,
  AnimatedListItem,
} from "@/src/components/Lesson/AnimatedContent";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { MermaidDiagram } from "@/src/components/Lesson/MermaidDiagram";
import { RichTextEditor } from "@/src/components/Lesson/RichTextEditor";

// Content Preview Component for collapsible content
function ContentPreview({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if content is overflowing after render
  useEffect(() => {
    if (contentRef.current) {
      const element = contentRef.current;
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, [content]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={`prose prose-sm max-w-none ${
          isExpanded ? "" : "max-h-40 overflow-hidden"
        }`}
        style={{
          maxHeight: isExpanded ? "none" : "160px",
          overflow: isExpanded ? "visible" : "hidden",
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeRaw,
            rehypeSlug,
            rehypeAutolinkHeadings,
          ]}
          components={{
            h1: ({ children }) => (
              <AnimatedSection delay={0.2}>
                <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-4 mb-4">
                  {children}
                </h2>
              </AnimatedSection>
            ),
            h2: ({ children }) => (
              <AnimatedSection delay={0.3}>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {children}
                </h3>
              </AnimatedSection>
            ),
            h3: ({ children }) => (
              <AnimatedSection delay={0.4}>
                <h4 className="text-lg font-medium text-gray-700 mb-3">
                  {children}
                </h4>
              </AnimatedSection>
            ),
            p: ({ children }) => (
              <AnimatedSection delay={0.5}>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {children}
                </p>
              </AnimatedSection>
            ),
            ul: ({ children }) => (
              <AnimatedList>{children}</AnimatedList>
            ),
            li: ({ children }) => (
              <AnimatedListItem>{children}</AnimatedListItem>
            ),
            blockquote: ({ children }) => (
              <AnimatedQuote>{children}</AnimatedQuote>
            ),
            table: ({ children }) => (
              <AnimatedSection delay={0.6}>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    {children}
                  </table>
                </div>
              </AnimatedSection>
            ),
            strong: ({ children }) => (
              <span className="font-bold text-indigo-600">
                {children}
              </span>
            ),
            code: ({
              children,
              className,
              ...props
            }: React.HTMLAttributes<HTMLElement>) => {
              // Check if this code block contains mermaid content
              const content = String(children);
              if (
                className?.includes("language-mermaid") ||
                content.includes("graph TD") ||
                content.includes("graph LR")
              ) {
                return (
                  <AnimatedSection delay={0.7}>
                    <MermaidDiagram
                      content={content}
                      theme="default"
                      className="w-full"
                    />
                  </AnimatedSection>
                );
              }

              // For regular code blocks, render normally
              return (
                <span
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </span>
              );
            },
            pre: (props) => (
              <AnimatedSection delay={0.8}>
                <div className="bg-[#0f172a] p-6 rounded-xl overflow-x-auto border border-slate-800 shadow-2xl">
                  <pre
                    className="text-[13px] leading-[1.15] whitespace-pre font-mono text-[#4ade80]"
                    style={{
                      fontFamily: "'Courier New', Courier, monospace",
                      letterSpacing: "0px",
                    }}
                    {...props}
                  />
                </div>
              </AnimatedSection>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {isOverflowing && (
        <button
          onClick={toggleExpand}
          className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors flex items-center space-x-1"
        >
          <span>{isExpanded ? "Thu gọn" : "Xem thêm"}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function AdminLessonSectionsPage() {
  const router = useRouter();
  const params = useParams();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [chapterId] = useState(params.chapterId as string);
  const [lessonId] = useState(params.lessonId as string);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    order: 1,
  });

  // Load sections data
  useEffect(() => {
    if (!authLoading) {
      loadSections();
    }
  }, [authLoading]);

  const loadSections = async () => {
    try {
      const data = await getSectionsByLessonId(lessonId);
      setSections(data);
    } catch (error) {
      console.error("Error loading sections:", error);
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

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setFormData({
      title: section.title,
      content: section.content || "",
      order: section.display_order || 1,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (sectionId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa phần nội dung này không?")) {
      try {
        await deleteSection(sectionId);
        setSections(sections.filter((section) => section.id !== sectionId));
      } catch (error) {
        console.error("Error deleting section:", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingSection) {
        // Update existing section
        const updatedSection = await updateSection(editingSection.id, {
          title: formData.title,
          content: formData.content,
          display_order: formData.order,
          lesson_id: lessonId,
        });
        setSections(
          sections.map((section) =>
            section.id === editingSection.id ? updatedSection : section,
          ),
        );
      } else {
        // Create new section
        const newSection = await createSection({
          title: formData.title,
          content: formData.content,
          display_order: formData.order,
          lesson_id: lessonId,
        });
        // Only add to state if the section was created successfully
        if (newSection && newSection.id) {
          setSections([...sections, newSection]);
        }
      }
      // ✅ Close modal after successful save
      setIsModalOpen(false);
      setEditingSection(null);
      setFormData({ title: "", content: "", order: 1 });
      // ✅ Reload sections to ensure data is up-to-date
      await loadSections();
    } catch (error) {
      console.error("Error saving section:", error);
    }
  };

  const handleNewSection = () => {
    setEditingSection(null);
    setFormData({ title: "", content: "", order: 1 });
    setIsModalOpen(true);
  };

  const handleBackToLessons = () => {
    router.push(`/admin/lessons/${chapterId}`);
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
                Quản lý Nội dung Bài học
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý các phần nội dung chi tiết cho bài học
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToLessons}
                className="px-4 py-2 text-sm text-gray-700 hover:text-emerald-600 transition-colors border border-gray-300 rounded-lg"
              >
                Quay về Quản lý Bài học
              </button>
              <button
                onClick={handleNewSection}
                className="px-4 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-lg font-semibold"
              >
                Thêm Phần nội dung mới
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
                Hiện có {sections.length} phần nội dung
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-600">
                {sections.length}
              </div>
              <div className="text-sm text-gray-600">Phần nội dung</div>
            </div>
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-6">
          {sections.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chưa có phần nội dung nào
              </h3>
              <p className="text-gray-600 mb-6">
                Hãy tạo phần nội dung đầu tiên cho bài học này
              </p>
              <button
                onClick={handleNewSection}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Tạo phần nội dung mới
              </button>
            </div>
          ) : (
            sections
              .filter((section) => section !== null)
              .map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="philosophy-card p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-emerald-100 text-emerald-800 text-sm px-2 py-1 rounded-full font-medium">
                          Phần {section.display_order || 1}
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {section.title}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {section.content
                            ? `${section.content.length} ký tự`
                            : "Chưa có nội dung"}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(section)}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(section.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  {section.content && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Nội dung:
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <ContentPreview content={section.content} />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingSection
                ? "Chỉnh sửa Phần nội dung"
                : "Tạo Phần nội dung mới"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề phần
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-gray-800 text-gray-800"
                  placeholder="Nhập tiêu đề phần nội dung"
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
                  Nội dung
                </label>
                <RichTextEditor
                  value={formData.content || ""}
                  onChange={(value) =>
                    setFormData({ ...formData, content: value || "" })
                  }
                  placeholder="Nhập nội dung chi tiết cho phần này..."
                  className="min-h-[300px]"
                />
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
                {editingSection ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
