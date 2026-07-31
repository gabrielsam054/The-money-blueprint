"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/about-the-book", label: "About the Book" },
  { href: "/table-of-contents", label: "Table of Contents" },
  { href: "/read-a-sample", label: "Read a Sample" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about-gabriel-sam", label: "Author" },
  { href: "/blog", label: "Blog" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-surface-line bg-white/90 backdrop-blur-md"
          : "border-b border-transparent bg-white/0"
      )}
    >
      <nav className="container-content flex h-20 items-center justify-between">
        <Link href="/" className="font-heading text-lg font-bold text-slate-ink">
          The Modern Money{" "}
          <span className="text-emerald">Blueprint</span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-medium text-slate-body transition-colors hover:text-emerald"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Link href="/pricing" className="btn-primary">
            Get the Book
          </Link>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2 text-slate-ink lg:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-surface-line bg-white lg:hidden">
          <ul className="container-content flex flex-col gap-1 py-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-ink hover:bg-surface-soft"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/pricing" className="btn-primary w-full" onClick={() => setOpen(false)}>
                Get the Book
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
