import { Check, Sparkles } from "lucide-react";
import { CheckoutButton } from "@/components/checkout-button";
import { BOOK_PRICE_USD_DISPLAY } from "@/lib/paystack";

const included = [
  "Full 259-page digital edition (PDF)",
  "The complete 520-idea business library",
  "12-tool appendix workbook — 6 fillable online with auto-save",
  "AI Coach trained on this book's frameworks, not general ChatGPT",
];

export function InstantAccess() {
  return (
    <section className="bg-white py-24">
      <div className="container-content">
        <div className="mx-auto max-w-lg overflow-hidden rounded-xl2 border-2 border-emerald shadow-lift">
          <div className="flex items-center gap-2 bg-emerald px-6 py-3">
            <Sparkles size={16} className="text-gold-200" />
            <p className="font-heading text-xs font-semibold uppercase tracking-wide text-white">
              Launch Edition — Lifetime Updates Included
            </p>
          </div>

          <div className="p-8 text-center">
            <span className="eyebrow">Get Instant Access</span>
            <h2 className="mt-2 font-heading text-2xl font-bold text-slate-ink">
              The Modern Money Blueprint
            </h2>
            <p className="mt-5 font-heading text-4xl font-bold text-slate-ink">
              ${BOOK_PRICE_USD_DISPLAY}
            </p>
            <p className="mt-1 text-xs text-slate-muted">
              One-time payment. No subscription required for the book itself.
            </p>

            <ul className="mt-6 space-y-2.5 text-left">
              {included.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-slate-body">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <CheckoutButton />
            </div>
            <p className="mt-3 text-xs text-slate-muted">
              Buying during the launch edition locks in free updates to this
              book for life — future revisions won&apos;t cost extra.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
