import { getChapters } from '@/lib/utils/data';
import { Chapter } from '@/lib/types/chapter';
import Image from 'next/image';
import Link from 'next/link';

export default async function StoryPage() {
  const chapters = await getChapters();
  
  // Add image URLs for each chapter
  const chaptersWithImages = chapters.map((chapter, index) => ({
    ...chapter,
    imageUrl: getChapterImageUrl(index)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Header */}
      <header className="relative py-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Hành Trình Triết Học
        </h1>
        <p className="text-xl text-purple-200">
          Khám phá triết học Mác - Lênin qua từng chương như một câu chuyện
        </p>
      </header>

      {/* Story Container */}
      <div className="relative">
        {/* Story Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-pink-500 to-purple-600 opacity-50"></div>
        
        {/* Chapters */}
        <div className="relative max-w-4xl mx-auto px-4 space-y-16">
          {chaptersWithImages.map((chapter, index) => (
            <div
              key={chapter.id}
              className={`flex items-center space-x-8 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Story Node */}
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
              </div>

              {/* Content Card */}
              <div className={`flex-1 ${
                index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'
              }`}>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  {/* Chapter Image */}
                  <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={chapter.imageUrl || '/images/chapter-placeholder.jpg'}
                      alt={chapter.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="bg-yellow-400/80 text-black px-3 py-1 rounded-full text-sm font-semibold">
                        Chương {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Chapter Info */}
                  <h2 className="text-2xl font-bold text-white mb-3">
                    {chapter.title}
                  </h2>
                  <p className="text-purple-200 mb-6 leading-relaxed">
                    {chapter.description}
                  </p>

                  {/* Lessons Count */}
                  <div className="flex items-center justify-between">
                    <span className="text-pink-300 font-medium">
                      {chapter.lessons.length} bài học
                    </span>
                    <Link
                      href={`/lesson/${chapter.lessons[0]?.id || ''}`}
                      className="bg-gradient-to-r from-yellow-400 to-pink-500 text-black px-6 py-2 rounded-full font-semibold hover:from-yellow-300 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Khám Phá Ngay
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Swipe Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-white/60 mb-4">Vuốt để tiếp tục câu chuyện</div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-blue-400/20 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

    </div>
  );
}

// Function to get chapter-specific image URLs
function getChapterImageUrl(index: number): string {
  const images = [
    '/images/chapter-1-philosophy.jpg', // Khái luận về triết học
    '/images/chapter-2-dialectics.jpg', // Chủ nghĩa duy vật biện chứng
    '/images/chapter-3-history.jpg',    // Chủ nghĩa duy vật lịch sử
  ];
  return images[index] || '/images/chapter-placeholder.jpg';
}
