import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Users, Lightbulb, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "About the Book",
  description:
    "What The Modern Money Blueprint covers, who it's for, and what you'll walk away able to do.",
};

const outcomes = [
  "Calculate your real financial stage and know exactly what to prioritize next",
  "Choose a business idea that fits your actual skills, time, and risk tolerance",
  "Validate demand before spending real money building anything",
  "Price, brand, and sell without guessing at what feels reasonable",
  "Run one marketing channel well instead of five channels thinly",
  "Use AI to execute faster without letting it replace your judgment",
  "Build a business that can survive a week without you",
  "Turn business income into long-term wealth with a sequenced investing plan",
];

export default function AboutTheBookPage() {
  return (
    <>
      <section className="bg-surface-soft py-20">
        <div className="container-content max-w-3xl">
          <span className="eyebrow">About the Book</span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-slate-ink sm:text-5xl">
            A complete system, not another motivational read.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-body">
            The Modern Money Blueprint combines money mindset, personal
            finance, business creation, marketing, AI-powered productivity,
            scaling, and long-term investing into one connected path — ten
            parts, each a prerequisite for the next.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-content grid gap-12 lg:grid-cols-2">
          <div className="card">
            <Target className="text-emerald" size={26} />
            <h2 className="mt-4 font-heading text-xl font-semibold text-slate-ink">
              Purpose
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-body">
              To replace vague financial motivation with a specific, sequenced
              set of actions — the same kind of clarity a good course or
              consultant would give you, in book form.
            </p>
          </div>
          <div className="card">
            <Users className="text-emerald" size={26} />
            <h2 className="mt-4 font-heading text-xl font-semibold text-slate-ink">
              Who It Helps
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-body">
              Anyone who wants multiple income streams and real wealth but
              doesn&apos;t have a business background yet — no prior
              experience assumed, no jargon left unexplained.
            </p>
          </div>
          <div className="card">
            <Lightbulb className="text-emerald" size={26} />
            <h2 className="mt-4 font-heading text-xl font-semibold text-slate-ink">
              Why It Was Written
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-body">
              Most personal finance books stop at budgeting; most business
              books skip the financial foundation. This one refuses to pick a
              lane, because in practice your money and your business decisions
              are never actually separate.
            </p>
          </div>
          <div className="card">
            <GraduationCap className="text-emerald" size={26} />
            <h2 className="mt-4 font-heading text-xl font-semibold text-slate-ink">
              How It's Structured
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-body">
              Every chapter follows the same premium format — a real opening
              story, a case study, common mistakes, a worksheet, a checklist,
              and a Today / This Week / This Month / Next 90 Days action plan.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-soft py-20">
        <div className="container-content max-w-2xl">
          <span className="eyebrow">Learning Outcomes</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-slate-ink">
            After reading, you'll be able to:
          </h2>
          <ul className="mt-8 space-y-4">
            {outcomes.map((o) => (
              <li key={o} className="flex gap-3 text-slate-body">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {o}
              </li>
            ))}
          </ul>
          <Link href="/pricing" className="btn-primary mt-10">
            Get the Book <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
