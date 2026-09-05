import React, { useState } from 'react';
import { Check, RotateCcw, CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';
import { CollocationTableExercise as CollocationTableExerciseType, CollocationTableItem } from '../../types';

interface CollocationTableExerciseProps {
  exercise: CollocationTableExerciseType;
  onScoreUpdate: (exerciseKey: string, correctCount: number, totalCount: number) => void;
}

export const CollocationTableExercise: React.FC<CollocationTableExerciseProps> = ({
  exercise,
  onScoreUpdate,
}) => {
  // State: mapping of itemId -> 'MAKE' | 'DO'
  const [assigned, setAssigned] = useState<Record<string, 'MAKE' | 'DO'>>({});
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const items = exercise.items;

  // Unassigned items still in the word bank
  const unassignedItems = items.filter((it) => !assigned[it.id]);

  const handleSelectItem = (id: string) => {
    if (isChecked) return;
    setSelectedItemId((prev) => (prev === id ? null : id));
  };

  const handleAssignToCategory = (category: 'MAKE' | 'DO', specificItemId?: string) => {
    if (isChecked) return;
    const targetId = specificItemId || selectedItemId;
    if (!targetId) return;

    setAssigned((prev) => ({
      ...prev,
      [targetId]: category,
    }));
    setSelectedItemId(null);
  };

  const handleRemoveItem = (id: string) => {
    if (isChecked) return;
    setAssigned((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleCheck = () => {
    setIsChecked(true);
    let correct = 0;
    items.forEach((it) => {
      if (assigned[it.id] === it.correctCategory) {
        correct++;
      }
    });
    onScoreUpdate('collocationTable', correct, items.length);
  };

  const handleReset = () => {
    setAssigned({});
    setIsChecked(false);
    setSelectedItemId(null);
    onScoreUpdate('collocationTable', 0, items.length);
  };

  // Quick count of correct
  const correctCount = items.filter((it) => assigned[it.id] === it.correctCategory).length;

  return (
    <div
      id="exercise-collocation-table-container"
      className="glass-panel rounded-2xl p-5 sm:p-7 border border-white/80 shadow-sm mb-10"
    >
      {/* Exercise Header */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-800">
              {exercise.title}
            </h4>
            <p className="text-xs text-slate-500">
              {exercise.description || 'Phân loại các danh từ / cụm từ đi kèm vào đúng cột MAKE hoặc DO'}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          {items.length} cụm từ
        </span>
      </div>

      {/* Word Bank / Item Pool */}
      <div className="mb-6 p-4 rounded-xl bg-purple-50/70 border border-purple-100">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Hộp từ vựng cần phân loại (Word Box):
          </span>
          <span className="text-[11px] font-semibold text-purple-700 bg-purple-100/90 px-2.5 py-0.5 rounded-full">
            Còn lại: {unassignedItems.length}/{items.length} cụm
          </span>
        </div>

        {unassignedItems.length === 0 ? (
          <p className="text-xs text-emerald-700 font-semibold py-2 italic flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Bạn đã xếp tất cả các cụm từ vào bảng! Nhấn "Kiểm tra đáp án" bên dưới.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {unassignedItems.map((it) => {
              const isSelected = selectedItemId === it.id;
              return (
                <div key={it.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => handleSelectItem(it.id)}
                    disabled={isChecked}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                      isSelected
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400 scale-105'
                        : 'bg-white text-purple-800 border border-purple-200 hover:border-purple-400 hover:bg-purple-50'
                    }`}
                  >
                    <span>{it.phrase}</span>
                  </button>

                  {/* Quick Action buttons on hover/select */}
                  {isSelected && !isChecked && (
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() => handleAssignToCategory('MAKE', it.id)}
                        className="px-2 py-0.5 text-[11px] font-bold rounded bg-amber-500 text-white hover:bg-amber-600 shadow-2xs"
                      >
                        + MAKE
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAssignToCategory('DO', it.id)}
                        className="px-2 py-0.5 text-[11px] font-bold rounded bg-blue-500 text-white hover:bg-blue-600 shadow-2xs"
                      >
                        + DO
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Classification Columns (MAKE vs DO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {exercise.categories.map((cat) => {
          const categoryItems = items.filter((it) => assigned[it.id] === cat.key);
          const isMake = cat.key === 'MAKE';

          return (
            <div
              key={cat.key}
              id={`collocation-column-${cat.key.toLowerCase()}`}
              className={`rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
                isMake
                  ? 'bg-amber-50/40 border-amber-200/90'
                  : 'bg-blue-50/40 border-blue-200/90'
              }`}
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-black tracking-wider uppercase text-white shadow-2xs ${
                        isMake ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                    >
                      {cat.key}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      ({categoryItems.length} cụm)
                    </span>
                  </div>

                  {/* Direct Add Button if an item is selected */}
                  {!isChecked && selectedItemId && (
                    <button
                      type="button"
                      onClick={() => handleAssignToCategory(cat.key)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg text-white shadow-2xs transition-transform active:scale-95 ${
                        isMake ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      Thêm từ đang chọn vào đây
                    </button>
                  )}
                </div>

                {/* Rule explanation for this category */}
                <p className="text-xs text-slate-600 mb-3 italic">
                  <span className="font-semibold not-italic">Nguyên tắc:</span> {cat.rule}
                </p>

                {/* Placed Items List */}
                <div className="min-h-[140px] p-2.5 rounded-xl bg-white/80 border border-slate-200/70 space-y-2">
                  {categoryItems.length === 0 ? (
                    <div className="h-28 flex flex-col items-center justify-center text-slate-400 text-xs italic">
                      <span>Chưa có cụm từ nào.</span>
                      <span>Nhấp vào từ ở hộp trên để xếp vào cột này.</span>
                    </div>
                  ) : (
                    categoryItems.map((it) => {
                      const isCorrect = it.correctCategory === cat.key;
                      return (
                        <div
                          key={it.id}
                          className={`p-2 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-between gap-2 border transition-all ${
                            isChecked
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                : 'bg-rose-50 border-rose-300 text-rose-900'
                              : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-purple-700">
                              {cat.key.toLowerCase()}
                            </span>
                            <span className="font-semibold text-slate-900">
                              {it.phrase}
                            </span>
                            <span className="text-[11px] text-slate-500 hidden sm:inline">
                              ({it.meaning})
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isChecked ? (
                              isCorrect ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  Đúng
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700">
                                  <XCircle className="w-4 h-4 text-rose-600" />
                                  Phải là {it.correctCategory}
                                </span>
                              )
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(it.id)}
                                className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded transition-colors"
                                title="Bỏ ra khỏi cột"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Explanations after checking */}
      {isChecked && (
        <div className="mb-6 p-4 sm:p-5 rounded-xl bg-purple-50/70 border border-purple-200">
          <div className="flex items-center gap-2 mb-3 font-bold text-purple-900 text-sm sm:text-base">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <span>Giải thích chi tiết các cụm từ MAKE và DO trong bài:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
            {items.map((it) => (
              <div
                key={it.id}
                className="p-2.5 rounded-lg bg-white/90 border border-purple-100 flex flex-col justify-between"
              >
                <div className="font-semibold text-purple-950 mb-1">
                  • <span className="underline font-bold">{it.correctCategory.toLowerCase()} {it.phrase}</span>: {it.meaning}
                </div>
                <div className="text-[11px] text-slate-600 italic">
                  💡 {it.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500 font-medium">
          {isChecked ? (
            <span className="font-bold text-purple-700">
              Kết quả: {correctCount} / {items.length} cụm từ đúng!
            </span>
          ) : (
            <span>Nhấp vào cụm từ và chọn cột phù hợp trước khi kiểm tra.</span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {!isChecked ? (
            <button
              id="check-collocation-btn"
              onClick={handleCheck}
              disabled={Object.keys(assigned).length === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl gradient-pastel-bg text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-200 hover:brightness-105 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              <span>Kiểm tra đáp án</span>
            </button>
          ) : (
            <button
              id="reset-collocation-btn"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
