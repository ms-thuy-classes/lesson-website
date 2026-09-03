import React, { useState } from 'react';
import { Check, RotateCcw, CheckCircle2, XCircle, PenTool } from 'lucide-react';
import { RewriteQuestion } from '../../types';
import { isAnswerCorrect } from '../../utils/stringComparison';

interface RewriteExerciseProps {
  title: string;
  questions: RewriteQuestion[];
  onScoreUpdate: (exerciseKey: string, correctCount: number, totalCount: number) => void;
}

export const RewriteExercise: React.FC<RewriteExerciseProps> = ({
  title,
  questions,
  onScoreUpdate,
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleInputChange = (questionId: number, val: string) => {
    if (isChecked) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  };

  const handleCheck = () => {
    setIsChecked(true);
    let correct = 0;
    questions.forEach((q) => {
      const input = userAnswers[q.id] || '';
      if (isAnswerCorrect(input, q.answer, q.acceptAlternatives, q.startWith)) {
        correct++;
      }
    });
    onScoreUpdate('rewrite', correct, questions.length);
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsChecked(false);
    onScoreUpdate('rewrite', 0, questions.length);
  };

  return (
    <div id="exercise-rewrite-container" className="glass-panel rounded-2xl p-5 sm:p-7 border border-white/80 shadow-sm mb-10">
      {/* Exercise Header */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
            4
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-800">
              {title}
            </h4>
            <p className="text-xs text-slate-500">
              Viết lại câu sao cho nghĩa không thay đổi, sử dụng từ gợi ý và từ bắt đầu
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          {questions.length} câu
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-6 mb-8">
        {questions.map((q, qIdx) => {
          const userVal = userAnswers[q.id] || '';
          const isCorrect = isAnswerCorrect(userVal, q.answer, q.acceptAlternatives, q.startWith);

          return (
            <div
              key={q.id}
              id={`rewrite-question-${q.id}`}
              className="p-4 sm:p-5 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs"
            >
              {/* Original sentence and hint */}
              <div className="mb-3">
                <div className="flex items-start gap-2 mb-1.5">
                  <span className="font-bold text-emerald-600 text-sm">
                    Câu {qIdx + 1}:
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                    {q.question}
                  </p>
                </div>
                {q.hint && (
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200/60 ml-0 sm:ml-6">
                    <PenTool className="w-3 h-3" />
                    <span>Gợi ý: {q.hint}</span>
                  </div>
                )}
              </div>

              {/* Start With Prompt Words */}
              {q.startWith && (
                <div className="ml-0 sm:ml-6 mb-2.5 flex items-center gap-2 flex-wrap">
                  <span className="text-emerald-600 font-bold text-base select-none">➔</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isChecked && !userVal.trim()) {
                        handleInputChange(q.id, q.startWith + ' ');
                      }
                    }}
                    title="Bấm để tự động điền phần đầu gợi ý vào ô làm bài"
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100/90 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-bold transition-all shadow-2xs group cursor-pointer"
                  >
                    <span>{q.startWith}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-white/90 px-1.5 py-0.5 rounded border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      Nhấp để điền
                    </span>
                  </button>
                  <span className="text-slate-400 font-mono tracking-widest hidden sm:inline select-none">
                    _________________________
                  </span>
                </div>
              )}

              {/* Textarea or Input for User rewrite */}
              <div className="ml-0 sm:ml-6 mb-2">
                <textarea
                  id={`rewrite-textarea-${q.id}`}
                  rows={2}
                  value={userVal}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  disabled={isChecked}
                  placeholder={
                    q.startWith
                      ? `Tiếp tục viết câu bắt đầu bằng "${q.startWith}..." (hoặc viết toàn bộ câu)`
                      : "Nhập câu viết lại của bạn vào đây..."
                  }
                  className={`w-full p-3 text-xs sm:text-sm font-medium rounded-xl border focus:outline-none transition-all resize-none ${
                    isChecked
                      ? isCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300/40'
                        : 'bg-rose-50 border-rose-400 text-rose-900'
                      : 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-purple-400 focus:border-transparent'
                  }`}
                />
              </div>

              {/* Feedback after check */}
              {isChecked && (
                <div
                  className={`ml-0 sm:ml-6 p-3 rounded-xl text-xs sm:text-sm flex items-start gap-2 ${
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
                      {isCorrect ? 'Chính xác tuyệt đối!' : 'Chưa chính xác.'}{' '}
                    </span>
                    {!isCorrect && (
                      <div className="mt-1 space-y-1">
                        <div>
                          Đáp án chuẩn:{' '}
                          <strong className="underline text-slate-800">
                            {q.answer}
                          </strong>
                        </div>
                        {q.acceptAlternatives && q.acceptAlternatives.length > 0 && (
                          <div className="text-slate-600 text-[11px]">
                            Các cách viết khác được chấp nhận: {q.acceptAlternatives.join(' / ')}
                          </div>
                        )}
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
          id="rewrite-reset-btn"
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Làm lại</span>
        </button>

        <button
          id="rewrite-check-btn"
          onClick={handleCheck}
          disabled={isChecked || Object.values(userAnswers).filter(Boolean).length === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            isChecked || Object.values(userAnswers).filter(Boolean).length === 0
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
