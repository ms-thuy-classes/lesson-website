/**
 * Normalizes a string by converting to lowercase, removing terminal/extra punctuation,
 * collapsing multiple spaces into a single space, and trimming.
 */
export function normalizeSentence(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    // Remove common punctuation: . , ! ? ; : " ' ( )
    .replace(/[.,!?:;"'()[\]{}]/g, '')
    // Replace multiple whitespaces with single space
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if user answer matches either primary answer or any of the alternative accepted answers.
 */
export function isAnswerCorrect(
  userAnswer: string,
  correctAnswer: string,
  acceptAlternatives: string[] = []
): boolean {
  const normalizedUser = normalizeSentence(userAnswer);
  if (!normalizedUser) return false;

  const normalizedCorrect = normalizeSentence(correctAnswer);
  if (normalizedUser === normalizedCorrect) return true;

  return acceptAlternatives.some(
    (alt) => normalizeSentence(alt) === normalizedUser
  );
}
