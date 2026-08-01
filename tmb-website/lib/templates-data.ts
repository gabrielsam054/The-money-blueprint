export interface DownloadableTemplate {
  slug: string;
  filename: string;
  title: string;
  description: string;
  tiedTo: string;
}

/**
 * The 6 workbook tools built as real, fillable Excel files (with actual
 * formulas, not just static tables) — matching entries 1-6 of the 12
 * tools listed in lib/book-data.ts's workbookTools. The remaining 6
 * (checklists + the AI Prompt Library) stay as book-appendix content
 * only, since a checklist doesn't meaningfully benefit from being a
 * separate spreadsheet the way a tracker with running totals does.
 *
 * `filename` must exactly match what's uploaded to the "templates"
 * bucket in Supabase Storage — see docs/phase-2-roadmap.md.
 */
export const downloadableTemplates: DownloadableTemplate[] = [
  {
    slug: "net-worth-tracker",
    filename: "Net_Worth_Tracker.xlsx",
    title: "Net Worth Tracker",
    description: "12-month tracker with auto-calculating totals and net worth per month.",
    tiedTo: "Chapter 1",
  },
  {
    slug: "monthly-budget-template",
    filename: "Monthly_Budget_Template.xlsx",
    title: "Monthly Budget Template",
    description: "Income, fixed costs, variable spending, and savings — with variance and balance-check formulas.",
    tiedTo: "Chapter 6",
  },
  {
    slug: "goal-tracker",
    filename: "Goal_Tracker.xlsx",
    title: "Goal Tracker",
    description: "The number + deadline + next action format from the book, with a status dropdown.",
    tiedTo: "Chapter 4",
  },
  {
    slug: "side-hustle-planner",
    filename: "Side_Hustle_Planner.xlsx",
    title: "Side Hustle Planner",
    description: "A one-page way to move a business idea from the library into something testable.",
    tiedTo: "Parts III & IV",
  },
  {
    slug: "business-plan-template",
    filename: "Business_Plan_Template.xlsx",
    title: "Business Plan Template",
    description: "A one-page plan pulling together Parts III through V.",
    tiedTo: "Parts III–V",
  },
  {
    slug: "weekly-ceo-planner",
    filename: "Weekly_CEO_Planner.xlsx",
    title: "Weekly CEO Planner",
    description: "Top-3 priorities, a delegation log, and an end-of-week review — fill in every Monday.",
    tiedTo: "Chapter 39",
  },
];
