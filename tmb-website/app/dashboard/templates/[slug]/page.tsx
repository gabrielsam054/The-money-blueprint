import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, ArrowRight, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/is-configured";
import { SupabaseNotConfiguredNotice } from "@/components/supabase-not-configured-notice";
import { downloadableTemplates } from "@/lib/templates-data";
import { DownloadButton } from "@/components/download-button";
import { NetWorthOnlineForm } from "@/components/worksheets/net-worth-online-form";
import { BudgetOnlineForm } from "@/components/worksheets/budget-online-form";
import { GoalTrackerOnlineForm } from "@/components/worksheets/goal-tracker-online-form";
import { PromptOnlineForm } from "@/components/worksheets/prompt-online-form";
import {
  sideHustlePlannerFields,
  businessPlanFields,
  weeklyCeoPlannerFields,
} from "@/lib/worksheet-prompts";

export function generateStaticParams() {
  return downloadableTemplates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = downloadableTemplates.find((x) => x.slug === slug);
  return { title: t?.title ?? "Template", robots: { index: false, follow: false } };
}

export default async function OnlineTemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = downloadableTemplates.find((t) => t.slug === slug);
  if (!template) {
    notFound();
    return null;
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
    redirect(`/login?redirectTo=/dashboard/templates/${slug}`);
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
          <Link href="/pricing" className="btn-primary mt-6 inline-flex">
            Get the Book <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  const { data: saved } = await supabase
    .from("worksheet_responses")
    .select("responses")
    .eq("user_id", user.id)
    .eq("worksheet_slug", slug)
    .maybeSingle();

  const initialResponses = (saved?.responses as Record<string, unknown>) ?? {};

  function renderForm() {
    switch (slug) {
      case "net-worth-tracker":
        return <NetWorthOnlineForm initialResponses={initialResponses} />;
      case "monthly-budget-template":
        return <BudgetOnlineForm initialResponses={initialResponses} />;
      case "goal-tracker":
        return <GoalTrackerOnlineForm initialResponses={initialResponses} />;
      case "side-hustle-planner":
        return (
          <PromptOnlineForm
            slug={slug}
            fields={sideHustlePlannerFields}
            initialResponses={initialResponses as Record<string, string>}
          />
        );
      case "business-plan-template":
        return (
          <PromptOnlineForm
            slug={slug}
            fields={businessPlanFields}
            initialResponses={initialResponses as Record<string, string>}
          />
        );
      case "weekly-ceo-planner":
        return (
          <PromptOnlineForm
            slug={slug}
            fields={weeklyCeoPlannerFields}
            initialResponses={initialResponses as Record<string, string>}
          />
        );
      default:
        return null;
    }
  }

  return (
    <section className="py-12">
      <div className="container-content max-w-3xl">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/templates"
            className="flex items-center gap-2 text-sm font-medium text-slate-muted hover:text-emerald"
          >
            <ArrowLeft size={16} /> All Templates
          </Link>
          <DownloadButton
            href={`/api/templates/${slug}`}
            className="flex items-center gap-2 rounded-full border border-surface-line px-4 py-2 text-xs font-semibold text-slate-ink transition-colors hover:border-emerald hover:text-emerald disabled:opacity-60"
          >
            <Download size={14} /> Download Excel
          </DownloadButton>
        </div>

        <h1 className="mt-6 font-heading text-3xl font-bold text-slate-ink">
          {template.title}
        </h1>
        <p className="mt-2 text-sm text-slate-muted">{template.description}</p>

        <div className="mt-8">{renderForm()}</div>
      </div>
    </section>
  );
}
