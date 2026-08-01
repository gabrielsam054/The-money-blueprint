import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Download, FileSpreadsheet, Lock, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/is-configured";
import { SupabaseNotConfiguredNotice } from "@/components/supabase-not-configured-notice";
import { downloadableTemplates } from "@/lib/templates-data";

export const metadata: Metadata = {
  title: "Templates",
  robots: { index: false, follow: false },
};

export default async function TemplatesPage() {
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
    redirect("/login?redirectTo=/dashboard/templates");
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
            Templates are included with the book
          </p>
          <p className="mt-2 text-sm text-slate-muted">
            Real, fillable Excel versions of six workbook tools — available
            once you&apos;ve purchased.
          </p>
          <Link href="/pricing" className="btn-primary mt-6 inline-flex">
            Get the Book <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container-content max-w-3xl">
        <div className="text-center">
          <span className="eyebrow">Fillable Excel Files</span>
          <h1 className="mt-2 font-heading text-3xl font-bold text-slate-ink">
            Templates
          </h1>
          <p className="mt-3 text-sm text-slate-muted">
            Real spreadsheets with working formulas — not just the static
            tables from the book&apos;s appendix.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {downloadableTemplates.map((t) => (
            <a
              key={t.slug}
              href={`/api/templates/${t.slug}`}
              className="card flex items-center justify-between gap-4 transition-shadow hover:shadow-lift"
            >
              <div className="flex items-center gap-4">
                <FileSpreadsheet className="shrink-0 text-emerald" size={24} />
                <div>
                  <p className="font-heading text-sm font-semibold text-slate-ink">
                    {t.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-muted">
                    {t.description}
                  </p>
                </div>
              </div>
              <Download className="shrink-0 text-slate-muted" size={18} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
