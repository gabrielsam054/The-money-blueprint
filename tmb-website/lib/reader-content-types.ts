export interface ChapterSection {
  h: string;
  text: string;
}

export interface ChapterCaseStudy {
  problem: string;
  decision: string;
  action: string;
  result: string;
  lesson: string;
}

export interface ChapterCompare {
  title: string | null;
  headers: [string, string];
  rows: [string, string][];
}

export interface ChapterMistake {
  mistake: string;
  why: string;
  danger: string;
  fix: string;
}

export interface FullChapter {
  num: number;
  title: string;
  hook: string;
  sections: ChapterSection[];
  personas: [string, string][] | null;
  caseStudy: ChapterCaseStudy | null;
  diagramTitle: string | null;
  diagram: string[] | null;
  compare: ChapterCompare | null;
  mistakes: ChapterMistake[];
  tip: string;
  summary: string;
  takeaways: string[];
}
