import { readerChaptersPart1 } from "./reader-content-part1";
import { readerChaptersPart2 } from "./reader-content-part2";
import { readerChaptersPart3 } from "./reader-content-part3";
import { readerChaptersPart4 } from "./reader-content-part4";
import type { FullChapter } from "./reader-content-types";

export type { FullChapter };

/** The complete, real content of all 49 chapters — full prose, not the
 * condensed summaries used by the AI Coach in lib/book-content.ts.
 * This is what actually powers the in-app reader at
 * /dashboard/read/[chapter]. */
export const allReaderChapters: FullChapter[] = [
  ...readerChaptersPart1,
  ...readerChaptersPart2,
  ...readerChaptersPart3,
  ...readerChaptersPart4,
];

export function getChapterByNumber(num: number): FullChapter | undefined {
  return allReaderChapters.find((c) => c.num === num);
}
