/**
 * Utility functions for scrambling sentence words so that they are maximally
 * disordered and as different from the correct answer as possible.
 * 
 * Objectives:
 * 1. Derangement: No word appears in its original answer position (P[k] != Answer[k]).
 * 2. No consecutive answer pairs: Words adjacent in the answer must not appear adjacent in the scramble.
 * 3. Opening/Closing word displacement: The capitalized first word must not be first, and the last word must not be last.
 * 4. Dispersion: Maximize distance/inversions from the original sentence flow.
 */

/**
 * Normalizes a word for comparison by removing trailing punctuation and lowercase.
 */
function cleanWord(w: string): string {
  return w.toLowerCase().replace(/[.,!?;:'"“”]/g, '').trim();
}

/**
 * Determines the order of words in the correct answer.
 * If correctOrder is supplied and valid, verifies or uses it.
 * Otherwise, traces word positions in the answer string sequentially.
 */
export function getAnswerWordOrder(
  words: string[],
  answer: string,
  correctOrder?: number[]
): number[] {
  const n = words.length;
  if (n <= 1) return words.map((_, i) => i);

  // Check if correctOrder is already a valid permutation
  if (
    correctOrder &&
    correctOrder.length === n &&
    new Set(correctOrder).size === n
  ) {
    return [...correctOrder];
  }

  // Sequentially find each word token in the answer string
  const cleanAns = answer.toLowerCase();
  const tokens = words.map((w, idx) => ({
    idx,
    clean: cleanWord(w),
    origLength: w.length,
  }));

  const matchedIndices: number[] = [];
  const remainingTokens = [...tokens];
  let searchOffset = 0;

  while (remainingTokens.length > 0) {
    let earliestPos = Infinity;
    let bestTokenIdx = -1;

    for (let i = 0; i < remainingTokens.length; i++) {
      const token = remainingTokens[i];
      if (!token.clean) continue;
      const pos = cleanAns.indexOf(token.clean, searchOffset);
      if (pos !== -1 && pos < earliestPos) {
        earliestPos = pos;
        bestTokenIdx = i;
      }
    }

    if (bestTokenIdx !== -1 && earliestPos !== Infinity) {
      const [chosen] = remainingTokens.splice(bestTokenIdx, 1);
      matchedIndices.push(chosen.idx);
      searchOffset = earliestPos + chosen.clean.length;
    } else {
      // Fallback for any unmatched tokens (e.g. irregular punctuation)
      matchedIndices.push(...remainingTokens.map((t) => t.idx));
      break;
    }
  }

  return matchedIndices.length === n ? matchedIndices : words.map((_, i) => i);
}

/**
 * Calculates a penalty score for similarity between a candidate permutation and the answer.
 * Lower penalty = more different from the answer.
 */
export function computeSimilarityPenalty(
  perm: number[],
  answerOrder: number[],
  words: string[]
): number {
  const n = perm.length;
  let penalty = 0;

  const answerPos = new Map<number, number>();
  answerOrder.forEach((wIdx, pos) => answerPos.set(wIdx, pos));

  for (let i = 0; i < n; i++) {
    const wordIdx = perm[i];
    const posInAnswer = answerPos.get(wordIdx) ?? i;

    // 1. Same absolute position as in answer
    if (posInAnswer === i) {
      penalty += 1500;
    }

    // 2. Near position (within 1 slot)
    if (Math.abs(posInAnswer - i) <= 1) {
      penalty += 200;
    }

    // 3. Same word string as what is at this index in the answer
    const answerWordAtThisPos = words[answerOrder[i]];
    if (
      answerWordAtThisPos &&
      cleanWord(words[wordIdx]) === cleanWord(answerWordAtThisPos)
    ) {
      penalty += 1200;
    }

    // 4. Consecutive forward pair from the answer: (e.g. "United" then "Kingdom")
    if (i < n - 1) {
      const nextWordIdx = perm[i + 1];
      const nextPosInAnswer = answerPos.get(nextWordIdx) ?? (i + 1);

      if (nextPosInAnswer === posInAnswer + 1) {
        penalty += 3500; // VERY high penalty: never present consecutive words together!
      } else if (nextPosInAnswer === posInAnswer + 2) {
        penalty += 300;
      }

      // Reverse consecutive pair: e.g. "Kingdom" then "United"
      if (nextPosInAnswer === posInAnswer - 1) {
        penalty += 600;
      }
    }
  }

  // 5. First word of answer should NOT be at the start
  if (perm[0] === answerOrder[0]) {
    penalty += 2500;
  }
  // Also discourage first word in first 2 positions
  if (n > 3 && answerPos.get(perm[0]) === 1) {
    penalty += 400;
  }

  // 6. Last word of answer should NOT be at the end
  if (perm[n - 1] === answerOrder[n - 1]) {
    penalty += 2500;
  }
  if (n > 3 && answerPos.get(perm[n - 1]) === n - 2) {
    penalty += 400;
  }

  return penalty;
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm.
 */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Returns an array of word indices representing a maximally scrambled order
 * of the words for an Arrange question.
 *
 * It tests structural patterns (interleaved, reverse, odd/even) and hundreds
 * of randomized permutations to guarantee:
 * - 0 consecutive answer pairs wherever possible
 * - No words at original position
 * - Opening word displaced into the body
 * - Ending word displaced into the body
 */
export function getMaximallyScrambledIndices(
  words: string[],
  answer: string,
  correctOrder?: number[]
): number[] {
  const n = words.length;
  if (n <= 1) return [0];
  if (n === 2) return [1, 0];

  const answerOrder = getAnswerWordOrder(words, answer, correctOrder);

  // Structural candidate 1: Evens then Odds (e.g., [1, 3, 5, ..., 0, 2, 4])
  const odds = answerOrder.filter((_, i) => i % 2 !== 0);
  const evens = answerOrder.filter((_, i) => i % 2 === 0);
  const candidate1 = [...odds, ...evens];

  // Structural candidate 2: Reverse evens then reverse odds
  const candidate2 = [...[...evens].reverse(), ...[...odds].reverse()];

  // Structural candidate 3: Split into halves and interleave backwards
  const mid = Math.floor(n / 2);
  const candidate3: number[] = [];
  const right = answerOrder.slice(mid);
  const left = answerOrder.slice(0, mid);
  for (let i = 0; i < Math.max(right.length, left.length); i++) {
    if (i < right.length) candidate3.push(right[i]);
    if (i < left.length) candidate3.push(left[i]);
  }

  const initialCandidates: number[][] = [candidate1, candidate2, candidate3];

  let bestPerm = candidate1;
  let lowestPenalty = computeSimilarityPenalty(bestPerm, answerOrder, words);

  // Check initial structured candidates
  for (const c of initialCandidates) {
    if (c.length === n && new Set(c).size === n) {
      const score = computeSimilarityPenalty(c, answerOrder, words);
      if (score < lowestPenalty) {
        lowestPenalty = score;
        bestPerm = c;
      }
    }
  }

  // Run up to 400 random shuffles to find an optimal scramble
  // For sentences with 4+ words, penalty can usually reach 0 (or close to 0)
  for (let iter = 0; iter < 400; iter++) {
    const candidate = shuffle(answerOrder);
    const score = computeSimilarityPenalty(candidate, answerOrder, words);

    if (score < lowestPenalty) {
      lowestPenalty = score;
      bestPerm = candidate;
      if (score === 0) {
        // Perfect scramble: 0 words at original slot, 0 consecutive pairs, ends displaced
        break;
      }
    }
  }

  return bestPerm;
}
