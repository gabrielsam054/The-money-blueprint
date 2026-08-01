"use client";

import { useWorksheetAutosave } from "@/lib/use-worksheet-autosave";
import { SaveStatusIndicator } from "@/components/save-status-indicator";

export type PromptField =
  | { type: "section"; label: string }
  | { type: "field"; key: string; label: string };

type PromptData = Record<string, string>;

export function PromptOnlineForm({
  slug,
  fields,
  initialResponses,
}: {
  slug: string;
  fields: PromptField[];
  initialResponses: Partial<PromptData>;
}) {
  const initial: PromptData = {};
  for (const f of fields) {
    if (f.type === "field") initial[f.key] = initialResponses[f.key] ?? "";
  }

  const { data, update, status } = useWorksheetAutosave(slug, initial);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <SaveStatusIndicator status={status} />
      </div>

      <div className="space-y-5">
        {fields.map((f, i) =>
          f.type === "section" ? (
            <p
              key={i}
              className="pt-2 font-heading text-sm font-semibold uppercase tracking-wide text-gold-600"
            >
              {f.label}
            </p>
          ) : (
            <div key={f.key}>
              <label className="text-sm font-semibold text-slate-ink">{f.label}</label>
              <textarea
                value={data[f.key] ?? ""}
                onChange={(e) =>
                  update((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
                rows={3}
                className="mt-1.5 w-full resize-y rounded-lg border border-surface-line px-3 py-2.5 text-sm focus:border-emerald focus:outline-none"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
