/**
 * Learn with Ms. Thúy - English Learning Platform
 * @license Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SearchBar } from './components/SearchBar';
import { LessonCard } from './components/LessonCard';
import { Pagination } from './components/Pagination';
import { LessonDetail } from './components/LessonDetail';
import { ArticleItem, LessonData, StudentScoreSummary } from './types';
import { fetchArticles, fetchLessonById } from './data/lessonService';
import tagsData from '../public/data/tags.json';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [lessons, setLessons] = useState<ArticleItem[]>([]);
  const [tags, setTags] = useState<string[]>(tagsData.tags || []);
  const [selectedTag, setSelectedTag] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeLessonData, setActiveLessonData] = useState<LessonData | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState<boolean>(false);

  // Lesson scores stored in localStorage: record of lessonId -> { correct: number, total: number }
  const [lessonScores, setLessonScores] = useState<Record<string, { correct: number; total: number }>>(() => {
    try {
      const saved = localStorage.getItem('ms_thuy_lesson_scores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Load articles overview on mount
  useEffect(() => {
    async function loadData() {
      const data = await fetchArticles();
      setLessons(data.lessons);
      if (data.lessonsPerPage) {
        setItemsPerPage(data.lessonsPerPage);
      }
    }
    loadData();

    // Check URL hash for direct unit navigation (e.g., #unit-1-life-stories)
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      handleSelectLesson(hash);
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash) {
        handleSelectLesson(newHash);
      } else {
        setActiveLessonId(null);
        setActiveLessonData(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save lesson scores to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ms_thuy_lesson_scores', JSON.stringify(lessonScores));
    } catch (e) {
      console.warn('Failed to persist scores to localStorage:', e);
    }
  }, [lessonScores]);

  // Handle lesson selection
  const handleSelectLesson = async (lessonId: string) => {
    setIsLoadingLesson(true);
    setActiveLessonId(lessonId);
    window.location.hash = lessonId;

    const data = await fetchLessonById(lessonId);
    setActiveLessonData(data);
    setIsLoadingLesson(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate back to home
  const handleNavigateHome = () => {
    setActiveLessonId(null);
    setActiveLessonData(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update score from LessonDetail
  const handleUpdateTotalScore = (lessonId: string, correct: number, total: number) => {
    setLessonScores((prev) => ({
      ...prev,
      [lessonId]: { correct, total },
    }));
  };

  // Calculate global score summary for Header
  const scoreSummary: StudentScoreSummary = useMemo(() => {
    const scores: { correct: number; total: number }[] = Object.values(lessonScores);
    const correctAnswers = scores.reduce((sum, item) => sum + item.correct, 0);
    const totalQuestions = scores.reduce((sum, item) => sum + item.total, 0);

    // Default baseline if no questions answered yet: 0 / total available
    const totalPossibleQuestions = lessons.reduce((sum, l) => sum + (l.totalQuestions || 8), 0);
    const effectiveTotal = totalQuestions > 0 ? totalQuestions : (totalPossibleQuestions || 60);

    const scoreOutOfTen = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 10 : 0;
    const progressPercent = effectiveTotal > 0 ? (correctAnswers / effectiveTotal) * 100 : 0;

    return {
      correctAnswers,
      totalQuestions: totalQuestions > 0 ? totalQuestions : 0,
      scoreOutOfTen,
      progressPercent,
    };
  }, [lessonScores, lessons]);

  // Filter lessons based on Search query & selected class tag
  const filteredLessons = useMemo(() => {
    let result = lessons;

    // Filter by tag
    if (selectedTag && selectedTag !== 'Tất cả') {
      result = result.filter((l) => l.tags.includes(selectedTag));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [lessons, selectedTag, searchQuery]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag, searchQuery]);

  // Paginated lessons (max 10 per page)
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const paginatedLessons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLessons.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLessons, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#c084fc]/30 selection:text-slate-900 relative">
      {/* Vibrant Palette Ambient Orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-[#c084fc] opacity-10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 -z-10" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#22d3ee] opacity-10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2 -z-10" />

      {/* Sticky Header */}
      <Header
        scoreSummary={scoreSummary}
        onNavigateHome={handleNavigateHome}
        currentLessonTitle={activeLessonData ? activeLessonData.title : null}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {isLoadingLesson ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-[#c084fc]/30 border-t-[#c084fc] animate-spin" />
            <p className="text-sm font-semibold text-slate-600">
              Đang tải nội dung bài học cùng cô Thúy...
            </p>
          </div>
        ) : activeLessonData ? (
          /* Detailed Lesson View */
          <LessonDetail
            lesson={activeLessonData}
            onBack={handleNavigateHome}
            onUpdateTotalScore={handleUpdateTotalScore}
          />
        ) : (
          /* Home Page View */
          <div id="home-view" className="animate-in fade-in duration-300">
            {/* Hero Section */}
            <Hero />

            {/* Search Bar & Class Tags */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
              tags={tags}
            />

            {/* Lesson Cards Section */}
            <section id="lessons-grid-section" className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                    Danh sách bài học
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Hiển thị {filteredLessons.length} bài học theo tiêu chí tìm kiếm
                  </p>
                </div>

                {selectedTag !== 'Tất cả' && (
                  <button
                    onClick={() => setSelectedTag('Tất cả')}
                    className="text-xs text-[#c084fc] hover:text-[#a855f7] font-semibold transition-colors"
                  >
                    Xem tất cả lớp
                  </button>
                )}
              </div>

              {paginatedLessons.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center max-w-lg mx-auto shadow-lg shadow-purple-100/30 border border-white">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#c084fc] flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-1">
                    Không tìm thấy bài học phù hợp
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mb-4">
                    Thử tìm kiếm với từ khóa khác hoặc chọn xem lại tất cả các lớp.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTag('Tất cả');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#c084fc] to-[#22d3ee] text-white font-semibold text-xs shadow-sm hover:brightness-105 transition-all"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                <>
                  {/* Card Grid: 1 col on mobile (<640px), 2 cols on tablet (640-1024px), 3-4 cols on desktop (>1024px) */}
                  <div
                    id="lessons-card-grid"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6"
                  >
                    {paginatedLessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        onSelectLesson={handleSelectLesson}
                      />
                    ))}
                  </div>

                  {/* Pagination: max 10 per page */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                  />
                </>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-14 border-t border-white/40 bg-white/40 backdrop-blur-xs flex items-center justify-between px-6 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#c084fc] via-[#f472b6] to-[#22d3ee]">
              Learn with Ms. Thúy
            </span>
            <span className="text-[11px] text-slate-400">• Hệ thống học tiếng Anh trực tuyến hiện đại</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium tracking-wide">
            <span>Thiết kế Vibrant Palette</span>
            <Sparkles className="w-3.5 h-3.5 text-[#c084fc]" />
            <span>&amp; Tự động chấm điểm</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
