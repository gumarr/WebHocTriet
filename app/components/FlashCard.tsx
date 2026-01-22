'use client';

import { useState } from 'react';

interface Card {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const flashCards: Card[] = [
  {
    id: 1,
    question: 'Triết học là gì?',
    answer: 'Triết học là môn khoa học nghiên cứu những vấn đề cơ bản và phổ quát nhất về thế giới quan, nhận thức luận, và phương pháp luận.',
    category: 'Giới thiệu',
  },
  {
    id: 2,
    question: 'Ai là "cha đẻ của triết học phương Tây"?',
    answer: 'Socrates được coi là "cha đẻ của triết học phương Tây" với phương pháp hỏi đáp biện chứng nổi tiếng.',
    category: 'Triết học Cổ đại',
  },
  {
    id: 3,
    question: 'Thuyết "Lý tưởng" (Theory of Forms) là của ai?',
    answer: 'Thuyết "Lý tưởng" là của Plato, cho rằng thế giới hiện thực chỉ là bóng của thế giới lý tưởng hoàn hảo.',
    category: 'Triết học Cổ đại',
  },
  {
    id: 4,
    question: 'Câu nói nổi tiếng "Cogito, ergo sum" có nghĩa là gì?',
    answer: '"Tôi suy nghĩ, vậy tôi tồn tại" - của Descartes, nền tảng của chủ nghĩa duy lý.',
    category: 'Triết học Cận đại',
  },
  {
    id: 5,
    question: 'Ba câu hỏi cốt lõi của Kant là gì?',
    answer: '1) Tôi có thể biết gì? 2) Tôi nên làm gì? 3) Tôi có thể hy vọng điều gì?',
    category: 'Triết học Cận đại',
  },
  {
    id: 6,
    question: 'Tứ diệu đế trong Phật giáo là gì?',
    answer: 'Khổ đế (sự thật về đau khổ), Tập đế (nguyên nhân của khổ), Diệt đế (chấm dứt khổ), Đạo đế (con đường giải thoát).',
    category: 'Triết học Phương Đông',
  },
  {
    id: 7,
    question: 'Ngũ Luân trong Nho giáo là gì?',
    answer: 'Quan hệ giữa: Vua - Tôi, Cha - Con, Vợ - Chồng, Anh - Em, Bạn - Bè.',
    category: 'Triết học Phương Đông',
  },
  {
    id: 8,
    question: 'Thuyết Vô vi trong Đạo giáo nghĩa là gì?',
    answer: 'Vô vi là không cưỡng ép, không tác động trái với tự nhiên, để mọi việc diễn ra theo quy luật tự nhiên.',
    category: 'Triết học Phương Đông',
  },
  {
    id: 9,
    question: 'Mệnh đề logic "Modus Ponens" là gì?',
    answer: 'Nếu P thì Q. P đúng. Vậy Q đúng. Ví dụ: Nếu trời mưa thì đường ướt. Trời mưa. Vậy đường ướt.',
    category: 'Logic học',
  },
  {
    id: 10,
    question: 'Thuyết Công lợi (Utilitarianism) là gì?',
    answer: 'Hành động đúng đắn là hành động tạo ra hạnh phúc lớn nhất cho số người nhiều nhất.',
    category: 'Đạo đức học',
  },
];

interface FlashCardProps {
  onClose: () => void;
}

export default function FlashCard({ onClose }: FlashCardProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashCards[currentCardIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashCards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + flashCards.length) % flashCards.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all"
        >
          ×
        </button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-indigo-900 mb-2">🃏 Flash Cards</h2>
          <p className="text-gray-600">
            Thẻ {currentCardIndex + 1} / {flashCards.length} - {currentCard.category}
          </p>
        </div>

        <div
          onClick={handleFlip}
          className="relative h-80 mb-6 cursor-pointer perspective-1000"
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of card */}
            <div
              className={`absolute w-full h-full backface-hidden bg-linear-to-br from-indigo-100 to-purple-100 rounded-xl p-8 flex flex-col items-center justify-center border-4 border-indigo-300 ${
                isFlipped ? 'invisible' : 'visible'
              }`}
            >
              <div className="text-6xl mb-4">❓</div>
              <p className="text-2xl font-semibold text-center text-indigo-900">
                {currentCard.question}
              </p>
              <p className="text-sm text-gray-500 mt-4">Nhấn để lật thẻ</p>
            </div>

            {/* Back of card */}
            <div
              className={`absolute w-full h-full backface-hidden bg-linear-to-br from-green-100 to-blue-100 rounded-xl p-8 flex flex-col items-center justify-center border-4 border-green-300 ${
                isFlipped ? 'visible' : 'invisible'
              }`}
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div className="text-6xl mb-4">✅</div>
              <p className="text-xl text-center text-gray-800 leading-relaxed">
                {currentCard.answer}
              </p>
              <p className="text-sm text-gray-500 mt-4">Nhấn để quay lại</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handlePrevious}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105"
          >
            ← Thẻ trước
          </button>
          <button
            onClick={handleFlip}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105"
          >
            🔄 Lật thẻ
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105"
          >
            Thẻ sau →
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {flashCards.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentCardIndex ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
