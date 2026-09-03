import React, { useState } from 'react';
import { Check, RotateCcw, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { MCQQuestion } from '../../types';

interface MCQExerciseProps {
  title: string;
  questions: MCQQuestion[];
  onScoreUpdate: (exerciseKey: string, correctCount: number, totalCount: number) => void;
}

export const MCQExercise: React.FC<MCQExerciseProps> = ({
  title,
  questions,
  onScoreUpdate,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleSelect = (questionId: number, optionIdx: number) => {
    if (isChecked) return; // Locked once checked until reset
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleCheck = () => {
    setIsChecked(true);
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    onScoreUpdate('mcq', correct, questions.length);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsChecked(false);
    onScoreUpdate('mcq', 0, questions.length);
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div id="exercise-mcq-container" className="glass-panel rounded-2xl p-5 sm:p-7 border border-white/80 shadow-sm mb-10">
      {/* Exercise Title */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-800">
              {title}
            </h4>
            <p className="text-xs text-slate-500">
              Chọn một đáp án chính xác nhất cho mỗi câu hỏi
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          {questions.length} câu
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-6 mb-8">
        {questions.map((q, idx) => {
          const selected = selectedAnswers[q.id];
          const hasSelected = selected !== undefined;
          const isCorrect = hasSelected && selected === q.correctIndex;

          return (
            <div
              key={q.id}
              id={`mcq-question-${q.id}`}
              className="p-4 sm:p-5 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs"
            >
              {/* Question Text */}
              <div className="flex items-start gap-2.5 mb-4">
                <span className="font-bold text-purple-600 text-sm">
                  Câu {idx + 1}:
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                  {q.question}
                </p>
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = selected === optIdx;
                  let optionStyle = 'bg-white/80 border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50/40';

                  if (isChecked) {
                    if (optIdx === q.correctIndex) {
                      // Correct option
                      optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold ring-2 ring-emerald-300/40';
                    } else if (isThisSelected) {
                      // Wrong selected option
                      optionStyle = 'bg-rose-50 border-rose-400 text-rose-900 line-through opacity-80';
                    } else {
                      optionStyle = 'bg-slate-50/50 border-slate-100 text-slate-400';
                    }
                  } else if (isThisSelected) {
                    optionStyle = 'bg-purple-100/90 border-purple-400 text-purple-900 font-semibold shadow-xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      id={`mcq-opt-${q.id}-${optIdx}`}
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={isChecked}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs sm:text-sm transition-all duration-200 ${optionStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isChecked && optIdx === q.correctIndex
                            ? 'bg-emerald-500 text-white'
                            : isThisSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {optionLabels[optIdx]}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isChecked && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isChecked && isThisSelected && optIdx !== q.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after checking */}
              {isChecked && (
                <div
                  className={`mt-3 p-3 rounded-lg text-xs sm:text-sm flex items-start gap-2 ${
                    isCorrect
                      ? 'bg-emerald-50/80 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50/80 text-rose-900 border border-rose-200'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      {isCorrect ? 'Chính xác! ' : 'Chưa chính xác. '}
                    </span>
                    <span>{q.explanation}</span>
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
          id="mcq-reset-btn"
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Làm lại</span>
        </button>

        <button
          id="mcq-check-btn"
          onClick={handleCheck}
          disabled={isChecked || Object.keys(selectedAnswers).length === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            isChecked || Object.keys(selectedAnswers).length === 0
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
