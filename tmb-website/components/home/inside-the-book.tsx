import Link from "next/link";
import { parts } from "@/lib/book-data";
import { ArrowRight } from "lucide-react";

export function InsideTheBook() {
  return (
    <section className="bg-white py-24">
      <div className="container-content">
        <div className="max-w-2xl">
          <span className="eyebrow">Inside the Book</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-slate-ink sm:text-4xl">
            Ten parts, in the order they actually need to happen.
          </h2>
          <p className="mt-4 text-slate-body">
            Each part is a prerequisite for the next — mindset before money,
            money before a business choice, a choice before a launch. Nothing
            here is meant to be read out of order.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {parts.map((part) => (
            <li
              key={part.number}
              className="card group relative flex flex-col justify-between transition-shadow hover:shadow-lift"
            >
              <div>
                <span className="font-heading text-3xl font-bold text-surface-line transition-colors group-hover:text-gold-200">
                  {String(part.number).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-heading text-lg font-semibold text-slate-ink">
                  {part.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-muted">
                  {part.description}
                </p>
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-emerald">
                {part.categories
                  ? `${part.categories.length} categories`
                  : `${part.chapters.length} chapters`}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Link
            href="/table-of-contents"
            className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-emerald hover:underline"
          >
            See the full table of contents <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
