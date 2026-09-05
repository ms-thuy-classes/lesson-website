import React, { useState, useEffect, useMemo } from 'react';
import {
  Bookmark,
  X,
  Sparkles,
  BookOpen,
  BookOpenCheck,
  CheckSquare,
  PenTool,
  ArrowDownUp,
  Edit3,
  Award,
  ChevronRight,
  Layers,
  Link2,
} from 'lucide-react';
import { LessonData } from '../types';

interface LessonBookmarkProps {
  lesson: LessonData;
}

export const LessonBookmark: React.FC<LessonBookmarkProps> = ({ lesson }) => {
  // Mặc định hiển thị mỗi khi vào lesson lần đầu
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeSectionId, setActiveSectionId] = useState<string>('lesson-banner');

  // Reset to open whenever lesson changes
  useEffect(() => {
    setIsOpen(true);
  }, [lesson.id]);

  // Dynamically compute bookmark sections based on what actual content exists in the lesson
  const sections = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      icon: React.ComponentType<{ className?: string }>;
      tag: string;
    }> = [
      {
        id: 'lesson-banner',
        title: 'Tổng quan bài học',
        icon: Sparkles,
        tag: 'Bắt đầu',
      },
    ];

    if (lesson.theory?.vocabulary && lesson.theory.vocabulary.length > 0) {
      list.push({
        id: 'vocabulary-section',
        title: 'A. Từ vựng trọng tâm',
        icon: BookOpen,
        tag: `${lesson.theory.vocabulary.length} từ`,
      });
    }

    if (lesson.theory?.grammar) {
      list.push({
        id: 'grammar-section',
        title: 'B. Ngữ pháp trọng điểm',
        icon: BookOpenCheck,
        tag: 'Lý thuyết',
      });
    }

    // Dynamic numbering for exercises
    let exerciseIndex = 1;

    if (lesson.exercises?.mcq?.questions && lesson.exercises.mcq.questions.length > 0) {
      list.push({
        id: 'exercise-mcq-container',
        title: `${exerciseIndex++}. Trắc nghiệm (MCQ)`,
        icon: CheckSquare,
        tag: `${lesson.exercises.mcq.questions.length} câu`,
      });
    }

    if (lesson.exercises?.matching?.columnA && lesson.exercises.matching.columnA.length > 0) {
      list.push({
        id: 'exercise-matching-container',
        title: `${exerciseIndex++}. Nối từ (Matching)`,
        icon: Link2,
        tag: `${lesson.exercises.matching.columnA.length} cặp`,
      });
    }

    if (lesson.exercises?.collocationTable?.items && lesson.exercises.collocationTable.items.length > 0) {
      list.push({
        id: 'exercise-collocation-table-container',
        title: `${exerciseIndex++}. Phân loại từ`,
        icon: Layers,
        tag: `${lesson.exercises.collocationTable.items.length} cụm`,
      });
    }

    if (lesson.exercises?.fillBlank?.questions && lesson.exercises.fillBlank.questions.length > 0) {
      list.push({
        id: 'exercise-fillblank-container',
        title: `${exerciseIndex++}. Điền từ khuyết`,
        icon: PenTool,
        tag: `${lesson.exercises.fillBlank.questions.length} câu`,
      });
    }

    if (lesson.exercises?.arrange?.questions && lesson.exercises.arrange.questions.length > 0) {
      list.push({
        id: 'exercise-arrange-container',
        title: `${exerciseIndex++}. Sắp xếp câu`,
        icon: ArrowDownUp,
        tag: `${lesson.exercises.arrange.questions.length} câu`,
      });
    }

    if (lesson.exercises?.rewrite?.questions && lesson.exercises.rewrite.questions.length > 0) {
      list.push({
        id: 'exercise-rewrite-container',
        title: `${exerciseIndex++}. Viết lại câu`,
        icon: Edit3,
        tag: `${lesson.exercises.rewrite.questions.length} câu`,
      });
    }

    list.push({
      id: 'lesson-completion-card',
      title: 'Tổng kết & Điểm số',
      icon: Award,
      tag: 'Kết quả',
    });

    return list;
  }, [lesson]);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop - 120;
          if (scrollY >= top) {
            setActiveSectionId(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleNavigate = (targetId: string) => {
    setActiveSectionId(targetId);
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -85;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Highlight target element briefly with flash effect
      element.classList.add('ring-2', 'ring-purple-400', 'transition-all', 'duration-500');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-purple-400');
      }, 1500);
    }
  };

  return (
    <>
      {/* Closed State: Floating Bookmark Button */}
      {!isOpen && (
        <button
          id="bookmark-toggle-open-btn"
          onClick={() => setIsOpen(true)}
          title="Mở mục lục bài học"
          aria-label="Mở mục lục bài học"
          className="fixed right-3 sm:right-5 top-24 z-40 backdrop-blur-md bg-white/85 hover:bg-white border border-purple-200/90 shadow-lg shadow-purple-900/10 text-purple-700 px-3 py-2 rounded-2xl flex items-center gap-2 group hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg gradient-pastel-bg flex items-center justify-center text-white shadow-xs">
            <Bookmark className="w-3.5 h-3.5 fill-white/80" />
          </div>
          <span className="text-xs font-bold text-slate-700 group-hover:text-purple-700 tracking-tight hidden sm:inline">
            Mục lục
          </span>
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        </button>
      )}

      {/* Open State: Translucent Glass Bookmark Menu */}
      {isOpen && (
        <div
          id="lesson-bookmark-panel"
          className="fixed right-3 sm:right-5 top-20 sm:top-24 z-40 w-[240px] sm:w-[260px] backdrop-blur-md bg-white/80 hover:bg-white/90 border border-white/90 shadow-xl shadow-purple-900/10 rounded-2xl p-3 sm:p-3.5 transition-all duration-300 animate-in fade-in slide-in-from-right-2"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md gradient-pastel-bg flex items-center justify-center text-white shadow-2xs">
                <Bookmark className="w-3 h-3 fill-white/80" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                Mục lục bài học
              </span>
            </div>
            <button
              id="bookmark-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng mục lục bài học"
              title="Đóng (bấm biểu tượng để mở lại)"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-0.5 custom-scrollbar">
            {sections.map((item) => {
              const Icon = item.icon;
              const isActive = activeSectionId === item.id;

              return (
                <button
                  key={item.id}
                  id={`bookmark-item-${item.id}`}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-purple-100/90 text-purple-950 font-bold shadow-2xs border-l-3 border-purple-600 pl-2'
                      : 'text-slate-600 font-medium hover:bg-purple-50/80 hover:text-purple-900 hover:translate-x-1 hover:font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isActive
                          ? 'text-purple-600'
                          : 'text-slate-400 group-hover:text-purple-500'
                      }`}
                    />
                    <span className="truncate">{item.title}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
                        isActive
                          ? 'bg-purple-200/80 text-purple-900'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-purple-100 group-hover:text-purple-700'
                      }`}
                    >
                      {item.tag}
                    </span>
                    <ChevronRight
                      className={`w-3 h-3 transition-transform ${
                        isActive
                          ? 'text-purple-600 translate-x-0.5'
                          : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 text-purple-400'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
};
