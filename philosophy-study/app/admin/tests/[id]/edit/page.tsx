"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/src/lib/context/AuthContext";
import { supabaseServices, supabase } from "@/src/lib/supabase/services";
import { Lesson } from "@/src/lib/types/lesson";
import { Test, TestQuestion } from "@/src/lib/types/test";

export default function EditTestPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [testData, setTestData] = useState({
    title: "",
    description: "",
    duration: 30,
    passingScore: 70,
    totalQuestions: 0,
  });

  // Questions state
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [originalQuestions, setOriginalQuestions] = useState<TestQuestion[]>(
    [],
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [questionsPerPage] = useState(1); // Show 1 question per page

  // Lesson selection state
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [testLessons, setTestLessons] = useState<string[]>([]);

  const testId = params.id as string;

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        // Load all lessons
        const lessons = await supabaseServices.getLessons();
        setAllLessons(lessons);

        // Load test data
        const test = await supabaseServices.getTestByIdWithLessons(testId);
        if (!test) {
          setError("Bài test không tồn tại");
          return;
        }

        setTestData({
          title: test.title,
          description: test.description,
          duration: test.duration,
          passingScore: test.passing_score,
          totalQuestions: test.total_questions,
        });

        // Load test questions
        const testQuestions =
          await supabaseServices.getTestQuestionsByTestId(testId);
        setQuestions(testQuestions);
        setOriginalQuestions(testQuestions);

        // Load test lessons
        const lessonIds = await supabaseServices.getTestLessons(testId);
        setSelectedLessons(lessonIds);
        setTestLessons(lessonIds);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Lỗi khi tải thông tin bài test");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [testId, isAdmin, router]);

  const handleQuestionChange = (
    index: number,
    field: string,
    value: string | number | string[],
  ) => {
    const newQuestions = [...questions];
    if (field === "options") {
      newQuestions[index].options = value as string[];
    } else {
      newQuestions[index] = { ...newQuestions[index], [field]: value };
    }
    setQuestions(newQuestions);
    setTestData((prev) => ({ ...prev, totalQuestions: newQuestions.length }));
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        question: "",
        options: ["", "", "", ""],
        correct_answer: 0,
        explanation: "",
        difficulty: "medium",
        category: "General",
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
      setTestData((prev) => ({ ...prev, totalQuestions: newQuestions.length }));
    }
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string,
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedLessons.length === 0) {
      setError("Vui lòng chọn ít nhất một bài học");
      return;
    }

    try {
      // Update test
      await supabaseServices.updateTest(testId, {
        title: testData.title,
        description: testData.description,
        duration: testData.duration,
        passing_score: testData.passingScore,
        total_questions: questions.length,
      });

      // Update test_lessons relationship
      await supabaseServices.createTestLessons(testId, selectedLessons);

      // Handle questions: delete old ones and create new ones
      // First, delete all existing questions for this test
      const { error: deleteError } = await supabase
        .from("test_questions")
        .delete()
        .eq("test_id", testId);

      if (deleteError) throw deleteError;

      // Create new questions
      const questionsData = questions.map((q) => ({
        id: q.id,
        test_id: testId,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        category: q.category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      await supabaseServices.createTestQuestions(questionsData);

      router.push(`/admin/tests`);
    } catch (error) {
      console.error("Error updating test:", error);
      setError("Lỗi khi cập nhật bài test");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Sửa Bài Test</h1>
              <p className="text-gray-600 mt-1">Bài test: {testData.title}</p>
            </div>
            <button
              onClick={() => router.push("/admin/tests")}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Info Form */}
          <div className="lg:col-span-1 bg-linear-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200">
            <div className="philosophy-card p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Thông tin Bài Test
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    value={testData.title}
                    onChange={(e) =>
                      setTestData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={testData.description}
                    onChange={(e) =>
                      setTestData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn Bài Học
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {allLessons.map((lessonItem) => (
                      <label
                        key={lessonItem.id}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLessons.includes(lessonItem.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLessons([
                                ...selectedLessons,
                                lessonItem.id,
                              ]);
                            } else {
                              setSelectedLessons(
                                selectedLessons.filter(
                                  (id) => id !== lessonItem.id,
                                ),
                              );
                            }
                          }}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">
                          {lessonItem.title}
                        </span>
                      </label>
                    ))}
                  </div>
                  {selectedLessons.length === 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      Vui lòng chọn ít nhất một bài học
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian (phút)
                    </label>
                    <input
                      type="number"
                      value={testData.duration}
                      onChange={(e) =>
                        setTestData((prev) => ({
                          ...prev,
                          duration: parseInt(e.target.value),
                        }))
                      }
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Điểm đạt (%)
                    </label>
                    <input
                      type="number"
                      value={testData.passingScore}
                      onChange={(e) =>
                        setTestData((prev) => ({
                          ...prev,
                          passingScore: parseInt(e.target.value),
                        }))
                      }
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">
                    Tổng số câu: {questions.length}
                  </span>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Cập nhật Bài Test
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Questions Form */}
          <div className="lg:col-span-2 bg-linear-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200">
            <div className="philosophy-card p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Câu hỏi</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={addQuestion}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    + Thêm câu hỏi
                  </button>
                </div>
              </div>

              {/* Question Index Sidebar */}
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-3">
                  <div className="bg-gray-50 rounded-lg p-4 sticky top-24 max-h-[60vh] overflow-y-auto">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Danh sách câu hỏi
                    </h4>
                    <div className="space-y-2">
                      {questions.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            currentPage === index
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          Câu hỏi {index + 1}
                          {questions[index]?.question?.trim() && (
                            <span className="block text-xs text-gray-500 mt-1 truncate">
                              {questions[index].question}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-9">
                  {/* Current Question */}
                  <div className="border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Câu hỏi {currentPage + 1} / {questions.length}
                      </h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(0, currentPage - 1))
                          }
                          disabled={currentPage === 0}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Trước
                        </button>
                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(questions.length - 1, currentPage + 1),
                            )
                          }
                          disabled={currentPage === questions.length - 1}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Sau
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {questions[currentPage] && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nội dung câu hỏi
                            </label>
                            <textarea
                              value={questions[currentPage].question}
                              onChange={(e) =>
                                handleQuestionChange(
                                  currentPage,
                                  "question",
                                  e.target.value,
                                )
                              }
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Các lựa chọn
                            </label>
                            <div className="space-y-2">
                              {questions[currentPage].options.map(
                                (option, oIndex) => (
                                  <div
                                    key={oIndex}
                                    className="flex items-center space-x-3"
                                  >
                                    <input
                                      type="radio"
                                      name={`correct-answer-${currentPage}`}
                                      checked={
                                        questions[currentPage]
                                          .correct_answer === oIndex
                                      }
                                      onChange={() =>
                                        handleQuestionChange(
                                          currentPage,
                                          "correct_answer",
                                          oIndex,
                                        )
                                      }
                                      className="text-purple-600 focus:ring-purple-500"
                                    />
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          currentPage,
                                          oIndex,
                                          e.target.value,
                                        )
                                      }
                                      placeholder={`Lựa chọn ${oIndex + 1}`}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                                      required
                                    />
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Độ khó
                              </label>
                              <select
                                value={questions[currentPage].difficulty}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    currentPage,
                                    "difficulty",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                              >
                                <option value="easy">Dễ</option>
                                <option value="medium">Trung bình</option>
                                <option value="hard">Khó</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục
                              </label>
                              <input
                                type="text"
                                value={questions[currentPage].category}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    currentPage,
                                    "category",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Giải thích
                            </label>
                            <textarea
                              value={questions[currentPage].explanation}
                              onChange={(e) =>
                                handleQuestionChange(
                                  currentPage,
                                  "explanation",
                                  e.target.value,
                                )
                              }
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Question Actions */}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Tổng số câu: {questions.length}
                    </div>
                    {questions.length > 1 && (
                      <button
                        onClick={() => {
                          removeQuestion(currentPage);
                          setCurrentPage(Math.max(0, currentPage - 1));
                        }}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Xóa câu hỏi hiện tại
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
