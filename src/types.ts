export type Level = '基礎' | '応用' | '発展';

export type UnitStatus = '未着手' | '練習中' | '練習完了' | 'テスト済';

export type QuestionType =
  | 'meaning'
  | 'word-order'
  | 'fill-in'
  | 'jp-to-en'
  | 'listening'
  | 'error-detection';

export interface VocabEntry {
  en: string;
  ja: string;
}

interface BaseQuestion {
  id: string;
  unit: number;
  step: number;
  level: Level;
  vocab?: VocabEntry[];
}

export interface MeaningQuestion extends BaseQuestion {
  type: 'meaning';
  sentence: string;
  question: string;
  choices: string[];
  answer: number;
  showText: boolean;
}

export interface WordOrderQuestion extends BaseQuestion {
  type: 'word-order';
  sentence: string;
  question: string;
  words: string[];
  answer: string[];
}

export interface FillInQuestion extends BaseQuestion {
  type: 'fill-in';
  sentence: string;
  question: string;
  choices: string[];
  answer: number;
}

export interface JpToEnQuestion extends BaseQuestion {
  type: 'jp-to-en';
  japanese: string;
  question: string;
  choices: string[];
  answer: number;
}

export interface ListeningQuestion extends BaseQuestion {
  type: 'listening';
  sentence: string;
  question: string;
  choices: string[];
  answer: number;
}

export interface ErrorDetectionQuestion extends BaseQuestion {
  type: 'error-detection';
  question: string;
  choices: string[];
  answer: number;
}

export type Question =
  | MeaningQuestion
  | WordOrderQuestion
  | FillInQuestion
  | JpToEnQuestion
  | ListeningQuestion
  | ErrorDetectionQuestion;

export interface QuestionStats {
  correctCount: number;
  incorrectCount: number;
}

export interface UnitProgress {
  status: UnitStatus;
  /** 完了したステージ数（0=未完了, 3=全ステージ完了） */
  completedStep?: number;
  practiceAccuracy?: number;
  testAccuracy?: number;
  testDate?: string;
}

export interface PendingSpeakingBatch {
  id: string;
  unit: number;
  items: SpeakingItem[];
  savedAt: string;
  testCorrect: number;
  testTotal: number;
  testAccuracy: number;
  vocabCorrect: number;
  vocabTotal: number;
  vocabAccuracy: number;
  practiceAccuracy?: number;
}

export interface StudentData {
  name: string;
  unitProgress: Record<number, UnitProgress>;
  questionStats: Record<string, QuestionStats>;
  /** あとでまとめてやる音読テスト */
  pendingSpeaking?: PendingSpeakingBatch[];
  /** クラウド同期用（ISO 8601） */
  updatedAt?: string;
}

export interface AppSettings {
  teacherPassword: string;
}

export interface SessionRecord {
  studentName: string;
  unit: number;
  practiceAccuracy: number;
  testCorrect: number;
  testTotal: number;
  testAccuracy: number;
  vocabCorrect: number;
  vocabTotal: number;
  vocabAccuracy: number;
  speakingPassed: number;
  speakingTotal: number;
  speakingAccuracy: number;
  overallScore: number;
  date: string;
  speakingPending?: boolean;
}

export type Screen =
  | 'start'
  | 'units'
  | 'practice'
  | 'stepComplete'
  | 'practiceComplete'
  | 'test'
  | 'vocabTest'
  | 'speakingCheck'
  | 'speakingBatch'
  | 'testResults'
  | 'review';

export interface TestAnswer {
  question: Question;
  selected: number | string[];
  correct: boolean;
}

export type VocabTestDirection = 'en-to-ja' | 'ja-to-en';

export interface VocabTestItem {
  id: string;
  entry: VocabEntry;
  direction: VocabTestDirection;
  choices: string[];
  answer: number;
}

export interface VocabTestAnswer {
  item: VocabTestItem;
  selected: number;
  correct: boolean;
}

export type SpeakingMode = 'read-en' | 'say-en';

export interface SpeakingItem {
  entry: VocabEntry;
  mode: SpeakingMode;
}

export interface SpeakingResult {
  entry: VocabEntry;
  mode: SpeakingMode;
  passed: boolean;
}

export interface FullTestResult {
  testCorrect: number;
  testTotal: number;
  testAccuracy: number;
  vocabCorrect: number;
  vocabTotal: number;
  vocabAccuracy: number;
  speakingPassed: number;
  speakingTotal: number;
  speakingAccuracy: number;
  overallScore: number;
  wrongTestAnswers: TestAnswer[];
  speakingPending?: boolean;
  speakingSkipped?: boolean;
  /** 合格ラインを満たしたか（次の単元解放の判定） */
  testPassed?: boolean;
}

export type Feedback = 'none' | 'correct' | 'incorrect';

export type QuestionMode = 'practice' | 'test';
