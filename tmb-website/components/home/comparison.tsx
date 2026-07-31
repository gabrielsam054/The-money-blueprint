import { Check, X } from "lucide-react";

const rows = [
  { feature: "A specific next action, not just motivation", others: false, us: true },
  { feature: "A categorized library of real business ideas", others: false, us: true },
  { feature: "Investing explained without vague hype or hidden pitches", others: false, us: true },
  { feature: "Practical AI workflows, not just AI hype", others: false, us: true },
  { feature: "A workbook you actually fill in, not just read", others: false, us: true },
  { feature: "One connected system from mindset to investing", others: false, us: true },
];

export function Comparison() {
  return (
    <section className="bg-white py-24">
      <div className="container-content">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Why It's Different</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-slate-ink sm:text-4xl">
            Most books pick one lane. This one connects all of them.
          </h2>
        </div>

        <div className="mt-14 overflow-hidden rounded-xl2 border border-surface-line">
          <div className="grid grid-cols-[1fr_auto_auto] items-center bg-surface-soft px-6 py-4 sm:px-8">
            <span className="font-heading text-sm font-semibold text-slate-ink">
              What matters
            </span>
            <span className="w-24 text-center text-sm font-medium text-slate-muted">
              Typical Books
            </span>
            <span className="w-24 text-center font-heading text-sm font-semibold text-emerald">
              This Book
            </span>
          </div>
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_auto_auto] items-center px-6 py-5 sm:px-8 ${
                i % 2 === 1 ? "bg-surface-soft/50" : ""
              }`}
            >
              <span className="pr-4 text-sm text-slate-body">{row.feature}</span>
              <span className="flex w-24 justify-center">
                <X size={18} className="text-slate-muted/50" />
              </span>
              <span className="flex w-24 justify-center">
                <Check size={18} className="text-emerald" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
