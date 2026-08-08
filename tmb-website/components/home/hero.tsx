import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BOOK_PRICE_USD_DISPLAY } from "@/lib/paystack";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-soft">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-50 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-40 h-72 w-72 rounded-full bg-gold-50 blur-3xl" />

      <div className="container-content relative grid gap-16 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div className="animate-fade-up">
          <span className="eyebrow">A Complete Wealth-Building System</span>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.08] text-slate-ink sm:text-5xl lg:text-6xl">
            Master Your Money. Build{" "}
            <span className="text-emerald">Multiple Income Streams</span>.
            Create <span className="text-gold-600">Lasting Wealth</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-body">
            A complete, sequenced system — money mindset, a business that
            actually fits you, marketing, AI, and investing — across ten
            parts and 520 business ideas. Not motivation. A path.
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
            By <span className="font-semibold text-slate-ink">Gabriel Sam</span> — 259 pages, ready today. ${BOOK_PRICE_USD_DISPLAY}.
          </p>
        </div>

        {/* 3D hardcover mockup — pure CSS: a rotated cover, a visible
            spine, and stacked page-edge lines to fake real depth,
            rather than a flat gradient card. */}
        <div className="relative animate-fade-up [animation-delay:150ms]">
          <div
            className="mx-auto w-full max-w-xs"
            style={{ perspective: "1400px" }}
          >
            <div
              className="relative aspect-[3/4]"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateY(-28deg) rotateX(3deg)",
              }}
            >
              {/* Page edges — thin stacked lines suggesting paper depth */}
              <div
                className="absolute inset-y-1 right-0 w-6 rounded-r-sm"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, #f4f1e8 0px, #e8e4d6 1.5px, #f4f1e8 3px)",
                  transform: "translateZ(-14px) translateX(6px)",
                  boxShadow: "2px 0 6px rgba(0,0,0,0.15)",
                }}
              />

              {/* Spine — dark strip along the left edge */}
              <div
                className="absolute inset-y-0 left-0 w-7 rounded-l-sm bg-gradient-to-b from-emerald-900 to-emerald-700"
                style={{
                  transform: "rotateY(90deg) translateZ(-14px) translateX(-14px)",
                  transformOrigin: "left",
                }}
              />

              {/* Front cover */}
              <div
                className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-r-md rounded-l-[2px] bg-gradient-to-br from-emerald-700 via-emerald to-emerald-600 p-7"
                style={{
                  boxShadow:
                    "24px 28px 45px -18px rgba(6,39,32,0.55), 0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25" />
                <div className="relative">
                  <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-200">
                    Build Wealth Through Side Hustles, Business, Investing &amp; AI
                  </p>
                  <h2 className="mt-5 font-heading text-2xl font-bold leading-tight text-white sm:text-3xl">
                    The Modern Money Blueprint
                  </h2>
                </div>
                <div className="relative">
                  <div className="h-px w-12 bg-gold-200" />
                  <p className="mt-3 font-heading text-sm font-semibold tracking-wide text-white">
                    Gabriel Sam
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Soft ground shadow beneath the angled book */}
          <div
            className="mx-auto mt-2 h-6 max-w-[200px] rounded-full opacity-40 blur-xl"
            style={{ background: "radial-gradient(ellipse, #062720, transparent 70%)" }}
          />
        </div>
      </div>
    </section>
  );
}
