// app/data/practiceData.ts

import { PracticeGroup } from "@/app/components/practice/PracticeSuite";

import { CONSONANTS, VOCAB as L1_VOCAB, TONE_META as L1_TONE_META, Tone as L1Tone } from "@/app/data/lesson1";
import { VOWELS, VOCAB as L2_VOCAB, POSITION_META, Position as L2Position } from "@/app/data/lesson2";
import { SUPERS, VOCAB as L3_VOCAB } from "@/app/data/lesson3";
import { SUBS, VOCAB as L4_VOCAB, TONE_META as L4_TONE_META, Tone as L4Tone } from "@/app/data/lesson4";
import { PREFIXES, VOCAB as L5_VOCAB, TONE_META as L5_TONE_META, Tone as L5Tone } from "@/app/data/lesson5";
import { SUFFIXES, VOCAB as L6_VOCAB, QUIZ as L6_QUIZ } from "@/app/data/lesson6";

/**
 * Transforms lesson data into the standardized PracticeGroup format required by PracticeSuite.
 * Uses strict Number() casting to prevent String/Int mismatch crashes.
 */
export function getPracticeData(moduleId: number | string): { isLesson1: boolean; groups: PracticeGroup[] } {
  const id = Number(moduleId);
  
  switch (id) {
    case 1:
      return {
        isLesson1: true,
        groups: [
          {
            name: "Consonants",
            items: CONSONANTS.map(c => ({
              id: `c-${c.tib}`, tibetan: c.tib, reading: c.pron, english: L1_TONE_META[c.tone as L1Tone]?.short || "Consonant", audioTarget: c.tib
            }))
          },
          {
            name: "Vocabulary",
            items: L1_VOCAB.map(v => ({
              id: `v-${v.tib}`, tibetan: v.tib, reading: v.translit, english: v.en, audioTarget: v.tib, emoji: v.emoji
            }))
          }
        ]
      };
    case 2:
      return {
        isLesson1: false,
        groups: [
          {
            name: "Vowels",
            items: VOWELS.map(v => ({
              id: `v-${v.key}`, tibetan: v.tib, reading: `[${v.translit.toLowerCase()}]`, english: POSITION_META[v.position as L2Position]?.label || "Vowel", audioTarget: v.translit
            }))
          },
          {
            name: "Vocabulary",
            items: L2_VOCAB.map(v => ({
              id: `voc-${v.tib}`, tibetan: v.tib, reading: `[${v.translit}]`, english: v.en, audioTarget: v.tib, emoji: v.emoji
            }))
          }
        ]
      };
    case 3:
      return {
        isLesson1: false,
        groups: [
          {
            name: "Stacks",
            items: SUPERS.flatMap(s => s.combos.map(c => ({
              id: `c-${c.stack}`, tibetan: c.stack, reading: `[${c.read}]`, english: s.name, audioTarget: c.stack
            })))
          },
          {
            name: "Vocabulary",
            items: L3_VOCAB.map(v => ({
              id: `voc-${v.tib}`, tibetan: v.tib, reading: `[${v.translit}]`, english: v.en, audioTarget: v.tib, emoji: v.emoji
            }))
          }
        ]
      };
    case 4:
      return {
        isLesson1: false,
        groups: [
          {
            name: "Stacks",
            items: SUBS.flatMap(s => s.combos.map(c => ({
              id: `c-${c.stack}`, tibetan: c.stack, reading: c.read, english: L4_TONE_META[c.tone as L4Tone]?.label || "Stack", audioTarget: c.stack
            })))
          },
          {
            name: "Vocabulary",
            items: L4_VOCAB.map(v => ({
              id: `v-${v.tib}`, tibetan: v.tib, reading: v.translit, english: v.en, audioTarget: v.tib, emoji: v.emoji
            }))
          }
        ]
      };
    case 5:
      return {
        isLesson1: false,
        groups: [
          {
            name: "Stacks",
            items: PREFIXES.flatMap(s => s.combos.map(c => ({
              id: `c-${c.word}`, tibetan: c.word, reading: c.read, english: c.gloss ?? L5_TONE_META[c.tone as L5Tone]?.label ?? "Stack", audioTarget: c.word
            })))
          },
          {
            name: "Vocabulary",
            items: L5_VOCAB.map(v => ({
              id: `v-${v.tib}`, tibetan: v.tib, reading: v.translit, english: v.en, audioTarget: v.tib, emoji: v.emoji
            }))
          }
        ]
      };
    case 6:
      return {
        isLesson1: false,
        groups: [
          {
            name: "Words",
            items: L6_QUIZ.map(c => ({
              id: `q-${c.word}`, tibetan: c.word, reading: c.read, english: `Suffix ${SUFFIXES.find(s => s.key === c.suffix)?.head || ""}`, audioTarget: c.word
            }))
          },
          {
            name: "Vocabulary",
            items: L6_VOCAB.map(v => ({
              id: `v-${v.tib}`, tibetan: v.tib, reading: v.read, english: v.en, audioTarget: v.tib, emoji: v.emoji
            }))
          }
        ]
      };
    default:
      return { isLesson1: false, groups: [] };
  }
}