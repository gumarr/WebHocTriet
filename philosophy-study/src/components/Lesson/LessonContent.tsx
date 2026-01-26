"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lesson } from "../../lib/types/lesson";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { useAppContext } from "../../lib/context/AppContext";
import {
  AnimatedSection,
  AnimatedCard,
  AnimatedList,
  AnimatedListItem,
  AnimatedQuote,
  AnimatedDiagram,
  AnimatedTimeline,
  AnimatedComparison,
  AnimatedMindMap,
  AnimatedPageNavigator,
} from "./AnimatedContent";
import { MermaidDiagram, PhilosophyDiagrams } from "./MermaidDiagram";
import { useRouter } from "next/navigation";
import { getChapters } from "../../lib/utils/data";

interface LessonContentProps {
  lesson: Lesson;
}

export function LessonContent({ lesson }: LessonContentProps) {
  const [activeTab, setActiveTab] = useState<"content" | "flashcards" | "test">(
    "content",
  );
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [showResults, setShowResults] = useState(false);
  const { userProgress, updateUserProgress } = useAppContext();
  const router = useRouter();

  // Get all lessons in the same chapter for navigation
  const getAllLessonsInChapter = async () => {
    const chapters = await getChapters();
    const chapter = chapters.find((c) => c.id === lesson.chapterId);
    return chapter ? chapter.lessons.sort((a, b) => a.order - b.order) : [];
  };

  // Calculate progress based on learned flashcards
  const calculateProgress = () => {
    if (lesson.flashcards.length === 0) return 0;

    const learnedFlashcards = lesson.flashcards.filter(
      (flashcard) => userProgress.flashcardProgress[flashcard.id]?.mastered > 0,
    ).length;

    return Math.round((learnedFlashcards / lesson.flashcards.length) * 100);
  };

  const progressPercentage = calculateProgress();

  // State for navigation
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);

  // Load lessons and set up navigation
  useEffect(() => {
    const loadLessons = async () => {
      const lessons = await getAllLessonsInChapter();

      const currentIndex = lessons.findIndex((l) => l.id === lesson.id);

      setPrevLesson(currentIndex > 0 ? lessons[currentIndex - 1] : null);
      setNextLesson(
        currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
      );
    };

    loadLessons();
  }, [lesson.id, lesson.chapterId]);

  const handleNavigateToLesson = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  const tabs = [
    { id: "content", label: " Nội dung", icon: "📚" },
    { id: "flashcards", label: " Flashcards", icon: "🎴" },
    { id: "test", label: " Kiểm tra", icon: "📝" },
  ];

  const handleNextFlashcard = () => {
    setCurrentFlashcardIndex((prev) =>
      prev < lesson.flashcards.length - 1 ? prev + 1 : 0,
    );
  };

  const handlePrevFlashcard = () => {
    setCurrentFlashcardIndex((prev) =>
      prev > 0 ? prev - 1 : lesson.flashcards.length - 1,
    );
  };

  // Flip card mechanism - toggle showFlashcard state
  const handleFlipCard = () => {
    setShowFlashcard(!showFlashcard);
  };

  const handleTestAnswer = (questionId: string, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    lesson.test.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / lesson.test.questions.length) * 100);
  };

  const handleSubmitTest = () => {
    setShowResults(true);
  };

  // Page-based navigation for content
  const [currentPage, setCurrentPage] = useState(0);

  // Parse content into pages based on sections
  const parseContentIntoPages = () => {
    if (lesson.sections && lesson.sections.length > 0) {
      // Use sections as pages
      return lesson.sections.map((section, index) => ({
        id: `section-${index + 1}`,
        title: section.title,
        content: section.content,
      }));
    } else if (lesson.content) {
      // Fallback to old parsing logic for content string
      const lines = lesson.content.split("\n");
      const pages: Array<{ id: string; title: string; content: string }> = [];
      let currentPageContent = "";
      let currentPageTitle = "Giới thiệu";
      let pageCounter = 1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if line is a section marker (### Section X: Title)
        if (line.startsWith("### Section ") && line.includes(":")) {
          // Save current page if it has content
          if (currentPageContent.trim()) {
            pages.push({
              id: `page-${pageCounter}`,
              title: currentPageTitle,
              content: currentPageContent.trim(),
            });
            pageCounter++;
          }

          // Extract section title from the line (remove "### Section X: " prefix)
          const sectionTitle = line.replace(/### Section \d+: /, "").trim();
          currentPageTitle = sectionTitle;
          currentPageContent = line + "\n";
        }
        // Check if line is a main heading (##) that's not a section
        else if (line.startsWith("## ") && !line.startsWith("###")) {
          // Add main headings to current page content
          currentPageContent += line + "\n";
        }
        // Check if line is a subsection (###) that's not a section marker
        else if (line.startsWith("### ") && !line.includes(":")) {
          // Add subsections to current page content
          currentPageContent += line + "\n";
        } else {
          currentPageContent += line + "\n";
        }
      }

      // Add the last page
      if (currentPageContent.trim()) {
        pages.push({
          id: `page-${pageCounter}`,
          title: currentPageTitle,
          content: currentPageContent.trim(),
        });
      }

      return pages;
    }

    return [];
  };

  const pages = parseContentIntoPages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white shadow-2xl border-b-4 border-indigo-500">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {lesson.title}
                </h1>
                <p className="text-md text-gray-600">{lesson.summary}</p>
              </div>
            </div>
            <div className="text-center">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                {lesson.chapterId}
              </span>
              <span className="inline-block bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full ml-2">
                Phần {lesson.order}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            Tiến độ: {progressPercentage}%
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      {(prevLesson || nextLesson) && (
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                {prevLesson && (
                  <button
                    onClick={() => handleNavigateToLesson(prevLesson.id)}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    <span>⬅️</span>
                    <span>Bài học trước</span>
                    <span className="text-sm text-gray-600">
                      ({prevLesson.title})
                    </span>
                  </button>
                )}
              </div>
              <div>
                {nextLesson && (
                  <button
                    onClick={() => handleNavigateToLesson(nextLesson.id)}
                    className="flex items-center space-x-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    <span>Bài học tiếp theo</span>
                    <span className="text-sm text-indigo-600">
                      ({nextLesson.title})
                    </span>
                    <span>➡️</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex space-x-1 py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "content" | "flashcards" | "test")
                }
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="space-y-8 animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Page-based Content Navigation */}
            <AnimatedPageNavigator
              pages={pages.map((page) => ({
                id: page.id,
                title: page.title,
                content: (
                  <div>
                    {/* Display the section title as a main heading */}
                    <AnimatedSection delay={0.1}>
                      <h1 className="text-4xl font-bold text-gray-900 border-b-2 border-indigo-200 pb-6 mb-8">
                        {page.title}
                      </h1>
                    </AnimatedSection>

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
                            <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-indigo-500 pl-4 mb-6">
                              {children}
                            </h2>
                          </AnimatedSection>
                        ),
                        h2: ({ children }) => (
                          <AnimatedSection delay={0.3}>
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                              {children}
                            </h3>
                          </AnimatedSection>
                        ),
                        h3: ({ children }) => (
                          <AnimatedSection delay={0.4}>
                            <h4 className="text-xl font-medium text-gray-700 mb-3">
                              {children}
                            </h4>
                          </AnimatedSection>
                        ),
                        h4: ({ children }) => (
                          <AnimatedSection delay={0.5}>
                            <h5 className="text-lg font-semibold text-gray-700 mb-3">
                              {children}
                            </h5>
                          </AnimatedSection>
                        ),
                        p: ({ children }) => (
                          <AnimatedSection delay={0.6}>
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
                          <AnimatedSection delay={0.7}>
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
                              <AnimatedSection delay={0.8}>
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
                        pre: ({
                          children,
                          className,
                          ...props
                        }: React.HTMLAttributes<HTMLPreElement>) => {
                          // Check if this pre block contains mermaid content
                          const content = String(children);
                          if (
                            className?.includes("language-mermaid") ||
                            content.includes("graph TD") ||
                            content.includes("graph LR")
                          ) {
                            return (
                              <AnimatedSection delay={0.9}>
                                <MermaidDiagram
                                  content={content}
                                  theme="default"
                                  className="w-full"
                                />
                              </AnimatedSection>
                            );
                          }

                          // For regular pre blocks, render normally
                          return (
                            <AnimatedSection delay={0.8}>
                              <div className="bg-[#0f172a] p-6 rounded-xl overflow-x-auto border border-slate-800 shadow-2xl">
                                <pre
                                  className="text-[13px] leading-[1.15] whitespace-pre font-mono text-[#4ade80]"
                                  style={{
                                    fontFamily:
                                      "'Courier New', Courier, monospace",
                                    letterSpacing: "0px",
                                  }}
                                  {...props}
                                >
                                  {children}
                                </pre>
                              </div>
                            </AnimatedSection>
                          );
                        },
                      }}
                    >
                      {page.content}
                    </ReactMarkdown>
                  </div>
                ),
              }))}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            />

            {/* Interactive Elements */}
            <AnimatedSection delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Flashcards Card */}
                <AnimatedCard delay={0.1}>
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎴</div>
                    <h3 className="text-xl font-semibold mb-2">
                      Thử sức với Flashcards
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Củng cố kiến thức qua các thẻ ghi nhớ
                    </p>
                    <button
                      onClick={() => setActiveTab("flashcards")}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Bắt đầu học
                    </button>
                  </div>
                </AnimatedCard>

                {/* Test Card */}
                <AnimatedCard delay={0.2}>
                  <div className="text-center">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold mb-2">
                      Kiểm tra kiến thức
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Thử sức với 20 câu hỏi trắc nghiệm
                    </p>
                    <button
                      onClick={() => setActiveTab("test")}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Làm bài kiểm tra
                    </button>
                  </div>
                </AnimatedCard>
              </div>
            </AnimatedSection>

            {/* Statistics */}
            <AnimatedSection delay={0.3}>
              <AnimatedCard>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <AnimatedSection delay={0.4}>
                    <div>
                      <div className="text-2xl font-bold text-indigo-600">
                        {lesson.flashcards.length}
                      </div>
                      <div className="text-sm text-gray-600">Flashcards</div>
                    </div>
                  </AnimatedSection>
                  <AnimatedSection delay={0.5}>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {lesson.test.questions.length}
                      </div>
                      <div className="text-sm text-gray-600">Câu hỏi</div>
                    </div>
                  </AnimatedSection>
                  <AnimatedSection delay={0.6}>
                    <div>
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-sm text-gray-600">Mức độ khó</div>
                    </div>
                  </AnimatedSection>
                </div>
              </AnimatedCard>
            </AnimatedSection>
          </div>
        )}

        {/* Flashcards Tab */}
        {activeTab === "flashcards" && (
          <div className="space-y-6 animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Flashcard Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Thẻ ghi nhớ</h3>
                  <p className="text-gray-600">
                    Trang {currentFlashcardIndex + 1} /{" "}
                    {lesson.flashcards.length}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Tiến độ:{" "}
                    {Math.round(
                      ((currentFlashcardIndex + 1) / lesson.flashcards.length) *
                        100,
                    )}
                    %
                  </span>
                  <div className="flex space-x-2">
                    {lesson.flashcards.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index === currentFlashcardIndex
                            ? "bg-indigo-500"
                            : index < currentFlashcardIndex
                              ? "bg-green-500"
                              : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Flashcard */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 min-h-64">
              <div className="text-center">
                <div className="mb-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      difficultyColors[
                        lesson.flashcards[currentFlashcardIndex].difficulty
                      ]
                    }`}
                  >
                    {lesson.flashcards[
                      currentFlashcardIndex
                    ].difficulty.toUpperCase()}
                  </span>
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full ml-2">
                    {lesson.flashcards[currentFlashcardIndex].category}
                  </span>
                </div>

                {/* Flashcard Container with Flip Animation */}
                <div className="flex justify-center mb-8">
                  <div
                    className="w-full max-w-md h-64 cursor-pointer"
                    onClick={handleFlipCard}
                    style={{ perspective: "1000px" }} /* 1. Tạo chiều sâu 3D */
                  >
                    {/* Flashcard Inner: Khối xoay */}
                    <div
                      className="relative w-full h-full"
                      style={{
                        transition: "transform 0.6s",
                        transformStyle: "preserve-3d",
                        transform: showFlashcard
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)" /* 2. Xử lý xoay tại đây */,
                      }}
                    >
                      {/* --- MẶT TRƯỚC (FRONT) --- */}
                      <div
                        className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200 shadow-lg flex flex-col justify-center items-center"
                        style={{
                          backfaceVisibility: "hidden",
                        }} /* 3. Ẩn mặt sau khi lật */
                      >
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">
                          Câu hỏi:
                        </h3>
                        <p className="text-lg text-gray-700 leading-relaxed text-center">
                          {lesson.flashcards[currentFlashcardIndex].question}
                        </p>
                        <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                          Nhấn để lật thẻ
                        </div>
                      </div>

                      {/* --- MẶT SAU (BACK) --- */}
                      <div
                        className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200 shadow-lg flex flex-col justify-center items-center"
                        style={{
                          backfaceVisibility: "hidden",
                          transform:
                            "rotateY(180deg)" /* 4. Mặc định úp mặt sau lại 180 độ */,
                        }}
                      >
                        <h3 className="text-xl font-semibold mb-4 text-green-800">
                          Trả lời:
                        </h3>
                        <p className="text-lg text-green-700 leading-relaxed text-center">
                          {lesson.flashcards[currentFlashcardIndex].answer}
                        </p>
                        <div className="absolute bottom-4 right-4 text-xs text-green-500">
                          Nhấn để lật lại
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <div className="flex justify-center items-center space-x-8">
                  <button
                    onClick={handlePrevFlashcard}
                    className="w-12 h-12 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-110"
                    title="Flashcard trước"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNextFlashcard}
                    className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-110"
                    title="Flashcard tiếp theo"
                  >
                    →
                  </button>
                </div>

                {/* Progress Indicator */}
                <div className="mt-6 flex justify-center">
                  <div className="flex space-x-2">
                    {lesson.flashcards.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentFlashcardIndex
                            ? "bg-indigo-500 scale-125"
                            : index < currentFlashcardIndex
                              ? "bg-green-500"
                              : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Danh mục:</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  new Set(lesson.flashcards.map((f) => f.category)),
                ).map((category) => (
                  <span
                    key={category}
                    className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Test Tab */}
        {activeTab === "test" && (
          <div className="space-y-6 animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold mb-4">📝 Bài Kiểm Tra</h2>
              <p className="text-gray-600 mb-6">
                Hãy trả lời 20 câu hỏi trắc nghiệm để kiểm tra kiến thức của
                bạn!
              </p>

              {showResults ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-3xl font-bold text-indigo-600 mb-2">
                    Kết quả: {calculateScore()}%
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {calculateScore() >= 70
                      ? "Xuất sắc! Bạn đã hiểu bài rất tốt!"
                      : "Cần cố gắng hơn nữa!"}
                  </p>
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setSelectedAnswers({});
                    }}
                    className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
                  >
                    Làm lại bài kiểm tra
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {lesson.test.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600">
                          Câu {index + 1}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            question.difficulty === "easy"
                              ? "bg-green-100 text-green-800"
                              : question.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {question.difficulty.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="text-lg font-semibold mb-4">
                        {question.question}
                      </h4>

                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className="flex items-center space-x-3 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={optionIndex}
                              checked={
                                selectedAnswers[question.id] === optionIndex
                              }
                              onChange={() =>
                                handleTestAnswer(question.id, optionIndex)
                              }
                              className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>

                      {selectedAnswers[question.id] !== undefined && (
                        <div
                          className={`mt-3 p-3 rounded ${
                            selectedAnswers[question.id] ===
                            question.correctAnswer
                              ? "bg-green-50 border border-green-200"
                              : "bg-red-50 border border-red-200"
                          }`}
                        >
                          <p
                            className={`text-sm font-medium ${
                              selectedAnswers[question.id] ===
                              question.correctAnswer
                                ? "text-green-800"
                                : "text-red-800"
                            }`}
                          >
                            {selectedAnswers[question.id] ===
                            question.correctAnswer
                              ? "✅ Đáp án đúng!"
                              : `❌ Đáp án sai. Đáp án đúng là: ${question.options[question.correctAnswer]}`}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex justify-center">
                    <button
                      onClick={handleSubmitTest}
                      disabled={Object.keys(selectedAnswers).length === 0}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Nộp bài
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
