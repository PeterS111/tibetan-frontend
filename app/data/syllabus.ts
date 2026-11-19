// app/data/syllabus.ts

export interface SyllabusModule {
  id: number;
  module_id: number;
  courseId: "beginner1" | "beginner2";
  unitNumber: number;
  title: string;
  description: string;
  time_est: string;
  progress: number;
  status: "active" | "locked" | "completed";
  lesson_count: number;
  isCapstone?: boolean;
  mastery_scores?: Record<string, any>;
}

export interface UpcomingUnit {
  unitNumber: string;
  title: string;
  description: string;
  time_est: string;
  isCapstone?: boolean;
}

export const FALLBACK_MODULES: SyllabusModule[] = [
  { id: 1, module_id: 1, courseId: "beginner1", unitNumber: 1, title: "The 30 Consonants", description: "The foundation of the Tibetan alphabet, script, tones, and essential root vocabulary.", time_est: "2h 30m", progress: 0, status: "active", lesson_count: 8, mastery_scores: {} },
  { id: 2, module_id: 2, courseId: "beginner1", unitNumber: 2, title: "The Four Vowels", description: "The four diacritic marks, their shapes, positions, pronunciation, and spelling math.", time_est: "2h", progress: 0, status: "locked", lesson_count: 7, mastery_scores: {} },
  { id: 3, module_id: 3, courseId: "beginner1", unitNumber: 3, title: "The Three Superscripts", description: "The superscripts ར, ལ, and ས, their consonant combinations, tone changes, and vocabulary.", time_est: "2h 30m", progress: 0, status: "locked", lesson_count: 5, mastery_scores: {} },
  { id: 4, module_id: 4, courseId: "beginner1", unitNumber: 4, title: "The Four Subscripts", description: "The Subscripts (ya-ra-la-wa) and their complex sound shifts.", time_est: "3h", progress: 0, status: "locked", lesson_count: 6, mastery_scores: {} },
  { id: 5, module_id: 5, courseId: "beginner1", unitNumber: 5, title: "The Prefix Letters", description: "The five prefix letters and their complex role in Tibetan spelling and pronunciation.", time_est: "2h", progress: 0, status: "locked", lesson_count: 7, mastery_scores: {} },
  { id: 6, module_id: 6, courseId: "beginner1", unitNumber: 6, title: "The Suffix Letters", description: "The ten suffix letters and the two secondary suffixes.", time_est: "2h", progress: 0, status: "locked", lesson_count: 9, mastery_scores: {} },
  { id: 7, module_id: 7, courseId: "beginner1", unitNumber: 7, title: "Final Assessment", description: "A short mixed assessment drawing on every step so far. Score 80% or higher to pass.", time_est: "30m", progress: 0, status: "locked", lesson_count: 3, isCapstone: true, mastery_scores: {} },
  { id: 8, module_id: 8, courseId: "beginner2", unitNumber: 1, title: "Welcome to the Class", description: "Classroom phrases and the language of a Tibetan teacher.", time_est: "1h", progress: 0, status: "locked", lesson_count: 9, mastery_scores: {} },
];

export const BEGINNER_2_UPCOMING: UpcomingUnit[] = [
  { unitNumber: "02", title: "Numbers, Time & Days", description: "Count to 100, tell the time, and name the days of the week.", time_est: "2h" },
  { unitNumber: "03", title: "Greetings", description: "Everyday greetings and appropriate responses.", time_est: "1h" },
  { unitNumber: "04", title: "Where are you from?", description: "Ask and answer where someone is from.", time_est: "1.5h" },
  { unitNumber: "05", title: "Introduction", description: "Introduce yourself, your family, age, birthday, and work.", time_est: "2h" },
  { unitNumber: "06", title: "How Much is for Tsampa?", description: "Ask prices and quantities when shopping.", time_est: "1.5h" },
  { unitNumber: "07", title: "What are you doing at the Weekend?", description: "Describe weekend routines and present-tense activities.", time_est: "1.5h" },
  { unitNumber: "08", title: "Our House", description: "Describe your own home in more detail.", time_est: "2h" },
  { unitNumber: "09", title: "What do you need to do?", description: "Talk about daily tasks and things you need to do.", time_est: "2h" },
  { unitNumber: "10", title: "Four Seasons", description: "Weather, clothing, and how each season feels.", time_est: "1.5h" },
  { unitNumber: "11", title: "Beginner 2 Final Assessment", description: "Show what you've learned across everyday topics and unlock your Beginner 2 certificate.", time_est: "15m", isCapstone: true },
];

export function isBeginner1Module(moduleId: number | string): boolean {
  const id = Number(moduleId);
  return id >= 1 && id <= 7;
}

export function isBeginner2Module(moduleId: number | string): boolean {
  const id = Number(moduleId);
  return id >= 8;
}

export function getDisplayUnitNumber(moduleId: number | string): string {
  const id = Number(moduleId);
  if (id >= 8) {
    const rel = id - 7;
    return rel < 10 ? `0${rel}` : `${rel}`;
  }
  return `${id}`;
}

export function isPracticeEligibleModule(moduleId: number | string): boolean {
  return Number(moduleId) !== 7;
}
