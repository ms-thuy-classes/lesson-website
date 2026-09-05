import React from 'react';
import { BookOpenCheck, Bookmark, CheckCircle2, ArrowRight } from 'lucide-react';
import { GrammarTheory } from '../types';

interface GrammarViewProps {
  grammar: GrammarTheory;
}

// Helper to render lines with bullets, arrows, markdown tables, and phrase formatting
const FormattedGrammarText: React.FC<{ text: string; isExample?: boolean }> = ({ text, isExample = false }) => {
  if (!text) return null;

  // Check if text contains a markdown table
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const tableLineIndices: number[] = [];
  lines.forEach((line, idx) => {
    if (line.startsWith('|') && line.endsWith('|')) {
      tableLineIndices.push(idx);
    }
  });

  // If there are consecutive table lines with a separator
  if (tableLineIndices.length >= 2) {
    const isConsecutive = tableLineIndices.every((val, i) => i === 0 || val === tableLineIndices[i - 1] + 1);
    if (isConsecutive) {
      const tableLines = lines.slice(tableLineIndices[0], tableLineIndices[tableLineIndices.length - 1] + 1);
      const nonTableBefore = lines.slice(0, tableLineIndices[0]);
      const nonTableAfter = lines.slice(tableLineIndices[tableLineIndices.length - 1] + 1);

      // Parse table
      const headerLine = tableLines[0];
      const headers = headerLine
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);
      
      const bodyLines = tableLines.slice(1).filter((l) => !l.includes('---'));
      const rows = bodyLines.map((row) =>
        row
          .split('|')
          .map((s) => s.trim())
          .filter(Boolean)
      );

      return (
        <div className="space-y-3">
          {nonTableBefore.length > 0 && (
            <FormattedGrammarText text={nonTableBefore.join('\n')} isExample={isExample} />
          )}

          <div className="overflow-x-auto my-3 rounded-xl border border-purple-200/90 shadow-2xs bg-white">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-purple-100/90 text-purple-950 font-bold border-b border-purple-200">
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} className="px-3.5 py-2.5 font-bold tracking-tight">
                      {h.replace(/\*\*/g, '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/70">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-purple-50/40 hover:bg-purple-50/70 transition-colors'}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3.5 py-2.5 align-top text-slate-800 leading-relaxed">
                        {cell.split(/<br\s*\/?>/gi).map((part, pIdx) => {
                          const cleanPart = part.trim();
                          const isBold = cleanPart.startsWith('**') && cleanPart.endsWith('**');
                          const content = cleanPart.replace(/\*\*/g, '');

                          return (
                            <div key={pIdx} className={pIdx > 0 ? 'mt-1' : ''}>
                              {isBold ? (
                                <span className="font-bold text-purple-950">{content}</span>
                              ) : (
                                <span>{content}</span>
                              )}
                            </div>
                          );
                        })}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {nonTableAfter.length > 0 && (
            <FormattedGrammarText text={nonTableAfter.join('\n')} isExample={isExample} />
          )}
        </div>
      );
    }
  }

  // If it's a simple single line without bullets or arrows, show compact style
  const hasBulletsOrArrows = lines.some((l) => /^[-•*]/.test(l) || /^(->|→|🡪|=>)/.test(l) || l.includes('->') || l.includes('→') || l.includes('🡪'));

  if (lines.length === 1 && !hasBulletsOrArrows && isExample) {
    return (
      <div className="pl-6 text-xs sm:text-sm text-purple-800 font-normal">
        <span className="font-semibold text-purple-950 not-italic mr-1.5">Ví dụ:</span>
        <span className="italic">"{lines[0]}"</span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 mt-1.5">
      {lines.map((line, idx) => {
        // Check if line is an arrow / transformation (e.g. 🡪 Tom came home... or -> ...)
        const isArrowLine = /^(->|→|🡪|=>)/.test(line);
        if (isArrowLine) {
          const arrowContent = line.replace(/^(->|→|🡪|=>)\s*/, '').trim();
          return (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-50/90 border border-indigo-200/80 text-indigo-950 text-xs sm:text-sm shadow-2xs my-1"
            >
              <ArrowRight className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold leading-relaxed">{arrowContent}</div>
            </div>
          );
        }

        // Check if line is a note in parentheses like (Tom về nhà...) or (Eg: ...)
        if (line.startsWith('(') && line.endsWith(')')) {
          return (
            <div key={idx} className="pl-6 text-xs sm:text-sm text-slate-500 italic py-0.5">
              {line}
            </div>
          );
        }

        // Check if line starts with a bullet point (•, -, *)
        const isBullet = /^[-•*]\s*/.test(line);
        const cleanLine = isBullet ? line.replace(/^[-•*]\s*/, '').trim() : line;

        // Check if line has a key phrase with colon, e.g. "adjust to sth ~ adapt to: thích nghi..."
        const colonIdx = cleanLine.indexOf(':');
        let phrasePart = '';
        let meaningPart = cleanLine;

        if (colonIdx > 0 && colonIdx < 50 && !cleanLine.startsWith('http')) {
          phrasePart = cleanLine.slice(0, colonIdx).trim();
          meaningPart = cleanLine.slice(colonIdx + 1).trim();
        }

        return (
          <div key={idx} className="flex items-start gap-2.5 py-1 text-xs sm:text-sm leading-relaxed">
            {isBullet ? (
              <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0 shadow-xs" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
            )}
            <div className="flex-1 text-slate-700">
              {phrasePart ? (
                <>
                  <span className="font-semibold text-purple-950 bg-purple-100/70 border border-purple-200/60 px-1.5 py-0.5 rounded-md font-mono text-xs sm:text-sm inline-block mr-1.5 shadow-2xs">
                    {phrasePart}:
                  </span>
                  <span>{meaningPart}</span>
                </>
              ) : (
                <span>{cleanLine}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

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
      <div className="space-y-8">
        {grammar.sections.map((sec, idx) => {
          // If section has layout='two-columns' or 2 or 4+ points, display as responsive 2-column grid
          const isMultiColumn =
            sec.layout === 'two-columns' ||
            Boolean(sec.points && (sec.points.length >= 4 || sec.points.length === 2));

          return (
            <div
              key={idx}
              id={`grammar-block-${idx}`}
              className="glass-panel rounded-2xl p-5 sm:p-7 border border-white/80 shadow-sm"
            >
              {/* Section Heading */}
              <div className="flex items-center gap-2.5 mb-4">
                <Bookmark className="w-5 h-5 text-purple-600 shrink-0" />
                <h4 className="text-base sm:text-lg font-bold text-slate-800">
                  {sec.heading}
                </h4>
              </div>

              {/* Formula / Primary Content */}
              {sec.content && (
                <div
                  className={`p-4 sm:p-5 rounded-xl mb-5 font-medium text-xs sm:text-sm leading-relaxed ${
                    sec.highlight
                      ? 'bg-gradient-to-r from-purple-50/90 via-pink-50/70 to-cyan-50/60 border-l-4 border-purple-500 text-purple-950 font-semibold shadow-xs'
                      : 'bg-slate-50/80 text-slate-700 border border-slate-200/60'
                  }`}
                >
                  <FormattedGrammarText text={sec.content} />
                </div>
              )}

              {/* Usage Points - 2 columns for 4+ items, 1 column for fewer items */}
              {sec.points && sec.points.length > 0 && (
                <div
                  className={
                    isMultiColumn
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                      : 'space-y-4'
                  }
                >
                  {sec.points.map((pt, pIdx) => (
                    <div
                      key={pIdx}
                      className={`p-4 rounded-xl transition-all flex flex-col justify-between ${
                        pt.highlight
                          ? 'bg-purple-50/60 border-l-4 border-purple-400 pl-4.5 shadow-2xs'
                          : 'bg-white/80 border border-slate-200/80 pl-4.5 shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Point Rule / Title */}
                        <div className="flex items-start gap-2 mb-2 pb-1.5 border-b border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <p className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
                            {pt.rule}
                          </p>
                        </div>

                        {/* Point Content / Example / List of Verbs */}
                        {pt.example && (
                          <FormattedGrammarText text={pt.example} isExample={true} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
