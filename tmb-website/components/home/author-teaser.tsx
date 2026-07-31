import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AuthorTeaser() {
  return (
    <section className="bg-white py-24">
      <div className="container-content grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="mx-auto aspect-square w-full max-w-xs rounded-full bg-gradient-to-br from-emerald-50 to-gold-50" />
        <div>
          <span className="eyebrow">The Author</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-slate-ink sm:text-4xl">
            Gabriel Sam
          </h2>
          <p className="mt-5 max-w-xl text-slate-body">
            Gabriel writes for people who want a specific next step, not
            another motivational chapter. The Modern Money Blueprint is built
            the way he wishes a book had been handed to him earlier —
            sequenced, practical, and honest about what actually moves the
            needle.
          </p>
          <Link
            href="/about-gabriel-sam"
            className="mt-6 inline-flex items-center gap-2 font-heading text-sm font-semibold text-emerald hover:underline"
          >
            More about Gabriel <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
