import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Gabriel Sam",
  description:
    "The mission, story, and vision behind The Modern Money Blueprint.",
};

export default function AboutAuthorPage() {
  return (
    <section className="py-20">
      <div className="container-content grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <div className="aspect-square w-full rounded-xl2 bg-gradient-to-br from-emerald-50 to-gold-50" />
        </div>

        <div className="max-w-2xl">
          <span className="eyebrow">The Author</span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-slate-ink sm:text-5xl">
            Gabriel Sam
          </h1>

          <div className="mt-8 space-y-5 text-slate-body">
            <p>
              Gabriel writes for people who want a specific next step, not
              another motivational chapter. The Modern Money Blueprint exists
              because most financial and business advice stops at inspiration
              — it tells you to budget, to start a business, to invest early
              — without ever connecting the three or telling you which one to
              do first.
            </p>
            <p>
              <span className="font-heading font-semibold text-slate-ink">
                Mission.
              </span>{" "}
              Replace vague financial motivation with a sequenced, specific
              system — the kind of clarity a good consultant would give you,
              made available as a book anyone can pick up.
            </p>
            <p>
              <span className="font-heading font-semibold text-slate-ink">
                Story.
              </span>{" "}
              Written after watching too many capable people stay stuck — not
              from lack of effort, but from lack of a clear next action. The
              Modern Money Blueprint is the resource built to close that gap,
              chapter by chapter.
            </p>
            <p>
              <span className="font-heading font-semibold text-slate-ink">
                Vision.
              </span>{" "}
              The book is the foundation. What&apos;s next — a membership
              community, an AI coach trained specifically on the book&apos;s
              frameworks, and deep-dive courses — is built to extend the same
              system, not replace it.
            </p>
          </div>

          <Link href="/pricing" className="btn-primary mt-10">
            Get the Book <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
