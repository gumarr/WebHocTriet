'use client';

import { useState } from 'react';

interface SubSection {
  id: string;
  title: string;
}

interface Chapter {
  id: string;
  title: string;
  icon: string;
  subsections: SubSection[];
}

const chapters: Chapter[] = [
  {
    id: 'chuong1',
    title: 'Chương 1: Khái luận về Triết học và Triết học Mác - Lênin',
    icon: '📚',
    subsections: [
      { id: 'c1-1', title: 'Triết học và vấn đề cơ bản của triết học' },
      { id: 'c1-2', title: 'Triết học Mác - Lênin và vai trò trong đời sống xã hội' },
    ],
  },
  {
    id: 'chuong2',
    title: 'Chương 2: Chủ nghĩa Duy vật biện chứng',
    icon: '🧠',
    subsections: [
      { id: 'c2-1', title: 'Vật chất và ý thức' },
      { id: 'c2-2', title: 'Phép biện chứng duy vật' },
      { id: 'c2-3', title: 'Lý luận nhận thức' },
    ],
  },
  {
    id: 'chuong3',
    title: 'Chương 3: Chủ nghĩa Duy vật lịch sử',
    icon: '⚖️',
    subsections: [
      { id: 'c3-1', title: 'Học thuyết hình thái kinh tế - xã hội' },
      { id: 'c3-2', title: 'Biện chứng giữa lực lượng sản xuất và quan hệ sản xuất' },
      { id: 'c3-3', title: 'Giai cấp và dân tộc' },
      { id: 'c3-4', title: 'Nhà nước và cách mạng xã hội' },
      { id: 'c3-5', title: 'Ý thức xã hội' },
      { id: 'c3-6', title: 'Triết học về con người' },
    ],
  },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(['chuong1']));

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  return (
    <div
      className={`bg-linear-to-b from-indigo-900 to-purple-900 text-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      } h-screen p-4 shadow-2xl overflow-y-auto sticky top-0`}
    >
      <div className="flex items-center justify-between mb-8">
        {!isCollapsed && (
          <h2 className="text-xl font-bold">Web Học Triết</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="space-y-3">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="space-y-1">
            <button
              onClick={() => {
                if (!isCollapsed) {
                  toggleChapter(chapter.id);
                }
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 bg-white/10 hover:bg-white/20"
            >
              <span className="text-xl">{chapter.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="font-semibold text-sm flex-1 text-left">
                    {chapter.title}
                  </span>
                  <span className="text-lg">
                    {expandedChapters.has(chapter.id) ? '▼' : '▶'}
                  </span>
                </>
              )}
            </button>

            {!isCollapsed && expandedChapters.has(chapter.id) && (
              <div className="ml-6 space-y-1 mt-1">
                {chapter.subsections.map((subsection) => (
                  <button
                    key={subsection.id}
                    onClick={() => onSectionChange(subsection.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                      activeSection === subsection.id
                        ? 'bg-white text-indigo-900 shadow-lg font-semibold'
                        : 'hover:bg-white/10 text-white/90'
                    }`}
                  >
                    • {subsection.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="text-xs text-white/60 space-y-2">
            <p>💡 Khám phá tri thức</p>
            <p>🎯 Học tập có hệ thống</p>
          </div>
        </div>
      )}
    </div>
  );
}
