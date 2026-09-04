import React, { useState, useEffect } from 'react';
import { Check, RotateCcw, CheckCircle2, XCircle, ArrowUpDown, X, Shuffle } from 'lucide-react';
import { ArrangeQuestion } from '../../types';
import { isAnswerCorrect } from '../../utils/stringComparison';
import { getMaximallyScrambledIndices } from '../../utils/scrambleUtils';

interface ArrangeExerciseProps {
  title: string;
  questions: ArrangeQuestion[];
  onScoreUpdate: (exerciseKey: string, correctCount: number, totalCount: number) => void;
}

export const ArrangeExercise: React.FC<ArrangeExerciseProps> = ({
  title,
  questions,
  onScoreUpdate,
}) => {
  // State: questionId -> array of word indices selected
  const [arrangedWords, setArrangedWords] = useState<Record<number, number[]>>({});
  const [isChecked, setIsChecked] = useState<boolean>(false);

  // State: questionId -> array of word indices in maximally scrambled order
  const [scrambledPools, setScrambledPools] = useState<Record<number, number[]>>(() => {
    const initial: Record<number, number[]> = {};
    questions.forEach((q) => {
      initial[q.id] = getMaximallyScrambledIndices(q.words, q.answer, q.correctOrder);
    });
    return initial;
  });

  // Re-generate scrambled pools when questions prop changes
  useEffect(() => {
    const initial: Record<number, number[]> = {};
    questions.forEach((q) => {
      initial[q.id] = getMaximallyScrambledIndices(q.words, q.answer, q.correctOrder);
    });
    setScrambledPools(initial);
    setArrangedWords({});
    setIsChecked(false);
  }, [questions]);

  const handleWordClick = (questionId: number, wordIdx: number) => {
    if (isChecked) return;
    const current = arrangedWords[questionId] || [];
    if (current.includes(wordIdx)) {
      // Remove word
      setArrangedWords((prev) => ({
        ...prev,
        [questionId]: current.filter((idx) => idx !== wordIdx),
      }));
    } else {
      // Add word
      setArrangedWords((prev) => ({
        ...prev,
        [questionId]: [...current, wordIdx],
      }));
    }
  };

  const handleClearSentence = (questionId: number) => {
    if (isChecked) return;
    setArrangedWords((prev) => ({
      ...prev,
      [questionId]: [],
    }));
  };

  const handleReshuffleQuestion = (questionId: number) => {
    if (isChecked) return;
    const q = questions.find((item) => item.id === questionId);
    if (!q) return;
    // Clear already selected words for this question
    setArrangedWords((prev) => ({
      ...prev,
      [questionId]: [],
    }));
    // Re-scramble pool
    setScrambledPools((prev) => ({
      ...prev,
      [questionId]: getMaximallyScrambledIndices(q.words, q.answer, q.correctOrder),
    }));
  };

  const handleCheck = () => {
    setIsChecked(true);
    let correct = 0;
    questions.forEach((q) => {
      const selectedIndices = arrangedWords[q.id] || [];
      const userSentence = selectedIndices.map((i) => q.words[i]).join(' ');
      if (isAnswerCorrect(userSentence, q.answer, q.acceptAlternatives)) {
        correct++;
      }
    });
    onScoreUpdate('arrange', correct, questions.length);
  };

  const handleReset = () => {
    setArrangedWords({});
    setIsChecked(false);
    // Provide a fresh scramble variation when student resets exercise
    const newPools: Record<number, number[]> = {};
    questions.forEach((q) => {
      newPools[q.id] = getMaximallyScrambledIndices(q.words, q.answer, q.correctOrder);
    });
    setScrambledPools(newPools);
    onScoreUpdate('arrange', 0, questions.length);
  };

  return (
    <div id="exercise-arrange-container" className="glass-panel rounded-2xl p-5 sm:p-7 border border-white/80 shadow-sm mb-10">
      {/* Exercise Header */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-800">
              {title}
            </h4>
            <p className="text-xs text-slate-500">
              Nhấp vào các từ để sắp xếp chúng thành một câu hoàn chỉnh và chính xác
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          {questions.length} câu
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-8 mb-8">
        {questions.map((q, qIdx) => {
          const selectedIndices = arrangedWords[q.id] || [];
          const userSentence = selectedIndices.map((i) => q.words[i]).join(' ');
          const isCorrect = isAnswerCorrect(userSentence, q.answer, q.acceptAlternatives);
          const poolOrder = scrambledPools[q.id] || q.words.map((_, i) => i);

          return (
            <div
              key={q.id}
              id={`arrange-question-${q.id}`}
              className="p-4 sm:p-5 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-bold text-cyan-700 text-sm">
                  Câu {qIdx + 1}:
                </span>
                {!isChecked && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleReshuffleQuestion(q.id)}
                      title="Xáo trộn lại thứ tự từ trong kho"
                      className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-800 transition-colors cursor-pointer"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>Xáo trộn lại</span>
                    </button>
                    {selectedIndices.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleClearSentence(q.id)}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Làm lại câu này</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Constructed Sentence Box */}
              <div
                className={`min-h-[56px] p-3 rounded-xl border flex flex-wrap items-center gap-2 mb-4 transition-all ${
                  isChecked
                    ? isCorrect
                      ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-300/30'
                      : 'bg-rose-50/80 border-rose-300'
                    : 'bg-slate-50/90 border-slate-200'
                }`}
              >
                {selectedIndices.length === 0 ? (
                  <span className="text-xs sm:text-sm text-slate-400 italic">
                    (Nhấp các từ bên dưới theo đúng thứ tự để tạo câu...)
                  </span>
                ) : (
                  selectedIndices.map((wordIdx, posIdx) => (
                    <button
                      key={posIdx}
                      id={`arranged-chip-${q.id}-${posIdx}`}
                      onClick={() => handleWordClick(q.id, wordIdx)}
                      disabled={isChecked}
                      className="px-3 py-1.5 rounded-lg bg-white text-purple-800 font-semibold text-xs sm:text-sm border border-purple-200 shadow-xs hover:border-rose-400 hover:text-rose-600 transition-all flex items-center gap-1 group cursor-pointer disabled:cursor-default"
                      title="Nhấp để gỡ từ ra"
                    >
                      <span>{q.words[wordIdx]}</span>
                      {!isChecked && (
                        <X className="w-3 h-3 text-slate-300 group-hover:text-rose-500" />
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Maximally Scrambled Word Pool */}
              <div className="flex flex-wrap gap-2 pt-2.5 border-t border-slate-100">
                <div className="w-full flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Kho từ (đã đảo lộn thứ tự):
                  </span>
                </div>
                {poolOrder.map((wIdx) => {
                  const word = q.words[wIdx];
                  const isUsed = selectedIndices.includes(wIdx);
                  return (
                    <button
                      key={wIdx}
                      id={`pool-word-${q.id}-${wIdx}`}
                      onClick={() => handleWordClick(q.id, wIdx)}
                      disabled={isChecked || isUsed}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                        isUsed
                          ? 'opacity-30 bg-slate-100 text-slate-400 border border-dashed border-slate-300 cursor-not-allowed'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-cyan-400 hover:text-cyan-700 hover:bg-cyan-50/40 shadow-2xs active:scale-95 cursor-pointer'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              {/* Feedback after check */}
              {isChecked && (
                <div
                  className={`mt-4 p-3 rounded-lg text-xs sm:text-sm flex items-start gap-2 ${
                    isCorrect
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold">
                      {isCorrect ? 'Tuyệt vời, câu hoàn toàn chính xác!' : 'Chưa chính xác.'}{' '}
                    </span>
                    {!isCorrect && (
                      <div className="mt-1">
                        Đáp án đúng:{' '}
                        <strong className="underline text-purple-900">
                          {q.answer}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Check & Reset Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          id="arrange-reset-btn"
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Làm lại & Đảo từ mới</span>
        </button>

        <button
          id="arrange-check-btn"
          onClick={handleCheck}
          disabled={isChecked || Object.keys(arrangedWords).length === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            isChecked || Object.keys(arrangedWords).length === 0
              ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-400'
              : 'gradient-pastel-bg text-white shadow-md shadow-purple-200 hover:brightness-105 active:scale-98 cursor-pointer'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>Kiểm tra đáp án</span>
        </button>
      </div>
    </div>
  );
};

