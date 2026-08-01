"use client";

import { useWorksheetAutosave } from "@/lib/use-worksheet-autosave";
import { SaveStatusIndicator } from "@/components/save-status-indicator";

export interface MonthRow {
  cash: string;
  investments: string;
  other: string;
  debts: string;
}
export type NetWorthData = Record<string, MonthRow>; // key: "1".."12"

const EMPTY_ROW: MonthRow = { cash: "", investments: "", other: "", debts: "" };

function num(v: string) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

export function NetWorthOnlineForm({
  initialResponses,
}: {
  initialResponses: Partial<NetWorthData>;
}) {
  const initial: NetWorthData = {};
  for (let m = 1; m <= 12; m++) {
    initial[String(m)] = { ...EMPTY_ROW, ...initialResponses[String(m)] };
  }

  const { data, update, status } = useWorksheetAutosave("net-worth-tracker", initial);

  function updateCell(month: number, field: keyof MonthRow, value: string) {
    update((prev) => ({
      ...prev,
      [String(month)]: { ...prev[String(month)], [field]: value },
    }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-muted">
          Fill in each month — totals calculate automatically.
        </p>
        <SaveStatusIndicator status={status} />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl2 border border-surface-line">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-emerald text-white">
              <th className="p-3 text-left font-heading text-xs font-semibold">Month</th>
              <th className="p-3 text-left font-heading text-xs font-semibold">Cash & Savings</th>
              <th className="p-3 text-left font-heading text-xs font-semibold">Investments</th>
              <th className="p-3 text-left font-heading text-xs font-semibold">Other Assets</th>
              <th className="p-3 text-left font-heading text-xs font-semibold">Total Debts</th>
              <th className="p-3 text-left font-heading text-xs font-semibold">Net Worth</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
              const row = data[String(month)] ?? EMPTY_ROW;
              const totalAssets = num(row.cash) + num(row.investments) + num(row.other);
              const netWorth = totalAssets - num(row.debts);
              return (
                <tr key={month} className="border-t border-surface-line">
                  <td className="p-2 font-medium text-slate-ink">Month {month}</td>
                  {(["cash", "investments", "other", "debts"] as const).map((field) => (
                    <td key={field} className="p-2">
                      <input
                        type="number"
                        value={row[field]}
                        onChange={(e) => updateCell(month, field, e.target.value)}
                        placeholder="$0"
                        className="w-24 rounded-lg border border-surface-line bg-surface-soft px-2 py-1.5 text-sm focus:border-emerald focus:outline-none"
                      />
                    </td>
                  ))}
                  <td className="p-2 font-heading text-sm font-semibold text-emerald">
                    ${netWorth.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
