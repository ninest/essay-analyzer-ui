export interface EssayAnalysis {
  repeatedWords: {
    counter: Record<string, number>;
    lemmas: Record<string, string[]>;
  };
  readability: {
    totalSyllables: number;
    totalWords: number;
    totalSentences: number;
    averageSyllablesPerWord: number;
    averageWordsPerSentence: number;
    fleschReadingEase: number;
    fleschKincaidGradeLevel: number;
  };
}
