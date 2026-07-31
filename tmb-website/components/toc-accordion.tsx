"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { parts } from "@/lib/book-data";
import { AccordionItem } from "@/components/ui/accordion";

export function TocAccordion() {
  const [query, setQuery] = useState("");

  const filteredParts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return parts;

    return parts
      .map((part) => {
        const partMatches = part.title.toLowerCase().includes(q);
        const matchingChapters = part.chapters.filter((c) =>
          c.title.toLowerCase().includes(q)
        );
        const matchingCategories = part.categories?.filter((c) =>
          c.toLowerCase().includes(q)
        );

        if (partMatches) return part;
        if (matchingChapters.length || matchingCategories?.length) {
          return {
            ...part,
            chapters: matchingChapters,
            categories: matchingCategories,
          };
        }
        return null;
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }, [query]);

  return (
    <div>
      <div className="relative mx-auto max-w-md">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-muted"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chapters, parts, or categories..."
          aria-label="Search table of contents"
          className="w-full rounded-full border border-surface-line bg-white py-3.5 pl-11 pr-5 text-sm text-slate-ink placeholder:text-slate-muted focus:border-emerald focus:outline-none"
        />
      </div>

      <div className="mt-12 space-y-4">
        {filteredParts.length === 0 && (
          <p className="text-center text-sm text-slate-muted">
            No matches for &ldquo;{query}&rdquo;.
          </p>
        )}

        {filteredParts.map((part) => (
          <div key={part.number} className="card !p-0 overflow-hidden">
            <AccordionItem
              className="border-b-0 px-6"
              defaultOpen={query.length > 0}
              trigger={
                <span className="flex items-center gap-4">
                  <span className="font-heading text-lg font-bold text-gold-600">
                    {String(part.number).padStart(2, "0")}
                  </span>
                  <span className="text-left">
                    <span className="block font-heading text-base font-semibold text-slate-ink">
                      Part {part.number} — {part.title}
                    </span>
                    <span className="text-xs text-slate-muted">
                      {part.categories
                        ? `${part.categories.length} categories`
                        : `${part.chapters.length} chapters`}
                    </span>
                  </span>
                </span>
              }
            >
              {part.categories ? (
                <ul className="grid gap-2 pl-14 sm:grid-cols-2">
                  {part.categories.map((cat) => (
                    <li
                      key={cat}
                      className="rounded-lg bg-surface-soft px-3 py-2 text-sm text-slate-body"
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-1 pl-14">
                  {part.chapters.map((chapter) => (
                    <li
                      key={chapter.number}
                      className="flex items-baseline gap-3 border-t border-surface-line py-2.5 first:border-t-0"
                    >
                      <span className="w-8 shrink-0 text-xs font-semibold text-slate-muted">
                        {String(chapter.number).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-slate-body">
                        {chapter.title}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </AccordionItem>
          </div>
        ))}
      </div>
    </div>
  );
}
