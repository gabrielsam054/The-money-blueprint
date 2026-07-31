import type { Metadata } from "next";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Read a Sample",
  description:
    "Read the introduction and Chapter 1 of The Modern Money Blueprint for free.",
};

export default function ReadSamplePage() {
  return (
    <section className="py-20">
      <div className="container-content max-w-2xl">
        <div className="text-center">
          <span className="eyebrow">Free Sample</span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-slate-ink sm:text-5xl">
            About This Book &amp; Chapter One
          </h1>
        </div>

        <article className="prose-content mt-14 space-y-6 text-slate-body">
          <h2 className="font-heading text-2xl font-bold text-slate-ink">
            About This Book
          </h2>
          <p>
            The Modern Money Blueprint is a complete, practical system for
            building income and wealth in the current economy — combining
            money mindset, personal finance, business creation, marketing,
            AI-powered productivity, scaling, and long-term investing into one
            connected path.
          </p>
          <p>
            Each part builds on the ones before it. Parts I and II build the
            mindset and money systems everything else assumes are in place.
            Parts III and IV help you choose a business that actually fits
            you, from a library of 520 options. Part V through VIII take that
            choice from launch through scale. Part IX turns business income
            into long-term wealth. Part X ties the whole book into a single
            30-day, 90-day, one-year, and five-year plan.
          </p>

          <div className="!mt-12 h-px bg-surface-line" />

          <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            Chapter 1
          </p>
          <h2 className="!mt-2 font-heading text-2xl font-bold text-slate-ink">
            Wealth vs. Income
          </h2>

          <blockquote className="border-l-4 border-gold-200 bg-surface-soft py-4 pl-6 pr-4 italic text-slate-ink">
            Maria and Daniel started their careers the same month, at the same
            company, earning the same $58,000 salary. Twelve years later,
            Maria owns her condo outright and has built a $180,000 investment
            portfolio. Daniel, after three promotions and a salary now above
            $95,000, still carries credit card debt and has less than $3,000
            saved. The gap between them was never about how much they earned.
            It was about what happened to the money after it arrived.
          </blockquote>

          <h3 className="font-heading text-lg font-semibold text-slate-ink">
            Two Different Games
          </h3>
          <p>
            Income is what arrives. Wealth is what stays. Someone earning
            $250,000 a year who spends $249,000 of it is not wealthy —
            they&apos;re on a treadmill with a higher speed setting than most.
            Someone earning $60,000 who consistently keeps and grows 20% of it
            is quietly building an asset base that will eventually work
            independently of their effort. Income is a number on a pay stub.
            Wealth is a number on a balance sheet: what you own minus what you
            owe.
          </p>
          <p>
            Once you&apos;re optimizing for wealth instead of income, your
            decisions change. You stop asking &ldquo;how do I make more
            money&rdquo; as the only question and start asking &ldquo;how do I
            convert money into assets that produce more money.&rdquo; A side
            hustle, a business, or an investment all become tools for that
            conversion — not just ways to boost this month&apos;s income.
          </p>
        </article>

        <div className="relative mt-12 overflow-hidden rounded-xl2 border border-surface-line">
          <div className="pointer-events-none select-none space-y-4 p-8 opacity-40 blur-[2px]">
            <div className="h-4 w-3/4 rounded bg-slate-body/30" />
            <div className="h-4 w-full rounded bg-slate-body/30" />
            <div className="h-4 w-5/6 rounded bg-slate-body/30" />
            <div className="h-4 w-2/3 rounded bg-slate-body/30" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/70 px-6 text-center backdrop-blur-sm">
            <Lock className="text-emerald" size={28} />
            <p className="font-heading text-lg font-semibold text-slate-ink">
              48 chapters, 520 business ideas, and the full workbook are in
              the complete book.
            </p>
            <Link href="/pricing" className="btn-primary">
              Get the Full Book <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
