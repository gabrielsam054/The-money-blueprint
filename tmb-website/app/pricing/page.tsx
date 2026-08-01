import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/checkout-button";
import { BOOK_PRICE_GHS, MEMBERSHIP_PRICE_GHS } from "@/lib/paystack";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Get The Modern Money Blueprint — plus what's coming next.",
};

const included = [
  "Full 259-page manuscript, 10 parts, 49 chapters",
  "The complete 520-idea business library",
  "12-tool appendix workbook (trackers, templates, checklists)",
  "6 fillable Excel templates with working formulas",
  "AI Coach trained on this book's frameworks, not general ChatGPT",
  "Lifetime access to future edits of this edition",
];

const future = [
  {
    name: "Courses",
    desc: "Deep-dive video courses on the highest-leverage parts of the book.",
  },
];

export default function PricingPage() {
  return (
    <section className="py-20">
      <div className="container-content">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">Pricing</span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-slate-ink sm:text-5xl">
            Start with the book.
          </h1>
          <p className="mt-5 text-slate-body">
            Everything else on this page is what&apos;s coming next for
            readers who want more than the book alone.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-md">
          <div className="card border-2 border-emerald !p-8">
            <Badge>Available Now</Badge>
            <h2 className="mt-4 font-heading text-2xl font-bold text-slate-ink">
              The Modern Money Blueprint
            </h2>
            <p className="mt-2 text-sm text-slate-muted">
              Digital edition (PDF)
            </p>
            <p className="mt-6 font-heading text-4xl font-bold text-slate-ink">
              GHS {BOOK_PRICE_GHS}
            </p>
            <ul className="mt-6 space-y-3">
              {included.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-slate-body">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <CheckoutButton />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <div className="card !p-6 text-center">
            <Badge>Available Now</Badge>
            <h2 className="mt-3 font-heading text-lg font-semibold text-slate-ink">
              Membership
            </h2>
            <p className="mt-1 text-sm text-slate-muted">
              GHS {MEMBERSHIP_PRICE_GHS}/month
            </p>
            <Link
              href="/dashboard/membership"
              className="btn-secondary mt-4 inline-flex"
            >
              View Membership
            </Link>
          </div>
        </div>

        <div className="mt-24">
          <div className="mx-auto max-w-xl text-center">
            <span className="eyebrow inline-flex items-center gap-1.5">
              <Sparkles size={14} /> Coming Next
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-slate-ink">
              Built to grow past the book
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {future.map((f) => (
              <div key={f.name} className="card opacity-90">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold text-slate-ink">
                    {f.name}
                  </h3>
                  <Badge>Soon</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
