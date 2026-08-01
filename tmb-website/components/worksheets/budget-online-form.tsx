"use client";

import { useWorksheetAutosave } from "@/lib/use-worksheet-autosave";
import { SaveStatusIndicator } from "@/components/save-status-indicator";

export interface BudgetRow {
  budgeted: string;
  actual: string;
}
interface BudgetSection {
  title: string;
  key: string;
  categories: string[];
}
export type BudgetData = Record<string, BudgetRow>; // key: "sectionKey:category"

const INCOME_SECTION: BudgetSection = { title: "Income", key: "income", categories: ["Primary income", "Side income", "Other"] };
const FIXED_SECTION: BudgetSection = { title: "Fixed Costs", key: "fixed", categories: ["Rent/Mortgage", "Utilities", "Insurance", "Loan payments"] };
const VARIABLE_SECTION: BudgetSection = { title: "Variable Spending", key: "variable", categories: ["Groceries", "Transport", "Entertainment", "Other"] };
const SAVINGS_SECTION: BudgetSection = { title: "Savings & Debt Payoff", key: "savings", categories: ["Emergency fund", "Investing", "Extra debt payment"] };

const SECTIONS: BudgetSection[] = [INCOME_SECTION, FIXED_SECTION, VARIABLE_SECTION, SAVINGS_SECTION];

function num(v: string) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

export function BudgetOnlineForm({
  initialResponses,
}: {
  initialResponses: Partial<BudgetData>;
}) {
  const initial: BudgetData = {};
  for (const section of SECTIONS) {
    for (const cat of section.categories) {
      const key = `${section.key}:${cat}`;
      initial[key] = initialResponses[key] ?? { budgeted: "", actual: "" };
    }
  }

  const { data, update, status } = useWorksheetAutosave("monthly-budget-template", initial);

  function updateCell(key: string, field: keyof BudgetRow, value: string) {
    update((prev) => {
      const currentRow: BudgetRow = prev[key] ?? { budgeted: "", actual: "" };
      return { ...prev, [key]: { ...currentRow, [field]: value } };
    });
  }

  function sectionTotal(section: BudgetSection, field: keyof BudgetRow) {
    return section.categories.reduce(
      (sum, cat) => sum + num(data[`${section.key}:${cat}`]?.[field] ?? ""),
      0
    );
  }

  const incomeTotal = sectionTotal(INCOME_SECTION, "budgeted");
  const fixedTotal = sectionTotal(FIXED_SECTION, "budgeted");
  const variableTotal = sectionTotal(VARIABLE_SECTION, "budgeted");
  const savingsTotal = sectionTotal(SAVINGS_SECTION, "budgeted");
  const balance = incomeTotal - fixedTotal - variableTotal - savingsTotal;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-muted">
          Fill in budgeted and actual amounts — totals and balance calculate automatically.
        </p>
        <SaveStatusIndicator status={status} />
      </div>

      <div className="mt-4 space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.key} className="overflow-hidden rounded-xl2 border border-surface-line">
            <p className="bg-emerald p-3 font-heading text-sm font-semibold text-white">
              {section.title}
            </p>
            <div className="grid grid-cols-[1fr_auto_auto] gap-px bg-surface-line text-sm">
              <div className="bg-surface-soft p-2 font-heading text-xs font-semibold">Category</div>
              <div className="bg-surface-soft p-2 font-heading text-xs font-semibold">Budgeted</div>
              <div className="bg-surface-soft p-2 font-heading text-xs font-semibold">Actual</div>
              {section.categories.map((cat) => {
                const key = `${section.key}:${cat}`;
                const row = data[key] ?? { budgeted: "", actual: "" };
                return (
                  <div key={cat} className="contents">
                    <div className="bg-white p-2 text-slate-body">{cat}</div>
                    <div className="bg-white p-2">
                      <input
                        type="number"
                        value={row.budgeted}
                        onChange={(e) => updateCell(key, "budgeted", e.target.value)}
                        placeholder="$0"
                        className="w-24 rounded-lg border border-surface-line px-2 py-1 text-sm focus:border-emerald focus:outline-none"
                      />
                    </div>
                    <div className="bg-white p-2">
                      <input
                        type="number"
                        value={row.actual}
                        onChange={(e) => updateCell(key, "actual", e.target.value)}
                        placeholder="$0"
                        className="w-24 rounded-lg border border-surface-line px-2 py-1 text-sm focus:border-emerald focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between rounded-xl2 bg-gold-50 p-4">
          <p className="font-heading text-sm font-semibold text-slate-ink">
            Balance (Income − everything else)
          </p>
          <p className="font-heading text-lg font-bold text-gold-600">
            ${balance.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
