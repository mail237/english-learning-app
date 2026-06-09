import type { Question, TestAnswer } from '../types';

export function uniqueQuestions(questions: Question[]): Question[] {
  const seen = new Set<string>();
  return questions.filter((q) => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });
}

export function questionsFromWrongAnswers(answers: TestAnswer[]): Question[] {
  return uniqueQuestions(answers.filter((a) => !a.correct).map((a) => a.question));
}
