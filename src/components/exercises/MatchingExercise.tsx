import React, { useState } from 'react';
import {
  Link2,
  Check,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Eye,
  Award,
  HelpCircle,
} from 'lucide-react';
import { MatchingExercise as MatchingExerciseType } from '../../types';

interface MatchingExerciseProps {
  exercise: MatchingExerciseType;
  onScoreUpdate: (exerciseKey: string, correctCount: number, totalCount: number) => void;
}

export const MatchingExercise: React.FC<MatchingExerciseProps> = ({
  exercise,
  onScoreUpdate,
}) => {
  // Mapping of itemA.id -> selected columnB key (e.g. { 1: 'C', 2: 'A' })
  const [selectedMatches, setSelectedMatches] = useState<Record<number, string>>({});
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [showAnswerGuide, setShowAnswerGuide] = useState<boolean>(false);

  const { columnA, columnB } = exercise;

  const handleSelect = (itemId: number, matchKey: string) => {
    if (isChecked) return;
    setSelectedMatches((prev) => {
      const updated = { ...prev };
      if (matchKey === '') {
        delete updated[itemId];
      } else {
        updated[itemId] = matchKey;
      }
      return updated;
    });
  };

  const handleCheck = () => {
    setIsChecked(true);
    let correctCount = 0;
    columnA.forEach((item) => {
      if (selectedMatches[item.id] === item.correctMatch) {
        correctCount++;
      }
    });
    onScoreUpdate('matching', correctCount, columnA.length);
  };

  const handleReset = () => {
    setSelectedMatches({});
    setIsChecked(false);
    setShowAnswerGuide(false);
    onScoreUpdate('matching', 0, columnA.length);
  };

  // Helper to find which item in Column A currently selected a given Column B key
  const getPairedWithItemIds = (bKey: string): number[] => {
    const paired: number[] = [];
    Object.entries(selectedMatches).forEach(([idStr, key]) => {
      if (key === bKey) paired.push(Number(idStr));
    });
    return paired;
  };

  // Score statistics
  const answeredCount = Object.keys(selectedMatches).length;
  let correctCount = 0;
  if (isChecked) {
    columnA.forEach((item) => {
      if (selectedMatches[item.id] === item.correctMatch) {
        correctCount++;
      }
    });
  }
  const scoreOutOfTen = columnA.length > 0 ? (correctCount / columnA.length) * 10 : 0;

  return (
    <div
      id="exercise-matching-container"
      className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/80 shadow-md mb-8 relative scroll-mt-24"
    >
      {/* Exercise Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-purple-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-pastel-bg text-white flex items-center justify-center shadow-xs">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2.5 py-0.5 rounded-full">
                Dạng bài Matching
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {columnA.length} cặp từ
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">
              {exercise.title || 'Nối từ tương ứng (Matching Exercise)'}
            </h4>
          </div>
        </div>

        {/* Progress badge */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200">
          <span>Đã nối:</span>
          <span className="font-bold text-purple-700">
            {answeredCount}/{columnA.length}
          </span>
        </div>
      </div>

      {/* Guide / Instruction */}
      <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed bg-purple-50/60 p-3.5 rounded-xl border border-purple-100/80 flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
        <span>
          {exercise.description ||
            'Hướng dẫn: Hãy đọc các từ ở Cột A (đánh số từ 1 đến hết), sau đó chọn ký tự tương ứng ở Cột B (đánh chữ từ A đến hết) trong menu thả xuống đằng sau mỗi từ để hoàn thành cặp nghĩa phù hợp.'}
        </span>
      </p>

      {/* Two Column Layout: Column A and Column B */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ============================================================ */}
        {/* CỘT A: Từ cần nối (1, 2, 3...) kèm dropdown chọn A, B, C... */}
        {/* ============================================================ */}
        <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-4 pb-2.5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
                A
              </span>
              <h5 className="font-bold text-slate-800 text-sm sm:text-base">
                Cột A: Từ / Cụm từ cần nối
              </h5>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Đánh số 1 → {columnA.length}
            </span>
          </div>

          <div className="space-y-3">
            {columnA.map((item, index) => {
              const selectedKey = selectedMatches[item.id] || '';
              const isCorrect = isChecked && selectedKey === item.correctMatch;
              const isWrong = isChecked && selectedKey !== item.correctMatch;

              // Find matching text from column B for quick reference
              const matchedB = columnB.find((b) => b.key === selectedKey);

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl transition-all border ${
                    isChecked
                      ? isCorrect
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200'
                        : 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-200'
                      : selectedKey
                      ? 'bg-purple-50/50 border-purple-200 shadow-2xs'
                      : 'bg-white border-slate-200/80 hover:border-purple-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Left: Number + Word */}
                    <div className="flex items-center gap-2.5 min-w-[140px] flex-1">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <span className="font-bold text-sm sm:text-base text-slate-800">
                          {item.word}
                        </span>
                        {item.hint && (
                          <span className="ml-1.5 text-xs text-slate-500 italic">
                            ({item.hint})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Dropdown Selector for Column B Key */}
                    <div className="flex items-center gap-2 shrink-0">
                      <label htmlFor={`matching-select-${item.id}`} className="sr-only">
                        Chọn đáp án cho từ {item.word}
                      </label>
                      <select
                        id={`matching-select-${item.id}`}
                        disabled={isChecked}
                        value={selectedKey}
                        onChange={(e) => handleSelect(item.id, e.target.value)}
                        className={`text-xs sm:text-sm font-semibold rounded-xl px-3 py-1.5 border transition-all cursor-pointer outline-none focus:ring-2 focus:ring-purple-400 ${
                          isChecked
                            ? isCorrect
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                            : selectedKey
                            ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-purple-300'
                        }`}
                      >
                        <option value="">-- Chọn (A, B, C...) --</option>
                        {columnB.map((b) => (
                          <option key={b.key} value={b.key}>
                            {b.key} - {b.text.length > 28 ? b.text.slice(0, 28) + '...' : b.text}
                          </option>
                        ))}
                      </select>

                      {/* Status Icon when checked */}
                      {isChecked && (
                        <div className="shrink-0">
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected preview text if chosen */}
                  {!isChecked && matchedB && (
                    <div className="mt-2 text-xs text-purple-700 bg-white/70 px-2.5 py-1 rounded-lg border border-purple-100 flex items-center gap-1.5">
                      <span className="font-bold">→ {matchedB.key}:</span>
                      <span className="truncate">{matchedB.text}</span>
                    </div>
                  )}

                  {/* Feedback explanation when checked */}
                  {isChecked && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs">
                      {isCorrect ? (
                        <div className="text-emerald-700 font-medium flex items-start gap-1">
                          <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>Chính xác: <strong>{item.correctMatch}</strong></span>
                        </div>
                      ) : (
                        <div className="text-rose-700 font-medium flex items-start gap-1">
                          <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>
                            Chưa đúng. Đáp án đúng là:{' '}
                            <strong className="text-emerald-700 underline font-bold">
                              {item.correctMatch}
                            </strong>
                            {' ('}
                            {columnB.find((b) => b.key === item.correctMatch)?.text}
                            {')'}
                          </span>
                        </div>
                      )}

                      {/* Box giải thích chi tiết kèm Nghĩa Tiếng Việt */}
                      <div className="mt-2 p-2.5 rounded-lg bg-white/95 border border-slate-200/80 text-xs space-y-1.5 shadow-2xs">
                        {(item.vietnameseMeaning || columnB.find((b) => b.key === item.correctMatch)?.vietnameseMeaning) && (
                          <div className="text-purple-950 bg-purple-50/80 p-2 rounded-md border border-purple-100/90 text-xs space-y-1">
                            {item.vietnameseMeaning && (
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-bold text-purple-700 shrink-0">🇻🇳 Nghĩa tiếng Việt của từ:</span>
                                <span className="font-bold text-purple-900">{item.word}:</span>
                                <span className="font-semibold text-purple-800">{item.vietnameseMeaning}</span>
                              </div>
                            )}
                            {columnB.find((b) => b.key === item.correctMatch)?.vietnameseMeaning && (
                              <div className="flex items-baseline gap-1.5 text-slate-600 pt-0.5 border-t border-purple-100/60">
                                <span className="font-semibold text-slate-700 shrink-0">Dịch nghĩa định nghĩa ({item.correctMatch}):</span>
                                <span className="italic text-slate-700">{columnB.find((b) => b.key === item.correctMatch)?.vietnameseMeaning}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {item.explanation && (
                          <div className="text-slate-600 leading-relaxed text-xs pt-0.5">
                            <span className="font-bold text-slate-700">💡 Giải thích chi tiết: </span>
                            <span>{item.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* CỘT B: Từ / Định nghĩa để nối (A, B, C...) */}
        {/* ============================================================ */}
        <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-4 pb-2.5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
                B
              </span>
              <h5 className="font-bold text-slate-800 text-sm sm:text-base">
                Cột B: Định nghĩa / Từ ghép tương ứng
              </h5>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Đánh chữ A → {columnB[columnB.length - 1]?.key || '...'}
            </span>
          </div>

          <div className="space-y-3">
            {columnB.map((item) => {
              const pairedItemIds = getPairedWithItemIds(item.key);
              const isUsed = pairedItemIds.length > 0;

              return (
                <div
                  key={item.key}
                  className={`p-3.5 rounded-xl transition-all border ${
                    isUsed
                      ? 'bg-indigo-50/60 border-indigo-200 shadow-2xs'
                      : 'bg-white border-slate-200/80 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200">
                      {item.key}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {item.text}
                      </p>

                      {/* Indicator showing which items in Column A picked this */}
                      {isUsed && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-indigo-700">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-100/80 font-bold">
                            Đã nối với câu #{pairedItemIds.join(', #')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Answer Guide Accordion */}
      {showAnswerGuide && (
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-amber-800 text-sm mb-2">
            <Eye className="w-4 h-4" />
            <span>Đáp án mẫu (Answer Key kèm nghĩa tiếng Việt):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {columnA.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white p-2.5 rounded-lg border border-amber-200 flex items-center justify-between gap-2"
              >
                <div className="text-slate-700">
                  <span className="font-bold">#{idx + 1} {item.word}</span>
                  {item.vietnameseMeaning && (
                    <span className="text-purple-700 font-medium ml-1">({item.vietnameseMeaning})</span>
                  )}
                </div>
                <span className="font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md shrink-0">
                  → {item.correctMatch}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Controls & Score Result */}
      <div className="mt-6 pt-5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {!isChecked ? (
            <button
              id="matching-check-btn"
              onClick={handleCheck}
              disabled={answeredCount === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-pastel-bg text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Kiểm tra đáp án</span>
            </button>
          ) : (
            <button
              id="matching-reset-btn"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại từ đầu</span>
            </button>
          )}

          {isChecked && (
            <button
              id="matching-toggle-guide-btn"
              onClick={() => setShowAnswerGuide((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>{showAnswerGuide ? 'Ẩn đáp án' : 'Xem đáp án mẫu'}</span>
            </button>
          )}
        </div>

        {/* Score display when checked */}
        {isChecked && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 animate-in fade-in">
            <div className="w-8 h-8 rounded-lg gradient-pastel-bg text-white flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-purple-700 font-medium">Kết quả phần Nối từ:</div>
              <div className="text-sm font-extrabold text-slate-800">
                {correctCount} / {columnA.length} câu đúng{' '}
                <span className="text-purple-600">({scoreOutOfTen.toFixed(1)} điểm)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
