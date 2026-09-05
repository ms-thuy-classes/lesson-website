import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckSquare, Award, Sparkles, Share2 } from 'lucide-react';
import { LessonData } from '../types';
import { VocabularyGrid } from './VocabularyGrid';
import { GrammarView } from './GrammarView';
import { MCQExercise } from './exercises/MCQExercise';
import { MatchingExercise } from './exercises/MatchingExercise';
import { CollocationTableExercise } from './exercises/CollocationTableExercise';
import { FillBlankExercise } from './exercises/FillBlankExercise';
import { ArrangeExercise } from './exercises/ArrangeExercise';
import { RewriteExercise } from './exercises/RewriteExercise';
import { LessonBookmark } from './LessonBookmark';

interface LessonDetailProps {
  lesson: LessonData;
  onBack: () => void;
  onUpdateTotalScore: (lessonId: string, correct: number, total: number) => void;
}

export const LessonDetail: React.FC<LessonDetailProps> = ({
  lesson,
  onBack,
  onUpdateTotalScore,
}) => {
  // Helper to build initial score state for available exercises
  const getInitialScores = (l: LessonData): Record<string, { correct: number; total: number }> => {
    const scores: Record<string, { correct: number; total: number }> = {};
    if (l.exercises?.mcq?.questions) {
      scores.mcq = { correct: 0, total: l.exercises.mcq.questions.length };
    }
    if (l.exercises?.matching?.columnA) {
      scores.matching = { correct: 0, total: l.exercises.matching.columnA.length };
    }
    if (l.exercises?.collocationTable?.items) {
      scores.collocationTable = { correct: 0, total: l.exercises.collocationTable.items.length };
    }
    if (l.exercises?.fillBlank?.questions) {
      scores.fillBlank = { correct: 0, total: l.exercises.fillBlank.questions.length };
    }
    if (l.exercises?.arrange?.questions) {
      scores.arrange = { correct: 0, total: l.exercises.arrange.questions.length };
    }
    if (l.exercises?.rewrite?.questions) {
      scores.rewrite = { correct: 0, total: l.exercises.rewrite.questions.length };
    }
    return scores;
  };

  // Keep scores of each exercise in this lesson
  const [exerciseScores, setExerciseScores] = useState<Record<string, { correct: number; total: number }>>(() =>
    getInitialScores(lesson)
  );

  const [activeSectionTab, setActiveSectionTab] = useState<'theory' | 'exercises'>('theory');

  // Re-initialize scores when switching lessons
  useEffect(() => {
    setExerciseScores(getInitialScores(lesson));
  }, [lesson]);

  const handleScoreUpdate = (exerciseKey: string, correctCount: number, totalCount: number) => {
    setExerciseScores((prev) => {
      const updated: Record<string, { correct: number; total: number }> = {
        ...prev,
        [exerciseKey]: { correct: correctCount, total: totalCount },
      };

      // Calculate total for this lesson
      const scoresList: { correct: number; total: number }[] = Object.values(updated);
      const totalCorrect = scoresList.reduce((acc, curr) => acc + curr.correct, 0);
      const totalQuestions = scoresList.reduce((acc, curr) => acc + curr.total, 0);

      // Defer parent state update outside the current render / setState execution phase
      queueMicrotask(() => {
        onUpdateTotalScore(lesson.id, totalCorrect, totalQuestions);
      });

      return updated;
    });
  };

  const allScores: { correct: number; total: number }[] = Object.values(exerciseScores);
  const currentLessonCorrect = allScores.reduce((acc, curr) => acc + curr.correct, 0);
  const currentLessonTotal = allScores.reduce((acc, curr) => acc + curr.total, 0);
  const currentLessonScore10 = currentLessonTotal > 0 ? (currentLessonCorrect / currentLessonTotal) * 10 : 0;

  return (
    <div id="lesson-detail-page" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative">
      {/* Floating Translucent Bookmark Navigation */}
      <LessonBookmark lesson={lesson} />

      {/* Navigation Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          id="back-to-home-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-slate-700 hover:text-purple-600 hover:border-purple-300 font-semibold text-xs sm:text-sm transition-all shadow-xs group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Về trang chủ</span>
        </button>

        {/* Tags & Level */}
        <div className="flex items-center gap-2">
          {lesson.tags.map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200"
            >
              {t}
            </span>
          ))}
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
            {lesson.level}
          </span>
        </div>
      </div>

      {/* Lesson Banner */}
      <div id="lesson-banner" className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bài học chính khoá</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight mb-3">
            {lesson.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed mb-6">
            Nắm chắc từ vựng phát âm giọng Mỹ, công thức ngữ pháp và hoàn thành 4 bài tập thực hành để tích luỹ điểm số cùng cô Thúy.
          </p>

          {/* Quick Navigation Pills: Theory & Exercises */}
          <div className="flex items-center gap-3">
            <button
              id="tab-btn-theory"
              onClick={() => {
                setActiveSectionTab('theory');
                document.getElementById('section-theory')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                activeSectionTab === 'theory'
                  ? 'gradient-pastel-bg text-white shadow-purple-200'
                  : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Phần 1: Lý thuyết</span>
            </button>

            <button
              id="tab-btn-exercises"
              onClick={() => {
                setActiveSectionTab('exercises');
                document.getElementById('section-exercises')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                activeSectionTab === 'exercises'
                  ? 'gradient-pastel-bg text-white shadow-purple-200'
                  : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Phần 2: Bài tập thực hành</span>
            </button>
          </div>
        </div>

        {/* Ambient background accent */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-gradient-to-br from-purple-200/30 via-pink-200/20 to-cyan-200/30 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* ============================================================ */}
      {/* PHẦN 1: LÝ THUYẾT */}
      {/* ============================================================ */}
      <section id="section-theory" className="mb-14 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-purple-200/60">
          <div className="px-3.5 py-1 rounded-full gradient-pastel-bg text-white text-xs font-extrabold uppercase tracking-wider">
            Phần 1
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            LÝ THUYẾT (THEORY)
          </h3>
        </div>

        {/* A. Từ vựng */}
        <VocabularyGrid vocabulary={lesson.theory.vocabulary} />

        {/* B. Ngữ pháp */}
        <GrammarView grammar={lesson.theory.grammar} />
      </section>

      {/* ============================================================ */}
      {/* PHẦN 2: BÀI TẬP */}
      {/* ============================================================ */}
      <section id="section-exercises" className="mb-14 scroll-mt-24">
        <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-purple-200/60">
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1 rounded-full gradient-pastel-bg text-white text-xs font-extrabold uppercase tracking-wider">
              Phần 2
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              BÀI TẬP THỰC HÀNH (EXERCISES)
            </h3>
          </div>

          {/* Quick Score in this Lesson */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-purple-200 text-xs font-bold text-purple-700 shadow-2xs">
            <Award className="w-4 h-4 text-purple-500" />
            <span>
              Đạt {currentLessonCorrect}/{currentLessonTotal} câu ({currentLessonScore10.toFixed(1)}đ)
            </span>
          </div>
        </div>

        {/* Exercise 1: Multiple Choice (Trắc nghiệm) */}
        {lesson.exercises?.mcq && (
          <MCQExercise
            title={lesson.exercises.mcq.title}
            questions={lesson.exercises.mcq.questions}
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {/* Exercise: Matching (Nối từ 2 cột) */}
        {lesson.exercises?.matching && (
          <MatchingExercise
            exercise={lesson.exercises.matching}
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {/* Collocation Table Exercise (Phân loại MAKE vs DO) */}
        {lesson.exercises?.collocationTable && (
          <CollocationTableExercise
            exercise={lesson.exercises.collocationTable}
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {/* Exercise 2: Fill in Blank (Điền từ) */}
        {lesson.exercises?.fillBlank && (
          <FillBlankExercise
            title={lesson.exercises.fillBlank.title}
            wordbank={lesson.exercises.fillBlank.wordbank}
            questions={lesson.exercises.fillBlank.questions}
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {/* Exercise 3: Arrange Sentence (Sắp xếp câu) */}
        {lesson.exercises?.arrange && (
          <ArrangeExercise
            title={lesson.exercises.arrange.title}
            questions={lesson.exercises.arrange.questions}
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {/* Exercise 4: Rewrite Sentence (Viết lại câu) */}
        {lesson.exercises?.rewrite && (
          <RewriteExercise
            title={lesson.exercises.rewrite.title}
            questions={lesson.exercises.rewrite.questions}
            onScoreUpdate={handleScoreUpdate}
          />
        )}

        {/* Completion Card */}
        <div id="lesson-completion-card" className="glass-panel rounded-2xl p-6 sm:p-8 text-center border border-white/80 shadow-sm mt-8">
          <div className="w-14 h-14 rounded-2xl gradient-pastel-bg text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-purple-200">
            <Award className="w-7 h-7" />
          </div>
          <h4 className="text-xl font-bold text-slate-800 mb-2">
            Hoàn thành bài tập cùng cô Thúy!
          </h4>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-4">
            Kết quả bài học này:{' '}
            <span className="font-bold text-purple-700">
              {currentLessonCorrect} / {currentLessonTotal} câu đúng
            </span>
            {' '}- Điểm:{' '}
            <span className="font-bold gradient-pastel-text text-base">
              {currentLessonScore10.toFixed(1)} / 10
            </span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl gradient-pastel-bg text-white font-semibold text-sm shadow-md shadow-purple-200 hover:brightness-105 active:scale-98 transition-all"
            >
              Chọn bài học khác
            </button>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-all"
            >
              Lên đầu trang
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
