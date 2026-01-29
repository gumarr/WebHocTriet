"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Test,
  TestQuestion,
  TestAnswer,
} from "@/src/lib/types/test";
import { supabaseServices } from "@/src/lib/supabase/services";
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.testId as string;

  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test session state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadTest();
  }, [testId]);

  const loadTest = async () => {
    try {
      setLoading(true);
      setError(null);

      const testDetails = await supabaseServices.getTestById(testId);
      if (!testDetails) {
        setError("Bài kiểm tra không tồn tại");
        return;
      }

      setTest(testDetails);

      const testQuestions =
        await supabaseServices.getTestQuestionsByTestId(testId);
      setQuestions(testQuestions);

      // Initialize time remaining
      setTimeRemaining(testDetails.duration * 60); // Convert to seconds
    } catch (error) {
      console.error("Error loading test:", error);
      setError("Có lỗi xảy ra khi tải bài kiểm tra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTestStarted && timeRemaining > 0 && !isTestCompleted) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTestTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isTestStarted, timeRemaining, isTestCompleted]);

  const handleTestTimeout = () => {
    setIsTestCompleted(true);
    setShowResults(true);
  };

  const handleStartTest = () => {
    setIsTestStarted(true);
    // Initialize answers array
    const initialAnswers = questions.map(() => ({
      questionId: "",
      selectedAnswer: -1,
      isCorrect: false,
      explanation: "",
    }));
    setAnswers(initialAnswers);
  };

  const handleAnswerSelect = (
    questionIndex: number,
    selectedAnswer: number,
  ) => {
    // If answer is already selected, don't allow changing
    if (answers[questionIndex]?.selectedAnswer !== -1) {
      return;
    }

    const newAnswers = [...answers];
    newAnswers[questionIndex] = {
      ...newAnswers[questionIndex],
      questionId: questions[questionIndex].id,
      selectedAnswer,
      isCorrect: selectedAnswer === questions[questionIndex].correct_answer,
      explanation: questions[questionIndex].explanation,
    };
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitTest = () => {
    setIsTestCompleted(true);
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateScore = () => {
    const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    return { correctAnswers, totalQuestions, score };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lỗi</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/tests")}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Quay lại danh sách bài kiểm tra
          </button>
        </div>
      </div>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bài kiểm tra trống
          </h2>
          <p className="text-gray-600 mb-6">
            Bài kiểm tra này hiện chưa có câu hỏi nào.
          </p>
          <button
            onClick={() => router.push("/tests")}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Quay lại danh sách bài kiểm tra
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const { correctAnswers, totalQuestions, score } = calculateScore();
  const isPassed = score >= test.passing_score;

  if (!isTestStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">{test.title}</h1>
            <p className="text-gray-600 mt-2">{test.description}</p>
          </div>
        </div>

        {/* Test Info */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  {totalQuestions}
                </div>
                <div className="text-gray-600">Câu hỏi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {test.duration}
                </div>
                <div className="text-gray-600">Phút</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {test.passing_score}%
                </div>
                <div className="text-gray-600">Điểm đậu</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hướng dẫn làm bài
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Thời gian làm bài: {test.duration} phút</li>
                <li>Chọn đáp án đúng cho mỗi câu hỏi</li>
                <li>Bạn có thể quay lại các câu hỏi đã làm</li>
                <li>
                  Kết quả sẽ được hiển thị sau khi hoàn thành bài kiểm tra
                </li>
              </ul>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStartTest}
                className="px-8 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
              >
                Bắt đầu làm bài
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Kết quả bài kiểm tra
            </h1>
            <p className="text-gray-600 mt-2">{test.title}</p>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              {isPassed ? (
                <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
              ) : (
                <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              )}
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                {score}%
              </h2>
              <p className="text-gray-600 mb-2">
                {correctAnswers}/{totalQuestions} câu đúng
              </p>
              <p
                className={`text-lg font-semibold ${isPassed ? "text-emerald-600" : "text-red-600"}`}
              >
                {isPassed
                  ? "Chúc mừng! Bạn đã đậu bài kiểm tra"
                  : "Rất tiếc! Bạn chưa đạt yêu cầu"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {correctAnswers}
                </div>
                <div className="text-gray-600">Câu đúng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {totalQuestions - correctAnswers}
                </div>
                <div className="text-gray-600">Câu sai</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {test.passing_score}%
                </div>
                <div className="text-gray-600">Điểm đậu</div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push("/tests")}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Quay lại danh sách
              </button>
              <button
                onClick={() => {
                  // Reset all state to restart the test
                  setCurrentQuestionIndex(0);
                  setAnswers([]);
                  setTimeRemaining(test.duration * 60);
                  setIsTestStarted(false);
                  setIsTestCompleted(false);
                  setShowResults(false);
                }}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Làm lại bài kiểm tra
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {test.title}
              </h1>
              <p className="text-gray-600 text-sm">
                Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
                <span className="font-mono text-lg font-semibold text-gray-900">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <button
                onClick={handleSubmitTest}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Câu {currentQuestionIndex + 1}: {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentAnswer?.selectedAnswer === index;
              const isCorrect = index === currentQuestion.correct_answer;
              const isWrongSelection = isSelected && !isCorrect;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestionIndex, index)}
                  disabled={currentAnswer?.selectedAnswer !== -1}
                  className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                    isSelected
                      ? isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } ${
                    currentAnswer?.selectedAnswer !== -1 && isCorrect
                      ? "border-green-500 bg-green-50"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? isCorrect
                            ? "border-green-500 bg-green-500"
                            : "border-red-500 bg-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-gray-900 ${isSelected ? (isCorrect ? "font-semibold" : "font-semibold") : ""}`}>
                      {option}
                    </span>
                    {isSelected && (
                      <div className="ml-auto">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {currentAnswer?.selectedAnswer !== -1 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Giải thích:</h3>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Câu trước
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Câu sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
