export interface ArticleItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  level: string;
  vocabCount: number;
  exerciseCount: number;
  totalQuestions: number;
  file: string;
  thumbnail: string;
}

export interface ArticlesData {
  totalLessons: number;
  lessonsPerPage: number;
  lessons: ArticleItem[];
}

export interface VocabItem {
  stt: number;
  word: string;
  ipa: string;
  pos: string;
  meaning: string;
  example: string;
  exampleVi: string;
}

export interface GrammarPoint {
  rule: string;
  example: string;
  highlight?: boolean;
}

export interface GrammarSection {
  heading: string;
  content?: string;
  highlight?: boolean;
  points?: GrammarPoint[];
  layout?: 'two-columns' | 'single-column';
}

export interface GrammarTheory {
  title: string;
  sections: GrammarSection[];
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FillBlankQuestion {
  id: number;
  question?: string;
  sentence?: string;
  answer: string;
  acceptAlternatives?: string[];
  hint?: string;
  explanation?: string;
  translationVi?: string;
}

export interface ArrangeQuestion {
  id: number;
  words: string[];
  correctOrder?: number[];
  answer: string;
  acceptAlternatives?: string[];
  hint?: string;
  explanation?: string;
  translationVi?: string;
}

export interface RewriteQuestion {
  id: number;
  question: string;
  hint: string;
  startWith?: string;
  answer: string;
  acceptAlternatives?: string[];
  explanation?: string;
  translationVi?: string;
}

export interface CollocationTableItem {
  id: string;
  phrase: string;
  meaning: string;
  correctCategory: 'MAKE' | 'DO';
  explanation: string;
}

export interface CollocationTableExercise {
  title: string;
  description?: string;
  categories: {
    key: 'MAKE' | 'DO';
    label: string;
    rule: string;
  }[];
  items: CollocationTableItem[];
}

export interface MatchingItemA {
  id: number;
  word: string;
  hint?: string;
  correctMatch: string; // e.g. 'A', 'B', 'C', 'D'...
  vietnameseMeaning?: string;
  explanation?: string;
}

export interface MatchingItemB {
  key: string; // 'A', 'B', 'C', 'D'...
  text: string;
  vietnameseMeaning?: string;
}

export interface MatchingExercise {
  title: string;
  description?: string;
  columnA: MatchingItemA[];
  columnB: MatchingItemB[];
}

export interface LessonData {
  id: string;
  title: string;
  tags: string[];
  level: string;
  theory: {
    vocabulary: VocabItem[];
    grammar: GrammarTheory;
  };
  exercises: {
    mcq?: {
      title: string;
      questions: MCQQuestion[];
    };
    matching?: MatchingExercise;
    collocationTable?: CollocationTableExercise;
    fillBlank?: {
      title: string;
      wordbank?: string[];
      questions: FillBlankQuestion[];
    };
    arrange?: {
      title: string;
      questions: ArrangeQuestion[];
    };
    rewrite?: {
      title: string;
      questions: RewriteQuestion[];
    };
  };
}

export interface StudentScoreSummary {
  correctAnswers: number;
  totalQuestions: number;
  scoreOutOfTen: number;
  progressPercent: number;
}
