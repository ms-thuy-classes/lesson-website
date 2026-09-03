import React from 'react';
import { BookOpen, ListChecks, ArrowRight, Layers } from 'lucide-react';
import { ArticleItem } from '../types';

interface LessonCardProps {
  lesson: ArticleItem;
  onSelectLesson: (id: string) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  onSelectLesson,
}) => {
  return (
    <div
      id={`lesson-card-${lesson.id}`}
      className="bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-200/50 border border-white flex flex-col justify-between group hover:shadow-xl hover:shadow-purple-100/60 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden cursor-pointer"
      onClick={() => onSelectLesson(lesson.id)}
    >
      <div>
        {/* Top Badges & Feature Icon */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-[#c084fc] group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>

          <div className="flex flex-wrap gap-1.5 items-center justify-end">
            {lesson.tags.map((tag, idx) => (
              <span
                key={tag}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  idx % 2 === 0
                    ? 'bg-purple-100 text-[#c084fc]'
                    : 'bg-cyan-100 text-[#0ea5e9]'
                }`}
              >
                {tag}
              </span>
            ))}
            <span className="bg-pink-100 text-[#f472b6] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
              {lesson.level}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#c084fc] transition-colors line-clamp-2 leading-snug">
          {lesson.title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
          {lesson.description}
        </p>
      </div>

      <div>
        {/* Statistics Pills */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500 font-medium mb-4">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#c084fc]" />
            <span>{lesson.vocabCount} từ vựng</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ListChecks className="w-4 h-4 text-[#f472b6]" />
            <span>{lesson.exerciseCount} dạng bài</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          id={`start-lesson-btn-${lesson.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectLesson(lesson.id);
          }}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#c084fc] to-[#22d3ee] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-purple-200 group-hover:shadow-md transition-all active:scale-98"
        >
          <span>Bắt đầu học</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
