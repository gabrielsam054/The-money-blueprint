import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical notes on money, business, marketing, AI, investing, and entrepreneurship.",
};

export default function BlogIndexPage() {
  return (
    <section className="py-20">
      <div className="container-content">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">The Blog</span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-slate-ink sm:text-5xl">
            Money, business, marketing, AI, investing, entrepreneurship
          </h1>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card group flex flex-col justify-between transition-shadow hover:shadow-lift"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                  {post.category}
                </span>
                <h2 className="mt-3 font-heading text-lg font-semibold text-slate-ink group-hover:text-emerald">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-muted">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-slate-muted">
                <span>{post.readTime}</span>
                <ArrowRight
                  size={16}
                  className="text-emerald opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
