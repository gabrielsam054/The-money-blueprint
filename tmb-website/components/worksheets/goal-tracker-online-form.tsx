"use client";

import { Plus, Trash2 } from "lucide-react";
import { useWorksheetAutosave } from "@/lib/use-worksheet-autosave";
import { SaveStatusIndicator } from "@/components/save-status-indicator";

interface GoalRow {
  goal: string;
  number: string;
  deadline: string;
  nextAction: string;
  status: string;
}
type GoalTrackerData = {
  rows: GoalRow[];
} & Record<string, unknown>;

const EMPTY_ROW: GoalRow = { goal: "", number: "", deadline: "", nextAction: "", status: "Not Started" };

export function GoalTrackerOnlineForm({
  initialResponses,
}: {
  initialResponses: Partial<GoalTrackerData>;
}) {
  const initial: GoalTrackerData = {
    rows: initialResponses.rows?.length ? initialResponses.rows : [{ ...EMPTY_ROW }],
  };

  const { data, update, status } = useWorksheetAutosave("goal-tracker", initial);

  function updateRow(index: number, field: keyof GoalRow, value: string) {
    update((prev) => {
      const rows = [...prev.rows];
      const current = rows[index];
      if (!current) return prev;
      rows[index] = { ...current, [field]: value };
      return { rows };
    });
  }

  function addRow() {
    update((prev) => ({ rows: [...prev.rows, { ...EMPTY_ROW }] }));
  }

  function removeRow(index: number) {
    update((prev) => ({ rows: prev.rows.filter((_, i) => i !== index) }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-muted">
          Every goal needs a number, a deadline, and a next action.
        </p>
        <SaveStatusIndicator status={status} />
      </div>

      <div className="mt-4 space-y-3">
        {data.rows.map((row, i) => (
          <div key={i} className="card relative grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => removeRow(i)}
              aria-label="Remove goal"
              className="absolute right-3 top-3 text-slate-muted hover:text-error"
            >
              <Trash2 size={15} />
            </button>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-muted">Goal</label>
              <input
                value={row.goal}
                onChange={(e) => updateRow(i, "goal", e.target.value)}
                placeholder="e.g. Build a starter emergency fund"
                className="mt-1 w-full rounded-lg border border-surface-line px-3 py-2 text-sm focus:border-emerald focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-muted">Number</label>
              <input
                value={row.number}
                onChange={(e) => updateRow(i, "number", e.target.value)}
                placeholder="e.g. $500"
                className="mt-1 w-full rounded-lg border border-surface-line px-3 py-2 text-sm focus:border-emerald focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-muted">Deadline</label>
              <input
                value={row.deadline}
                onChange={(e) => updateRow(i, "deadline", e.target.value)}
                placeholder="e.g. 3 months from now"
                className="mt-1 w-full rounded-lg border border-surface-line px-3 py-2 text-sm focus:border-emerald focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-muted">Next Action</label>
              <input
                value={row.nextAction}
                onChange={(e) => updateRow(i, "nextAction", e.target.value)}
                placeholder="e.g. Automate a $50/week transfer"
                className="mt-1 w-full rounded-lg border border-surface-line px-3 py-2 text-sm focus:border-emerald focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-muted">Status</label>
              <select
                value={row.status}
                onChange={(e) => updateRow(i, "status", e.target.value)}
                className="mt-1 w-full rounded-lg border border-surface-line px-3 py-2 text-sm focus:border-emerald focus:outline-none"
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald hover:underline"
      >
        <Plus size={16} /> Add Goal
      </button>
    </div>
  );
}
