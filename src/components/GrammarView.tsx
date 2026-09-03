import React from 'react';
import { BookOpenCheck, Bookmark, CheckCircle, Info } from 'lucide-react';
import { GrammarTheory } from '../types';

interface GrammarViewProps {
  grammar: GrammarTheory;
}

export const GrammarView: React.FC<GrammarViewProps> = ({ grammar }) => {
  return (
    <div id="grammar-section" className="mb-14">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-lg gradient-pastel-bg flex items-center justify-center text-white shadow-sm">
          <BookOpenCheck className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            B. Ngữ pháp trọng điểm (Grammar)
          </h3>
          <p className="text-sm font-semibold gradient-pastel-text">
            {grammar.title}
          </p>
        </div>
      </div>

      {/* Grammar Sections */}
      <div className="space-y-6">
        {grammar.sections.map((sec, idx) => (
          <div
            key={idx}
            id={`grammar-block-${idx}`}
            className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/80 shadow-sm"
          >
            {/* Section Heading */}
            <div className="flex items-center gap-2 mb-3">
              <Bookmark className="w-4 h-4 text-purple-500" />
              <h4 className="text-base sm:text-lg font-bold text-slate-800">
                {sec.heading}
              </h4>
            </div>

            {/* Formula / Primary Content */}
            {sec.content && (
              <div
                className={`p-3.5 sm:p-4 rounded-xl mb-4 font-medium text-xs sm:text-sm whitespace-pre-line leading-relaxed ${
                  sec.highlight
                    ? 'bg-gradient-to-r from-purple-50/90 via-pink-50/70 to-cyan-50/60 border-l-4 border-purple-500 text-purple-950 font-semibold shadow-xs'
                    : 'bg-slate-50/80 text-slate-700 border border-slate-200/60'
                }`}
              >
                {sec.content}
              </div>
            )}

            {/* Usage Points */}
            {sec.points && sec.points.length > 0 && (
              <div className="space-y-3">
                {sec.points.map((pt, pIdx) => (
                  <div
                    key={pIdx}
                    className={`p-3.5 rounded-xl transition-all ${
                      pt.highlight
                        ? 'bg-pink-50/60 border-l-4 border-pink-400 pl-4 shadow-2xs'
                        : 'bg-white/60 border border-slate-100 pl-4'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">
                        {pt.rule}
                      </p>
                    </div>
                    {pt.example && (
                      <div className="pl-6 text-xs sm:text-sm text-purple-700 italic font-normal">
                        Ví dụ: "{pt.example}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
