import React, { useState, useEffect } from 'react';
import { Check, User, Award, CheckCircle2, BookOpen, ChevronLeft } from 'lucide-react';
import { StudentScoreSummary } from '../types';

interface HeaderProps {
  scoreSummary: StudentScoreSummary;
  onNavigateHome?: () => void;
  currentLessonTitle?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  scoreSummary,
  onNavigateHome,
  currentLessonTitle,
}) => {
  const [studentName, setStudentName] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const savedName = localStorage.getItem('ms_thuy_student_name');
    if (savedName) {
      setStudentName(savedName);
      setIsSaved(true);
    }
  }, []);

  const handleSaveName = () => {
    const trimmed = studentName.trim();
    if (trimmed) {
      localStorage.setItem('ms_thuy_student_name', trimmed);
      setIsSaved(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveName();
    }
  };

  return (
    <header
      id="main-sticky-header"
      className="sticky top-0 z-50 h-20 bg-white/70 backdrop-blur-md border-b border-white/30 px-4 sm:px-8 flex items-center justify-between shadow-sm transition-all duration-300"
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-4">
          <button
            id="brand-home-button"
            onClick={onNavigateHome}
            className="flex items-center gap-3 text-left group transition-transform active:scale-95"
            title="Về trang chủ"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#c084fc] to-[#f472b6] flex items-center justify-center shadow-lg shadow-purple-200 text-white group-hover:rotate-6 transition-transform shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#c084fc] via-[#f472b6] to-[#22d3ee] tracking-tight block leading-tight">
                Learn with Ms. Thúy
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">
                {currentLessonTitle ? (
                  <span className="flex items-center gap-1 text-[#c084fc]">
                    <ChevronLeft className="w-3.5 h-3.5 inline" />
                    <span>{currentLessonTitle}</span>
                  </span>
                ) : (
                  'Học tiếng Anh chuẩn hiện đại'
                )}
              </span>
            </div>
          </button>
        </div>

        {/* Student Name Input & Progress Bar */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Student Name Input */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/50 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:inline">
              Học sinh:
            </span>
            <input
              id="student-name-input-desktop"
              type="text"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                setIsSaved(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tên..."
              className="bg-transparent border-none outline-none text-xs sm:text-sm font-medium w-24 sm:w-32 md:w-36 text-slate-700 placeholder-slate-400"
            />
            <button
              id="save-student-name-btn-desktop"
              onClick={handleSaveName}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isSaved
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-purple-100 text-[#c084fc] hover:bg-[#c084fc] hover:text-white'
              }`}
              title="Lưu tên"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-10 w-px bg-slate-200 hidden md:block"></div>

          {/* Progress and Score in Vibrant Palette style */}
          <div id="header-progress-block" className="flex flex-col gap-1 w-32 sm:w-44 md:w-48">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              <span>
                {scoreSummary.totalQuestions > 0
                  ? `TIẾN ĐỘ: ${scoreSummary.correctAnswers}/${scoreSummary.totalQuestions}`
                  : `TIẾN ĐỘ: ${Math.round(scoreSummary.progressPercent)}%`}
              </span>
              <span className="text-[#f472b6] font-black">
                {scoreSummary.scoreOutOfTen.toFixed(1)} ĐIỂM
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                id="header-progress-bar-fill"
                className="h-full bg-gradient-to-r from-[#c084fc] to-[#22d3ee] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, scoreSummary.progressPercent))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
