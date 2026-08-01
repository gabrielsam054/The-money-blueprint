import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, ArrowRightCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/is-configured";
import { SupabaseNotConfiguredNotice } from "@/components/supabase-not-configured-notice";
import { getChapterByNumber, allReaderChapters } from "@/lib/reader-content";
import { MarkAsReadButton } from "@/components/mark-as-read-button";

export function generateStaticParams() {
  return allReaderChapters.map((c) => ({ chapter: String(c.num) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter } = await params;
  const ch = getChapterByNumber(Number(chapter));
  return {
    title: ch ? `Chapter ${ch.num}: ${ch.title}` : "Chapter",
    robots: { index: false, follow: false },
  };
}

export default async function ReadChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: chapterParam } = await params;
  const chapterNum = Number(chapterParam);
  const chapter = getChapterByNumber(chapterNum);
  if (!chapter) {
    notFound();
    return null; // guarantees TS narrows `chapter` below regardless of
    // whether notFound()'s return type resolves to `never` in a given
    // environment — costs nothing, removes any doubt either way.
  }

  if (!supabaseConfigured) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center py-20">
        <SupabaseNotConfiguredNotice />
      </section>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirectTo=/dashboard/read/${chapterNum}`);
  }

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "success")
    .limit(1)
    .maybeSingle();

  if (!purchase) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center py-20">
        <div className="card mx-auto max-w-md text-center">
          <Lock className="mx-auto text-emerald" size={28} />
          <p className="mt-3 font-heading text-lg font-semibold text-slate-ink">
            This chapter is available after you purchase
          </p>
          <Link href="/pricing" className="btn-primary mt-6 inline-flex">
            Get the Book <ArrowRightCircle size={16} />
          </Link>
        </div>
      </section>
    );
  }

  const { data: progressRow } = await supabase
    .from("reading_progress")
    .select("chapter_number")
    .eq("user_id", user.id)
    .eq("chapter_number", chapterNum)
    .maybeSingle();

  const prevChapter = allReaderChapters.find((c) => c.num === chapterNum - 1);
  const nextChapter = allReaderChapters.find((c) => c.num === chapterNum + 1);

  return (
    <article className="py-12">
      <div className="container-content max-w-2xl">
        <div className="flex items-center justify-between">
          <Link
            href="/table-of-contents"
            className="flex items-center gap-2 text-sm font-medium text-slate-muted hover:text-emerald"
          >
            <ArrowLeft size={16} /> Table of Contents
          </Link>
          <MarkAsReadButton chapterNumber={chapterNum} initiallyRead={!!progressRow} />
        </div>

        <p className="mt-8 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
          Chapter {chapter.num}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-slate-ink sm:text-4xl">
          {chapter.title}
        </h1>

        <blockquote className="mt-8 border-y-2 border-gold-200 py-5 text-lg italic leading-relaxed text-slate-ink">
          {chapter.hook}
        </blockquote>

        <div className="mt-8 space-y-6">
          {chapter.sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-heading text-lg font-semibold text-gold-600">
                {s.h}
              </h2>
              <p className="mt-2 leading-relaxed text-slate-body">{s.text}</p>
            </div>
          ))}
        </div>

        {chapter.personas && (
          <div className="mt-10">
            <h2 className="font-heading text-base font-semibold text-slate-ink">
              Real-World Examples
            </h2>
            <div className="mt-3 divide-y divide-surface-line rounded-xl2 border border-surface-line">
              {chapter.personas.map(([who, applies], i) => (
                <div key={i} className="p-4">
                  <p className="font-heading text-sm font-semibold text-slate-ink">
                    {who}
                  </p>
                  <p className="mt-1 text-sm text-slate-muted">{applies}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {chapter.caseStudy && (
          <div className="mt-10 rounded-xl2 bg-surface-soft p-6">
            <p className="font-heading text-xs font-semibold uppercase tracking-wide text-gold-600">
              Case Study
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <p><strong className="text-slate-ink">Problem:</strong> <span className="text-slate-body">{chapter.caseStudy.problem}</span></p>
              <p><strong className="text-slate-ink">Decision:</strong> <span className="text-slate-body">{chapter.caseStudy.decision}</span></p>
              <p><strong className="text-slate-ink">Action:</strong> <span className="text-slate-body">{chapter.caseStudy.action}</span></p>
              <p><strong className="text-slate-ink">Result:</strong> <span className="text-slate-body">{chapter.caseStudy.result}</span></p>
              <p className="italic"><strong className="not-italic text-slate-ink">Lesson:</strong> <span className="text-slate-body">{chapter.caseStudy.lesson}</span></p>
            </div>
          </div>
        )}

        {chapter.diagram && (
          <div className="mt-10 rounded-xl2 border border-surface-line p-6 text-center">
            {chapter.diagramTitle && (
              <p className="mb-4 font-heading text-sm font-semibold text-gold-600">
                {chapter.diagramTitle}
              </p>
            )}
            {chapter.diagram.map((line, i) => (
              <p
                key={i}
                className={
                  i % 2 === 0
                    ? "font-heading text-sm font-bold text-emerald"
                    : "text-xs text-gold-600"
                }
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {chapter.compare && (
          <div className="mt-10 overflow-hidden rounded-xl2 border border-surface-line">
            {chapter.compare.title && (
              <p className="bg-surface-soft px-4 py-2 font-heading text-sm font-semibold text-slate-ink">
                {chapter.compare.title}
              </p>
            )}
            <div className="grid grid-cols-2 bg-gold text-white">
              <p className="p-3 font-heading text-xs font-semibold">{chapter.compare.headers[0]}</p>
              <p className="p-3 font-heading text-xs font-semibold">{chapter.compare.headers[1]}</p>
            </div>
            {chapter.compare.rows.map((row, i) => (
              <div key={i} className="grid grid-cols-2 border-t border-surface-line text-sm">
                <p className="p-3 text-slate-body">{row[0]}</p>
                <p className="p-3 text-slate-body">{row[1]}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10">
          <h2 className="font-heading text-base font-semibold text-error">
            Common Mistakes to Avoid
          </h2>
          <div className="mt-3 space-y-5">
            {chapter.mistakes.map((m, i) => (
              <div key={i}>
                <p className="font-heading text-sm font-semibold text-slate-ink">
                  {i + 1}. {m.mistake}
                </p>
                <p className="mt-1 text-sm text-slate-body">
                  <strong>Why it happens:</strong> {m.why}
                </p>
                <p className="mt-1 text-sm text-slate-body">
                  <strong>Why it&apos;s dangerous:</strong> {m.danger}
                </p>
                <p className="mt-1 text-sm text-emerald">
                  <strong>How to avoid it:</strong> {m.fix}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-xl2 border-l-4 border-gold bg-gold-50 p-5">
          <p className="text-sm italic text-slate-ink">
            <strong className="not-italic text-gold-600">EXPERT INSIGHT — </strong>
            {chapter.tip}
          </p>
        </div>

        <div className="mt-10 rounded-xl2 bg-surface-soft p-5">
          <p className="font-heading text-xs font-semibold uppercase tracking-wide text-emerald">
            Chapter Summary
          </p>
          <p className="mt-2 text-sm text-slate-body">{chapter.summary}</p>
        </div>

        <div className="mt-6 rounded-xl2 bg-surface-soft p-5">
          <p className="font-heading text-xs font-semibold uppercase tracking-wide text-emerald">
            Key Takeaways
          </p>
          <ul className="mt-2 space-y-1.5">
            {chapter.takeaways.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-body">
                <span className="text-emerald">✓</span> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 flex items-center justify-between border-t border-surface-line pt-6">
          {prevChapter ? (
            <Link
              href={`/dashboard/read/${prevChapter.num}`}
              className="flex items-center gap-2 text-sm font-medium text-slate-ink hover:text-emerald"
            >
              <ArrowLeft size={16} /> Ch. {prevChapter.num}: {prevChapter.title}
            </Link>
          ) : (
            <span />
          )}
          {nextChapter && (
            <Link
              href={`/dashboard/read/${nextChapter.num}`}
              className="flex items-center gap-2 text-right text-sm font-medium text-slate-ink hover:text-emerald"
            >
              Ch. {nextChapter.num}: {nextChapter.title} <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
