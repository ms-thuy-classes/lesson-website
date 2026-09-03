import React from 'react';
import { Sparkles, BookOpen, Volume2, CheckCircle } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="hero-section" className="relative py-8 md:py-12 px-4 text-center overflow-hidden">
      {/* Decorative Vibrant Ambient Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-[#c084fc] opacity-15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#22d3ee] opacity-15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-80 h-48 bg-[#f472b6] opacity-15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-purple-200/60 shadow-xs text-xs font-semibold text-[#c084fc] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" />
          <span>Hệ thống luyện thi & học tập tiếng Anh trực tuyến</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#c084fc] via-[#f472b6] to-[#22d3ee]">
            Learn with Ms. Thúy
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mb-6">
          Học từ vựng phát âm chuẩn IPA, nắm vững ngữ pháp trọng tâm và rèn luyện 4 dạng bài tập tương tác với hệ thống chấm điểm tự động.
        </p>

        {/* Feature Highlights Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200/70 shadow-xs">
            <Volume2 className="w-4 h-4 text-[#f472b6]" />
            <span>Phát âm chuẩn Web Speech</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200/70 shadow-xs">
            <BookOpen className="w-4 h-4 text-[#c084fc]" />
            <span>Lý thuyết chuyên sâu</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200/70 shadow-xs">
            <CheckCircle className="w-4 h-4 text-[#22d3ee]" />
            <span>Chấm bài tự động tức thì</span>
          </div>
        </div>
      </div>
    </section>
  );
};
