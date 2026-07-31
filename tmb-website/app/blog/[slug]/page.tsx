import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) return {};
    return { title: post.title, description: post.excerpt };
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="py-20">
      <div className="container-content max-w-2xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-muted hover:text-emerald"
        >
          <ArrowLeft size={16} /> Back to blog
        </Link>

        <span className="mt-8 block text-xs font-semibold uppercase tracking-wide text-gold-600">
          {post.category}
        </span>
        <h1 className="mt-3 font-heading text-3xl font-bold text-slate-ink sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-slate-muted">
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}{" "}
          · {post.readTime}
        </p>

        <div className="prose-content mt-10 space-y-5 text-slate-body">
          {post.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-14 card flex flex-col items-center gap-3 text-center">
          <p className="font-heading text-lg font-semibold text-slate-ink">
            This is one idea from The Modern Money Blueprint
          </p>
          <p className="text-sm text-slate-muted">
            49 chapters, 520 business ideas, and a full workbook are waiting.
          </p>
          <Link href="/pricing" className="btn-primary mt-2">
            Get the Book <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
