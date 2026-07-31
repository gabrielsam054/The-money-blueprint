import { bookChunks as part1 } from "./book-content-part1";
import { bookChunksPart2 as part2 } from "./book-content-part2";
import { bookChunksPart3 as part3 } from "./book-content-part3";
import { bookChunksPart4 as part4 } from "./book-content-part4";
import type { BookChunk } from "./book-content-part1";

export type { BookChunk };

/** All 49 chapter chunks with real book content (Part IV, the business
 * idea library, has no chapters to chunk this way — it's a table, not
 * prose, and isn't included here). */
export const allBookChunks: BookChunk[] = [...part1, ...part2, ...part3, ...part4];
