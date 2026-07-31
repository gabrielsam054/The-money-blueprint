import type { Metadata } from "next";
import { TocAccordion } from "@/components/toc-accordion";

export const metadata: Metadata = {
  title: "Table of Contents",
  description:
    "The complete table of contents for The Modern Money Blueprint — 10 parts, 49 chapters, and the 520-idea business library.",
};

export default function TableOfContentsPage() {
  return (
    <section className="py-20">
      <div className="container-content max-w-3xl">
        <div className="text-center">
          <span className="eyebrow">The Full Map</span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-slate-ink sm:text-5xl">
            Table of Contents
          </h1>
          <p className="mt-5 text-slate-body">
            Every part, in order. Search for a specific chapter or business
            category, or expand each part to see what's inside.
          </p>
        </div>

        <div className="mt-14">
          <TocAccordion />
        </div>
      </div>
    </section>
  );
}
