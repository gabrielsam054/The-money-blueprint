import { CheckCircle2 } from "lucide-react";
import { workbookTools } from "@/lib/book-data";

const highlights = [
  "A composite reader, Elena, followed from day one through year five so every principle is shown, not just told",
  "Every chapter ends with a Today / This Week / This Month / Next 90 Days action plan",
  "520 business ideas with real startup cost, time-to-income, and scaling ranges",
  "A 12-tool workbook appendix you'll return to long after a first read",
];

export function BookShowcase() {
  return (
    <section className="bg-surface-soft py-24">
      <div className="container-content grid gap-16 lg:grid-cols-2 lg:items-start">
        <div>
          <span className="eyebrow">Why This Book</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-slate-ink sm:text-4xl">
            Built to be used, not just read.
          </h2>
          <ul className="mt-8 space-y-5">
            {highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald" size={22} />
                <span className="text-slate-body">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-gold-600">
            The Appendix Workbook
          </p>
          <ul className="mt-5 divide-y divide-surface-line">
            {workbookTools.map((tool) => (
              <li
                key={tool.number}
                className="flex items-center justify-between gap-4 py-3"
              >
                <span className="text-sm text-slate-ink">
                  <span className="mr-2 text-slate-muted">
                    {String(tool.number).padStart(2, "0")}
                  </span>
                  {tool.title}
                </span>
                <span className="shrink-0 text-xs font-medium text-slate-muted">
                  {tool.tiedTo}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
