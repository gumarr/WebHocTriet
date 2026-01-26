"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/lib/context/AppContext";

export default function Navigation() {
  const router = useRouter();
  const { userProgress } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: "Hành trình triết học",
      href: "/story",
      description: "Khám phá triết học qua câu chuyện",
    },
    {
      name: "Hệ thống kiến thức",
      href: "/knowledge-map",
      description: "Tổng quan toàn bộ chương trình triết học",
    },
    {
      name: "Bài học",
      href: "/lessons",
      description: "Chi tiết các bài học theo chương",
    },
    {
      name: "Thống kê",
      href: "/stats",
      description: "Theo dõi tiến độ học tập",
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  const getProgressPercentage = () => {
    const totalLessons = 10; // Số lượng bài học thực tế sẽ được tính động
    const completed = userProgress.completedLessons.length;
    return Math.round((completed / totalLessons) * 100);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">TL</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">
                  Triết Học Mác - Lênin
                </h1>
                <p className="text-xs text-gray-600">Hệ thống ôn tập</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">
                Tiến độ học tập
              </div>
              <div className="text-xs text-gray-500">
                {getProgressPercentage()}% hoàn thành
              </div>
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {navigationItems.map((item) => (
              <div key={item.href} className="philosophy-card p-4">
                <button
                  onClick={() => handleNavigation(item.href)}
                  className="w-full text-left"
                >
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </div>
                </button>
              </div>
            ))}

            {/* Mobile Progress */}
            <div className="philosophy-card p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">Tiến độ</span>
                <span className="text-sm text-gray-600">
                  {getProgressPercentage()}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
