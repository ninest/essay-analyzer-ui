import { RawEssayAnalysis } from ".";
import { round2dp } from "../utils/number";

export interface EssayAnalysis {
  repeatedWords: {
    lemmas: string[];
    lemmasRepeatedMoreThanOnce: string[];
    lemmasCount: Record<string, number>;
  };
  readability: {
    fleschReadingEase: number;
    fleschReadingEaseDescription: ReadingEaseDescription;
    fleschKincaidGradeLevel: number;
  };
  stats: {
    totalSyllables: number;
    totalWords: number;
    totalSentences: number;
    averageSyllablesPerWord: number;
    averageWordsPerSentence: number;
  };
}
export function getEssayAnalysis(analysis: null | RawEssayAnalysis): null | EssayAnalysis {
  if (!analysis) return null;

  // Repeated words
  const lemmas = Object.keys(analysis.repeatedWords.counter ?? {});
  const lemmasRepeatedMoreThanOnce: string[] = [];
  lemmas.forEach((lemma) => {
    const count = analysis?.repeatedWords.counter[lemma]!;
    if (count > 1) lemmasRepeatedMoreThanOnce.push(lemma);
  });

  const lemmasCount: Record<string, number> = {};
  lemmasRepeatedMoreThanOnce.forEach((lemma) => {
    lemmasCount[lemma] = analysis.repeatedWords.counter[lemma] ?? 0;
  });

  // Readability
  const fleschReadingEase = Math.round(analysis.readability.fleschReadingEase);
  const fleschReadingEaseDescription = getFleschReadingEaseDescription(fleschReadingEase)!;
  const fleschKincaidGradeLevel = Math.round(analysis.readability.fleschKincaidGradeLevel);
  const readability = { fleschReadingEase, fleschReadingEaseDescription, fleschKincaidGradeLevel };

  const stats = {
    totalSyllables: analysis.readability.totalSyllables,
    totalWords: analysis.readability.totalWords,
    totalSentences: analysis.readability.totalSentences,
    averageSyllablesPerWord: round2dp(analysis.readability.averageSyllablesPerWord),
    averageWordsPerSentence: round2dp(analysis.readability.averageWordsPerSentence),
  };

  return { repeatedWords: { lemmas, lemmasRepeatedMoreThanOnce, lemmasCount }, readability, stats };
}

interface ReadingEaseDescription {
  maxScore: number;
  schoolLevel: string;
  notes: string;
}
const fleschReadingEases: ReadingEaseDescription[] = [
  {
    maxScore: 10,
    schoolLevel: "Professional",
    notes: "Extremely difficult to read. Best understood by university graduates.",
  },
  {
    maxScore: 30,
    schoolLevel: "College graduate",
    notes: "Very difficult to read. Best understood by university graduates.",
  },
  {
    maxScore: 50,
    schoolLevel: "10th to 12th grade",
    notes: "Fairly difficult to read.",
  },
  {
    maxScore: 60,
    schoolLevel: "8th & 9th grade",
    notes: "Plain English. Easily understood by 13- to 15-year-old students.",
  },
  {
    maxScore: 70,
    schoolLevel: "7th grade",
    notes: "Fairly easy to read.",
  },
  {
    maxScore: 80,
    schoolLevel: "6th grade",
    notes: "Easy to read. Conversational English for consumers.",
  },
  {
    maxScore: 90,
    schoolLevel: "5th grade",
    notes: "Very easy to read. Easily understood by an average 11-year-old student.",
  },
  {
    maxScore: 100000,
    schoolLevel: "5th grade",
    notes: "Very easy to read. Easily understood by an average 11-year-old student.",
  },
];
function getFleschReadingEaseDescription(ease: number) {
  const description = fleschReadingEases.find((easeDescription) => {
    return ease < easeDescription.maxScore;
  });
  return description;
}
