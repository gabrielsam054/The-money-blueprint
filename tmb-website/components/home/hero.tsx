import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-soft">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-50 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-40 h-72 w-72 rounded-full bg-gold-50 blur-3xl" />

      <div className="container-content relative grid gap-16 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div className="animate-fade-up">
          <span className="eyebrow">A Complete Wealth-Building System</span>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.08] text-slate-ink sm:text-5xl lg:text-6xl">
            Build wealth through side hustles, business,{" "}
            <span className="text-emerald">investing</span> &{" "}
            <span className="text-gold-600">AI</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-body">
            Ten parts. Forty-nine chapters. 520 business ideas. One sequenced
            path from money mindset to a business that runs — and pays —
            without you standing over it.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link href="/pricing" className="btn-primary">
              Get the Book <ArrowRight size={16} />
            </Link>
            <Link href="/read-a-sample" className="btn-secondary">
              <BookOpen size={16} /> Read a Free Sample
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-muted">
            By <span className="font-semibold text-slate-ink">Gabriel Sam</span> — 259 pages, ready today.
          </p>
        </div>

        <div className="relative animate-fade-up [animation-delay:150ms]">
          <div className="mx-auto flex aspect-[3/4] w-full max-w-sm items-center justify-center rounded-xl2 bg-gradient-to-br from-emerald-700 via-emerald to-emerald-600 p-8 shadow-lift">
            <div className="flex h-full w-full flex-col justify-between rounded-lg border border-white/15 p-6 text-white">
              <div>
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold-200">
                  Build Wealth Through Side Hustles, Business, Investing &amp; AI
                </p>
                <h2 className="mt-6 font-heading text-3xl font-bold leading-tight">
                  The Modern Money Blueprint
                </h2>
              </div>
              <div className="h-px w-12 bg-gold-200" />
              <p className="font-heading text-sm font-semibold tracking-wide">
                Gabriel Sam
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
