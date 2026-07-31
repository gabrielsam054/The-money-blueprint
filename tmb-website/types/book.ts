export interface Chapter {
  number: number;
  title: string;
}

export interface Part {
  number: number; // roman-friendly ordinal, 1-10
  title: string;
  description: string;
  chapters: Chapter[];
  /** Only Part IV uses categories instead of chapters */
  categories?: string[];
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface WorkbookTool {
  number: number;
  title: string;
  tiedTo: string;
}
