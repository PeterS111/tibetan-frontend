// app/data/vocabCatalog.ts
// Single source of truth for lesson vocabulary recording & backfill.
// Imports directly from lesson*.ts (zero duplicated word definitions).

import { VOCAB as L1_VOCAB } from "@/app/data/lesson1";
import { VOCAB as L2_VOCAB } from "@/app/data/lesson2";
import { VOCAB as L3_VOCAB } from "@/app/data/lesson3";
import { VOCAB as L4_VOCAB } from "@/app/data/lesson4";
import { VOCAB as L5_VOCAB } from "@/app/data/lesson5";
import { VOCAB as L6_VOCAB } from "@/app/data/lesson6";
import { VOCAB as L8_VOCAB } from "@/app/data/lesson8";
import { VOCAB as L9_VOCAB } from "@/app/data/lesson9";

export interface LearnedWordEntry {
  module_id: number;
  tibetan: string;
  pronunciation: string;
  english: string;
}

// Web step index where the Vocabulary section (VocabGrid + Vocabulary Mastery Check) lives
export const WEB_VOCAB_STEP_INDEX: Record<number, number> = {
  1: 5,
  2: 4,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  8: 0,
  9: 0,
};

// Progress thresholds used strictly for one-time backfill of previously practiced lessons
const BACKFILL_PROGRESS_THRESHOLD: Record<number, number> = {
  1: 6,
  2: 5,
  3: 4,
  4: 4,
  5: 5,
  6: 6,
  8: 2,
  9: 2,
};

export function getLessonVocabEntries(moduleId: number): LearnedWordEntry[] {
  const id = Number(moduleId);
  switch (id) {
    case 1:
      return L1_VOCAB.map((v) => ({
        module_id: 1,
        tibetan: v.tib,
        pronunciation: v.translit,
        english: v.en,
      }));
    case 2:
      return L2_VOCAB.map((v) => ({
        module_id: 2,
        tibetan: v.tib,
        pronunciation: v.translit,
        english: v.en,
      }));
    case 3:
      return L3_VOCAB.map((v) => ({
        module_id: 3,
        tibetan: v.tib,
        pronunciation: v.translit,
        english: v.en,
      }));
    case 4:
      return L4_VOCAB.map((v) => ({
        module_id: 4,
        tibetan: v.tib,
        pronunciation: v.translit,
        english: v.en,
      }));
    case 5:
      return L5_VOCAB.map((v) => ({
        module_id: 5,
        tibetan: v.tib,
        pronunciation: v.translit,
        english: v.en,
      }));
    case 6:
      return L6_VOCAB.map((v) => ({
        module_id: 6,
        tibetan: v.tib,
        pronunciation: v.read,
        english: v.en,
      }));
    case 8:
      return L8_VOCAB.map((v) => ({
        module_id: 8,
        tibetan: v.tib,
        pronunciation: v.pron,
        english: v.en,
      }));
    case 9:
      return L9_VOCAB.map((v) => ({
        module_id: 9,
        tibetan: v.tib,
        pronunciation: v.pron,
        english: v.en,
      }));
    default:
      return [];
  }
}

export async function recordLessonVocabulary(
  moduleId: number,
  token: string | null | undefined
): Promise<number | null> {
  if (!token) return null;
  const entries = getLessonVocabEntries(moduleId);
  if (entries.length === 0) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/learned-words/record`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entries }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.words_known === "number" ? data.words_known : null;
  } catch {
    return null;
  }
}

interface BackfillArgs {
  userId: string;
  modules: any[];
  learnedWordModules?: number[];
  currentWordsKnown: number;
  token: string | null | undefined;
}

/**
 * Checks whether any lesson whose vocabulary section was already practiced/completed
 * has not yet been recorded in public.user_learned_words, and syncs them once.
 */
export async function syncLearnedWordsIfNeeded({
  userId,
  modules,
  learnedWordModules,
  currentWordsKnown,
  token,
}: BackfillArgs): Promise<number> {
  if (!token || !Array.isArray(modules) || modules.length === 0) {
    return currentWordsKnown;
  }

  const alreadyRecorded = new Set<number>(
    Array.isArray(learnedWordModules)
      ? learnedWordModules.map((n) => Number(n))
      : []
  );

  const missingModuleIds: number[] = [];

  for (const m of modules) {
    const modId = Number(m?.module_id);
    if (!BACKFILL_PROGRESS_THRESHOLD[modId]) continue;
    if (alreadyRecorded.has(modId)) continue;

    let scores: Record<string, any> = {};
    if (typeof m?.mastery_scores === "string") {
      try {
        scores = JSON.parse(m.mastery_scores);
      } catch {}
    } else if (m?.mastery_scores && typeof m.mastery_scores === "object") {
      scores = m.mastery_scores;
    }

    let hasLocalVocabPractice = false;
    if (typeof window !== "undefined") {
      const localVocabScore = parseInt(
        localStorage.getItem(`tibetan_vocab_score_mod_${modId}`) || "0",
        10
      );
      if (!isNaN(localVocabScore) && localVocabScore > 0) {
        hasLocalVocabPractice = true;
      } else {
        try {
          const localScores = JSON.parse(
            localStorage.getItem(`tibetan_mastery_scores_mod_${modId}`) || "{}"
          );
          if (
            localScores &&
            typeof localScores === "object" &&
            Object.keys(localScores).some((k) =>
              k.toLowerCase().includes("vocabulary")
            )
          ) {
            hasLocalVocabPractice = true;
          }
        } catch {}
      }
    }

    const hasServerVocabQuiz = Object.keys(scores).some((k) =>
      k.toLowerCase().includes("vocabulary")
    );
    const prog = Number(m?.progress) || 0;
    const isCompleted = m?.status === "completed";

    if (
      isCompleted ||
      hasServerVocabQuiz ||
      hasLocalVocabPractice ||
      prog >= BACKFILL_PROGRESS_THRESHOLD[modId]
    ) {
      missingModuleIds.push(modId);
    }
  }

  if (missingModuleIds.length === 0) {
    return currentWordsKnown;
  }

  const sessionKey = `loplao_vocab_sync_${userId}_${missingModuleIds.join(",")}`;
  if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey) === "1") {
    return currentWordsKnown;
  }

  const entries = missingModuleIds.flatMap((id) => getLessonVocabEntries(id));
  if (entries.length === 0) return currentWordsKnown;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/learned-words/record`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entries }),
      }
    );
    if (!res.ok) return currentWordsKnown;
    const data = await res.json();
    if (typeof window !== "undefined") {
      sessionStorage.setItem(sessionKey, "1");
    }
    if (typeof data?.words_known === "number") {
      return data.words_known;
    }
  } catch {
    // Non-fatal; will retry on next load
  }

  return currentWordsKnown;
}
