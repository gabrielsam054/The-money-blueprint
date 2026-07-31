import Link from "next/link";
import { Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

const columns = [
  {
    heading: "The Book",
    links: [
      { href: "/about-the-book", label: "About the Book" },
      { href: "/table-of-contents", label: "Table of Contents" },
      { href: "/read-a-sample", label: "Read a Sample" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    heading: "More",
    links: [
      { href: "/about-gabriel-sam", label: "About Gabriel Sam" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-surface-line bg-slate-ink text-white/70">
      <div className="container-content grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-heading text-lg font-bold text-white">
            The Modern Money Blueprint
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            Build wealth through side hustles, business, investing & AI — a
            complete, practical system across 10 parts and 49 chapters.
          </p>
          <div className="mt-6 flex gap-4">
            {[Instagram, Twitter, Youtube, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="rounded-full border border-white/15 p-2 transition-colors hover:border-gold hover:text-gold-200"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.heading}>
            <p className="font-heading text-sm font-semibold text-white">
              {col.heading}
            </p>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors hover:text-gold-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-content flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Gabriel Sam. All rights reserved.</p>
          <p>
            Educational content only — not financial, legal, or professional
            advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
