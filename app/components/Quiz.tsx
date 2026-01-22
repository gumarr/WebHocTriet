'use client';

import { useState } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: 'Ai là người đưa ra câu nói nổi tiếng "Tôi chỉ biết rằng tôi không biết gì"?',
    options: ['Plato', 'Socrates', 'Aristotle', 'Confucius'],
    correctAnswer: 1,
    explanation: 'Socrates nổi tiếng với phương pháp hỏi đáp và sự khiêm tốn trong tri thức.',
    category: 'Triết học Cổ đại',
  },
  {
    id: 2,
    question: 'Cuốn sách "Cộng hòa" (The Republic) được viết bởi ai?',
    options: ['Socrates', 'Aristotle', 'Plato', 'Epicurus'],
    correctAnswer: 2,
    explanation: 'Plato viết "Cộng hòa" để trình bày quan điểm về nhà nước lý tưởng và công lý.',
    category: 'Triết học Cổ đại',
  },
  {
    id: 3,
    question: 'Chủ nghĩa nào cho rằng tri thức đến từ kinh nghiệm?',
    options: ['Duy lý (Rationalism)', 'Kinh nghiệm (Empiricism)', 'Duy tâm (Idealism)', 'Duy vật (Materialism)'],
    correctAnswer: 1,
    explanation: 'Chủ nghĩa kinh nghiệm (Empiricism) được đại diện bởi Locke, Hume, cho rằng kiến thức đến từ kinh nghiệm.',
    category: 'Triết học Cận đại',
  },
  {
    id: 4,
    question: 'Triết gia nào nổi tiếng với khái niệm "Mệnh lệnh tuyệt đối" (Categorical Imperative)?',
    options: ['Hegel', 'Kant', 'Nietzsche', 'Hume'],
    correctAnswer: 1,
    explanation: 'Kant phát triển thuyết mệnh lệnh tuyệt đối như nền tảng của đạo đức học.',
    category: 'Triết học Cận đại',
  },
  {
    id: 5,
    question: 'Trong Nho giáo, đức tính quan trọng nhất là gì?',
    options: ['Dũng (Courage)', 'Nhân (Benevolence)', 'Trí (Wisdom)', 'Tín (Trust)'],
    correctAnswer: 1,
    explanation: 'Nhân (仁) - lòng nhân ái, yêu thương con người là đức tính cao nhất trong Nho giáo.',
    category: 'Triết học Phương Đông',
  },
  {
    id: 6,
    question: 'Đạo Đức Kinh là tác phẩm của ai?',
    options: ['Khổng Tử', 'Mạnh Tử', 'Lão Tử', 'Trang Tử'],
    correctAnswer: 2,
    explanation: 'Đạo Đức Kinh được cho là của Lão Tử, nền tảng của Đạo giáo.',
    category: 'Triết học Phương Đông',
  },
  {
    id: 7,
    question: 'Trong logic, phép suy luận "Nếu A thì B, A đúng, vậy B đúng" gọi là gì?',
    options: ['Modus Ponens', 'Modus Tollens', 'Disjunctive Syllogism', 'Hypothetical Syllogism'],
    correctAnswer: 0,
    explanation: 'Modus Ponens là quy tắc suy diễn cơ bản: nếu tiền đề và điều kiện đúng thì kết luận đúng.',
    category: 'Logic học',
  },
  {
    id: 8,
    question: 'Ai là người sáng lập chủ nghĩa Công lợi (Utilitarianism)?',
    options: ['Kant', 'Mill', 'Bentham', 'Rawls'],
    correctAnswer: 2,
    explanation: 'Jeremy Bentham là người sáng lập chủ nghĩa công lợi, sau đó được John Stuart Mill phát triển.',
    category: 'Đạo đức học',
  },
  {
    id: 9,
    question: 'Câu nói "Thần đã chết" là của triết gia nào?',
    options: ['Kant', 'Hegel', 'Nietzsche', 'Schopenhauer'],
    correctAnswer: 2,
    explanation: 'Nietzsche tuyên bố "Thần đã chết" để chỉ sự suy tàn của các giá trị tôn giáo truyền thống.',
    category: 'Triết học Đương đại',
  },
  {
    id: 10,
    question: 'Hiện tượng luận (Phenomenology) được phát triển bởi ai?',
    options: ['Heidegger', 'Husserl', 'Sartre', 'Merleau-Ponty'],
    correctAnswer: 1,
    explanation: 'Edmund Husserl là người sáng lập hiện tượng luận, nghiên cứu cấu trúc của kinh nghiệm ý thức.',
    category: 'Triết học Đương đại',
  },
];

interface QuizProps {
  onClose: () => void;
}

export default function Quiz({ onClose }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex: number) => {
    if (answeredQuestions.has(currentQuestionIndex)) return;

    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    const newAnsweredQuestions = new Set(answeredQuestions);
    newAnsweredQuestions.add(currentQuestionIndex);
    setAnsweredQuestions(newAnsweredQuestions);

    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions(new Set());
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const percentage = (score / quizQuestions.length) * 100;
    let message = '';
    let emoji = '';

    if (percentage >= 90) {
      message = 'Xuất sắc! Bạn là bậc thầy triết học!';
      emoji = '🏆';
    } else if (percentage >= 70) {
      message = 'Rất tốt! Bạn có kiến thức vững vàng!';
      emoji = '🌟';
    } else if (percentage >= 50) {
      message = 'Khá tốt! Tiếp tục học tập nhé!';
      emoji = '👍';
    } else {
      message = 'Cần cố gắng thêm! Hãy ôn tập lại nhé!';
      emoji = '📚';
    }

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all"
          >
            ×
          </button>

          <div className="text-center">
            <div className="text-8xl mb-4">{emoji}</div>
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">Hoàn thành!</h2>
            <p className="text-xl text-gray-700 mb-6">{message}</p>
            
            <div className="bg-linear-to-r from-indigo-100 to-purple-100 rounded-xl p-6 mb-6">
              <p className="text-5xl font-bold text-indigo-900 mb-2">
                {score}/{quizQuestions.length}
              </p>
              <p className="text-gray-600">Điểm số: {percentage.toFixed(0)}%</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105"
              >
                🔄 Làm lại
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all"
        >
          ×
        </button>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-indigo-900">📝 Trắc nghiệm</h2>
            <div className="bg-indigo-100 px-4 py-2 rounded-lg">
              <span className="font-semibold text-indigo-900">
                Điểm: {score}/{answeredQuestions.size}
              </span>
            </div>
          </div>
          <p className="text-gray-600">
            Câu {currentQuestionIndex + 1} / {quizQuestions.length} - {currentQuestion.category}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showResult = showExplanation;

              let bgColor = 'bg-gray-50 hover:bg-gray-100';
              let borderColor = 'border-gray-300';
              let textColor = 'text-gray-800';

              if (showResult) {
                if (isCorrect) {
                  bgColor = 'bg-green-100';
                  borderColor = 'border-green-500';
                  textColor = 'text-green-900';
                } else if (isSelected && !isCorrect) {
                  bgColor = 'bg-red-100';
                  borderColor = 'border-red-500';
                  textColor = 'text-red-900';
                }
              } else if (isSelected) {
                bgColor = 'bg-indigo-100';
                borderColor = 'border-indigo-500';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={answeredQuestions.has(currentQuestionIndex)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${bgColor} ${borderColor} ${textColor} ${
                    !answeredQuestions.has(currentQuestionIndex) ? 'hover:scale-102' : 'cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white font-semibold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showResult && isCorrect && <span className="text-2xl">✅</span>}
                    {showResult && isSelected && !isCorrect && <span className="text-2xl">❌</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {showExplanation && (
          <div className="mb-6 bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">💡 Giải thích:</p>
            <p className="text-blue-800">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {quizQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentQuestionIndex
                    ? 'bg-indigo-600'
                    : answeredQuestions.has(index)
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {showExplanation && (
            <button
              onClick={handleNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all hover:scale-105"
            >
              {currentQuestionIndex < quizQuestions.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả 🎯'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
