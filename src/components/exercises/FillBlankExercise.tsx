import React, { useState } from 'react';
import { Check, RotateCcw, HelpCircle, CheckCircle2, XCircle, X } from 'lucide-react';
import { FillBlankQuestion } from '../../types';
import { isAnswerCorrect } from '../../utils/stringComparison';

interface FillBlankExerciseProps {
  title: string;
  wordbank?: string[];
  questions: FillBlankQuestion[];
  onScoreUpdate: (exerciseKey: string, correctCount: number, totalCount: number) => void;
}

export const FillBlankExercise: React.FC<FillBlankExerciseProps> = ({
  title,
  wordbank,
  questions,
  onScoreUpdate,
}) => {
  const [userInputs, setUserInputs] = useState<Record<number, string>>({});
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);

  const handleInputChange = (questionId: number, val: string) => {
    if (isChecked) return;
    setUserInputs((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  };

  const handleWordBankClick = (word: string) => {
    if (isChecked) return;
    // Fill into active question or first empty question
    let targetId = activeQuestionId;
    if (targetId === null) {
      const firstEmpty = questions.find((q) => !userInputs[q.id]?.trim());
      targetId = firstEmpty ? firstEmpty.id : questions[0].id;
    }

    // If the target question already has this exact word, toggle it off / clear it
    if (userInputs[targetId]?.trim().toLowerCase() === word.trim().toLowerCase()) {
      setUserInputs((prev) => {
        const next = { ...prev };
        delete next[targetId!];
        return next;
      });
      return;
    }

    setUserInputs((prev) => ({
      ...prev,
      [targetId!]: word,
    }));
  };

  // Helper to determine if a word in the word bank is currently in use
  const isWordBankItemUsed = (word: string, indexInBank: number): boolean => {
    if (!word) return false;
    const targetNorm = word.trim().toLowerCase();
    const targetNoHyphen = targetNorm.replace(/-/g, ' ');

    // How many times this word appeared before indexInBank
    const occurrencesBefore = wordbank
      ? wordbank.slice(0, indexInBank).filter((w) => {
          const wNorm = w.trim().toLowerCase();
          return wNorm === targetNorm || wNorm.replace(/-/g, ' ') === targetNoHyphen;
        }).length
      : 0;

    // How many user inputs currently match this word
    const matchCount = (Object.values(userInputs) as (string | undefined)[]).filter((val) => {
      if (!val || typeof val !== 'string') return false;
      const userNorm = val.trim().toLowerCase();
      return userNorm === targetNorm || userNorm.replace(/-/g, ' ') === targetNoHyphen;
    }).length;

    return matchCount > occurrencesBefore;
  };

  const handleCheck = () => {
    setIsChecked(true);
    let correct = 0;
    questions.forEach((q) => {
      const input = userInputs[q.id] || '';
      if (isAnswerCorrect(input, q.answer, q.acceptAlternatives)) {
        correct++;
      }
    });
    onScoreUpdate('fillBlank', correct, questions.length);
  };

  const handleReset = () => {
    setUserInputs({});
    setIsChecked(false);
    setActiveQuestionId(null);
    onScoreUpdate('fillBlank', 0, questions.length);
  };

  const usedCount = wordbank
    ? wordbank.filter((w, idx) => isWordBankItemUsed(w, idx)).length
    : 0;

  return (
    <div id="exercise-fillblank-container" className="glass-panel rounded-2xl p-5 sm:p-7 border border-white/80 shadow-sm mb-10">
      {/* Exercise Header */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-800">
              {title}
            </h4>
            <p className="text-xs text-slate-500">
              Điền từ thích hợp vào chỗ trống để hoàn thành câu
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          {questions.length} câu
        </span>
      </div>

      {/* Word Bank if provided */}
      {wordbank && wordbank.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-purple-50/70 border border-purple-100">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
              Ngân hàng từ gợi ý (Word Bank):
            </span>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-100/90 px-2.5 py-0.5 rounded-full">
              Đã chọn: {usedCount}/{wordbank.length} từ
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {wordbank.map((word, idx) => {
              const isUsed = isWordBankItemUsed(word, idx);

              return (
                <button
                  key={idx}
                  id={`wordbank-item-${idx}`}
                  onClick={() => handleWordBankClick(word)}
                  disabled={isChecked}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isUsed
                      ? 'bg-slate-100/90 text-slate-400 border border-dashed border-slate-300 opacity-65 hover:opacity-100 hover:bg-slate-200/60 hover:text-slate-600 shadow-none'
                      : 'bg-white text-purple-700 border border-purple-200/80 shadow-xs hover:bg-purple-600 hover:text-white hover:border-purple-600 hover:scale-105 active:scale-95'
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                  title={
                    isUsed
                      ? `Từ "${word}" đã được điền (nhấp để đổi ô hoặc xóa khỏi ô để khôi phục)`
                      : `Nhấp để điền nhanh "${word}"`
                  }
                >
                  <span className={isUsed ? 'line-through decoration-slate-400 decoration-1.5' : ''}>
                    {word}
                  </span>
                  {isUsed && (
                    <span className="text-[10px] font-bold text-slate-400 no-underline inline-block">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6 mb-8">
        {questions.map((q, idx) => {
          const userVal = userInputs[q.id] || '';
          const isCorrect = isAnswerCorrect(userVal, q.answer, q.acceptAlternatives);

          // Split question around '______' or '___'
          const rawText = q.question || q.sentence || '';
          const parts = rawText.includes('___') ? rawText.split(/_{3,}/) : [rawText, ''];

          return (
            <div
              key={q.id}
              id={`fillblank-question-${q.id}`}
              className="p-4 sm:p-5 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs"
            >
              <div className="flex items-start gap-2.5 mb-3">
                <span className="font-bold text-pink-600 text-sm shrink-0 mt-1">
                  Câu {idx + 1}:
                </span>
                <div className="text-sm sm:text-base font-medium text-slate-800 leading-loose flex flex-wrap items-center gap-1.5 w-full">
                  <span>{parts[0]}</span>
                  <div className="inline-flex items-center relative my-0.5">
                    <input
                      id={`fillblank-input-${q.id}`}
                      type="text"
                      value={userVal}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                      onFocus={() => setActiveQuestionId(q.id)}
                      disabled={isChecked}
                      placeholder="..."
                      className={`px-3 py-1 text-sm font-semibold rounded-lg border focus:outline-none transition-all w-36 sm:w-48 text-center ${
                        !isChecked && userVal ? 'pr-7' : ''
                      } ${
                        isChecked
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300/40'
                            : 'bg-rose-50 border-rose-400 text-rose-800'
                          : activeQuestionId === q.id
                          ? 'bg-white border-purple-500 text-purple-900 ring-2 ring-purple-300/50'
                          : 'bg-white border-slate-300 text-purple-900 focus:ring-2 focus:ring-purple-400 focus:border-transparent'
                      }`}
                    />
                    {!isChecked && userVal && (
                      <button
                        type="button"
                        id={`fillblank-clear-${q.id}`}
                        onClick={() => handleInputChange(q.id, '')}
                        className="absolute right-1.5 p-0.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Xóa từ khỏi ô này (khôi phục lại từ trong ngân hàng từ)"
                        aria-label="Xóa từ khỏi ô"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <span>{parts[1] || ''}</span>
                </div>
              </div>

              {/* Feedback after check */}
              {isChecked && (
                <div
                  className={`mt-2.5 p-3 rounded-xl text-xs sm:text-sm space-y-2 ${
                    isCorrect
                      ? 'bg-emerald-50/90 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50/90 text-rose-900 border border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                    <span>
                      {isCorrect ? (
                        <strong className="text-emerald-800">Đúng chính xác!</strong>
                      ) : (
                        <span>
                          Chưa đúng. Đáp án chuẩn:{' '}
                          <strong className="underline font-bold text-slate-900">{q.answer}</strong>
                          {q.acceptAlternatives && q.acceptAlternatives.length > 0 && (
                            <span className="text-slate-600 ml-1 font-medium">
                              (Chấp nhận thêm: {q.acceptAlternatives.join(', ')})
                            </span>
                          )}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Vietnamese meaning / hint / explanation */}
                  {(q.hint || q.explanation || q.translationVi) && (
                    <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-700 space-y-1">
                      {q.hint && (
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-purple-700 shrink-0">🇻🇳 Nghĩa / Gợi ý:</span>
                          <span className="text-purple-900 font-medium">{q.hint}</span>
                        </div>
                      )}
                      {q.explanation && (
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-slate-700 shrink-0">💡 Giải thích:</span>
                          <span className="text-slate-600">{q.explanation}</span>
                        </div>
                      )}
                      {q.translationVi && (
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-indigo-700 shrink-0">📖 Dịch câu:</span>
                          <span className="italic text-indigo-900">{q.translationVi}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Check & Reset Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          id="fillblank-reset-btn"
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Làm lại</span>
        </button>

        <button
          id="fillblank-check-btn"
          onClick={handleCheck}
          disabled={isChecked || Object.values(userInputs).filter(Boolean).length === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            isChecked || Object.values(userInputs).filter(Boolean).length === 0
              ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-400'
              : 'gradient-pastel-bg text-white shadow-md shadow-purple-200 hover:brightness-105 active:scale-98'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>Kiểm tra đáp án</span>
        </button>
      </div>
    </div>
  );
};
