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
  question: string;
  answer: string;
  acceptAlternatives?: string[];
}

export interface ArrangeQuestion {
  id: number;
  words: string[];
  correctOrder: number[];
  answer: string;
  acceptAlternatives?: string[];
}

export interface RewriteQuestion {
  id: number;
  question: string;
  hint: string;
  answer: string;
  acceptAlternatives?: string[];
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
    mcq: {
      title: string;
      questions: MCQQuestion[];
    };
    fillBlank: {
      title: string;
      wordbank?: string[];
      questions: FillBlankQuestion[];
    };
    arrange: {
      title: string;
      questions: ArrangeQuestion[];
    };
    rewrite: {
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
