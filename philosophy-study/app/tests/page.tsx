"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Test } from "@/src/lib/types/test";
import { supabaseServices } from "@/src/lib/supabase/services";
import { Search, Filter, SortAsc, SortDesc, Clock, Users } from "lucide-react";

export default function TestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "duration" | "created_at">(
    "title",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(6);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const allTests = await supabaseServices.getAllTests();
      setTests(allTests);
    } catch (error) {
      console.error("Error loading tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedTests = tests
    .filter((test) => {
      // Search filter
      const matchesSearch =
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Duration filter
      const matchesDuration =
        durationFilter === "all" ||
        (durationFilter === "short" && test.duration <= 10) ||
        (durationFilter === "medium" &&
          test.duration > 10 &&
          test.duration <= 30) ||
        (durationFilter === "long" && test.duration > 30);

      return matchesSearch && matchesDuration;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "duration":
          comparison = a.duration - b.duration;
          break;
        case "created_at":
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Pagination logic
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = filteredAndSortedTests.slice(
    indexOfFirstTest,
    indexOfLastTest,
  );
  const totalPages = Math.ceil(filteredAndSortedTests.length / testsPerPage);

  const getDurationLabel = (duration: number) => {
    if (duration <= 10) return "Ngắn (< 10 phút)";
    if (duration <= 30) return "Trung bình (10-30 phút)";
    return "Dài (> 30 phút)";
  };

  const handleTestClick = (testId: string) => {
    router.push(`/tests/${testId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
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
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bài Kiểm Tra</h1>
              <p className="text-gray-600 mt-1">Chọn bài kiểm tra để bắt đầu</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">
                {tests.length}
              </div>
              <div className="text-sm text-gray-500">Tổng số bài kiểm tra</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài kiểm tra..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-gray-800"
                />
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-gray-800"
              >
                <option value="all">Tất cả thời lượng</option>
                <option value="short">Ngắn (&lt; 10 phút)</option>
                <option value="medium">Trung bình (10-30 phút)</option>
                <option value="long">Dài (&gt; 30 phút)</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "title" | "duration" | "created_at",
                  )
                }
                className="flex-1 px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-gray-800"
              >
                <option value="title">Sắp xếp theo tên</option>
                <option value="duration">Sắp xếp theo thời lượng</option>
                <option value="created_at">Sắp xếp theo ngày tạo</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-4 py-3 border-2 border-gray-400 rounded-lg hover:bg-gray-50 hover:border-emerald-500 transition-colors font-medium text-gray-800"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-5 w-5 text-gray-800" />
                ) : (
                  <SortDesc className="h-5 w-5 text-gray-800" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid gap-6">
          {currentTests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Filter className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy bài kiểm tra
              </h3>
              <p className="text-gray-600">
                Hãy thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
              </p>
            </div>
          ) : (
            currentTests.map((test) => (
              <div
                key={test.id}
                onClick={() => handleTestClick(test.id)}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-emerald-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                        {test.title}
                      </h3>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium">
                        {test.total_questions} câu hỏi
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {test.description}
                    </p>

                    {/* Related Lessons */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Bài học liên quan:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {test.related_lessons &&
                        test.related_lessons.length > 0 ? (
                          test.related_lessons.map(
                            (lesson: { id: string; title: string }, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium cursor-pointer hover:bg-blue-200 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/lesson/${lesson.id}`);
                                }}
                              >
                                {lesson.title}
                              </span>
                            ),
                          )
                        ) : (
                          <span className="text-gray-500 text-sm">
                            Chưa có bài học liên quan
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{test.duration} phút</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{getDurationLabel(test.duration)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 font-medium">
                          Điểm đậu: {test.passing_score}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center">
                    <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                      Bắt đầu
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Trước
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-gray-300 hover:bg-gray-50 hover:border-emerald-500"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Sau
            </button>
          </div>
        )}

        {/* Results Info */}
        <div className="text-center text-gray-600 mt-4">
          Hiển thị {indexOfFirstTest + 1} -{" "}
          {Math.min(indexOfLastTest, filteredAndSortedTests.length)} trên tổng
          số {filteredAndSortedTests.length} bài kiểm tra
        </div>
      </div>
    </div>
  );
}
