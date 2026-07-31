import { AlertTriangle } from "lucide-react";

export function SupabaseNotConfiguredNotice() {
  return (
    <div className="card mx-auto max-w-md text-center">
      <AlertTriangle className="mx-auto text-gold" size={28} />
      <p className="mt-3 font-heading text-lg font-semibold text-slate-ink">
        Accounts aren't set up yet
      </p>
      <p className="mt-2 text-sm text-slate-muted">
        This site&apos;s owner hasn&apos;t connected a Supabase project yet
        — see{" "}
        <code className="rounded bg-surface-soft px-1.5 py-0.5 text-xs">
          docs/phase-2-roadmap.md
        </code>{" "}
        for setup steps.
      </p>
    </div>
  );
}
