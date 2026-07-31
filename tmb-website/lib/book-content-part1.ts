export interface BookChunk {
  chapterNumber: number;
  chapterTitle: string;
  partTitle: string;
  content: string;
}

/**
 * Real, condensed content from every chapter of the actual manuscript —
 * not filler. Each chunk captures the chapter's core lesson, its
 * case-study takeaway, and its concrete action steps, which is what
 * actually needs to be retrievable for the AI Coach to answer specific
 * questions accurately rather than generically.
 *
 * This is the source data for scripts/generate-embeddings.mjs, which
 * embeds each chunk and uploads it to the book_chunks table.
 */
export const bookChunks: BookChunk[] = [
  {
    chapterNumber: 1,
    chapterTitle: "Wealth vs. Income",
    partTitle: "Part I — Money Mindset",
    content:
      "Income is what arrives; wealth is what stays. Two people earning the same salary can end up in completely different financial positions depending on their income-expense gap, not their paycheck size. Wealth is a number on a balance sheet — what you own minus what you owe — while income is just a number on a pay stub. Lifestyle creep is most dangerous right after a raise, bonus, or new job, because that's when extra money quietly gets absorbed into a higher spending baseline before it's assigned a job. The highest-leverage move most people can make isn't earning more, it's widening the gap between what comes in and what goes out through automated savings. Common mistakes: chasing raises as the only wealth strategy, increasing spending automatically with every raise, and judging financial success by salary instead of net worth.",
  },
  {
    chapterNumber: 2,
    chapterTitle: "Financial Freedom, Defined",
    partTitle: "Part I — Money Mindset",
    content:
      "Financial freedom is a ratio — the income your assets generate compared to your living expenses — not a fixed dollar amount. There are four measurable stages: financial stability (income covers expenses, no debt spiral), financial security (an emergency fund and manageable debt), financial independence (assets could cover essential expenses), and financial freedom (assets comfortably cover your full lifestyle). Naming your current stage turns an abstract goal into something trackable. Calculate your 'freedom number' using only essential monthly expenses, not your full current lifestyle — it's a far more achievable first target. Mistakes to avoid: defining freedom only as 'a lot of money' with no specific ratio, waiting to think about freedom until income feels high enough, and treating it as all-or-nothing instead of stage by stage.",
  },
  {
    chapterNumber: 3,
    chapterTitle: "Good Money Habits",
    partTitle: "Part I — Money Mindset",
    content:
      "Willpower is a depleted resource that fails under stress; automated habits remove the decision entirely, which is why they're more reliable. The habits that actually move the needle: tracking spending weekly, automating savings before spending, reviewing subscriptions monthly, and directing raises toward savings rather than lifestyle. Most new financial habits fail because they're too ambitious on day one — a five-minute weekly check-in that actually happens beats an elaborate system that gets abandoned after two weeks. Start smaller than feels necessary; add complexity only once the habit is automatic. Mistakes: building an elaborate system that gets abandoned, relying on memory instead of automatic transfers, and only reviewing finances when something already went wrong.",
  },
  {
    chapterNumber: 4,
    chapterTitle: "Setting Goals That Actually Work",
    partTitle: "Part I — Money Mindset",
    content:
      "'Save more' isn't a goal, it's a direction with no destination. A workable financial goal needs three elements: a number, a deadline, and a specific next action this week. 'Save $5,000 by December, starting with a $200 transfer this Friday' consistently outperforms 'save more money.' Goals framed around identity — 'I'm someone who reviews my budget every Sunday' — tend to stick better than goals framed purely around a distant outcome, because identity-based goals shape daily behavior directly. Break large goals into monthly or quarterly checkpoints so progress is visible rather than invisible. Mistakes: vague goals with no number or deadline, one large distant goal with no milestones, and focusing only on the outcome instead of the daily behavior behind it.",
  },
  {
    chapterNumber: 5,
    chapterTitle: "Building Discipline",
    partTitle: "Part I — Money Mindset",
    content:
      "Financially disciplined people usually aren't relying on constant self-control — they've engineered their environment so the disciplined choice is also the easy one: automatic transfers, unsubscribed shopping emails, a visible goal tracker. Each time you follow through on a financial commitment, even a small one, you build evidence you're someone who follows through, and that evidence compounds the same way money does. The people who build lasting discipline aren't the ones who never slip — they're the ones who return to the system the very next day instead of treating one bad week as proof the whole plan failed. Mistakes: relying purely on willpower in moments of temptation, treating a single slip-up as total failure, and only tracking big wins while ignoring small consistent ones.",
  },
  {
    chapterNumber: 6,
    chapterTitle: "Budgeting",
    partTitle: "Part II — Personal Finance",
    content:
      "A budget gives every dollar a job before it's spent. Zero-based budgeting assigns every dollar a specific category (income minus fixed costs minus variable spending minus savings equals zero); a percentage-split budget (roughly 50% needs, 30% wants, 20% savings) sacrifices precision for something far more people actually sustain past month two. Neither method is objectively better — the right one is whichever survives past the first bad week. Most budgets fail not from bad math but from being too rigid to bend without breaking. Mistakes: building a budget so strict it's abandoned after one bad week, budgeting only fixed bills while ignoring annual and quarterly expenses, and setting up a budgeting app once and never returning to it.",
  },
  {
    chapterNumber: 7,
    chapterTitle: "Saving",
    partTitle: "Part II — Personal Finance",
    content:
      "Savings rate — the percentage of income saved — matters more than the raw dollar amount, because it's comparable across a $40,000 year and an $80,000 year in a way a fixed target never is. Automating a transfer the day income arrives, before spending happens, removes the decision entirely. Small, automated step-up increases — raising your savings rate by a point every few months — compound without ever feeling like a sacrifice, since each increase is too small to register as a lifestyle change. Separate savings into labeled buckets by goal and timeline so money doesn't drift toward the wrong purpose. Mistakes: saving 'whatever's left' at month's end, keeping all savings in one undefined account, and comparing your rate to others instead of your own trend.",
  },
  {
    chapterNumber: 8,
    chapterTitle: "The Emergency Fund",
    partTitle: "Part II — Personal Finance",
    content:
      "An emergency fund's job is safety, not growth — it belongs in a liquid, low-volatility account, not invested for returns. Rather than aiming directly for the commonly cited three-to-six-month target, a milestone ladder sustains motivation better: $500 starter buffer, then one month of expenses, then three months, then six. Using the fund for its actual purpose is the system working correctly, not a failure — but replenishing it afterward deserves the same automated priority it took to build the first time. Treat your first $500 milestone as more urgent than almost any other financial goal. Mistakes: investing the fund for higher returns, keeping it in the same account as everyday spending, and waiting to start until you can save the full target at once.",
  },
  {
    chapterNumber: 9,
    chapterTitle: "Debt Management",
    partTitle: "Part II — Personal Finance",
    content:
      "Not all debt is equal — interest rate, not balance size, should drive payoff order. The avalanche method (highest interest first) minimizes total interest paid; the snowball method (smallest balance first) sacrifices some efficiency for early psychological wins that keep people motivated. The mathematically best method is worthless if it's the one you abandon after two months — the right method is whichever one you'll actually follow to a zero balance. Paying only the minimum on high-interest debt can stretch payoff over decades; extra payments made early have an outsized effect because they reduce the balance interest is calculated on going forward. Mistakes: treating all debt the same regardless of interest rate, paying only the minimum on high-interest debt, and taking on new debt while still paying off old debt without a plan.",
  },
  {
    chapterNumber: 10,
    chapterTitle: "Cash Flow",
    partTitle: "Part II — Personal Finance",
    content:
      "Cash flow is about timing — when money arrives versus when it leaves — not just the monthly total. A perfectly adequate income, poorly timed against bill due dates, can still create a real squeeze that a healthy monthly average completely hides. Mapping a cash flow calendar reveals the tightest week of the month, which actually determines whether that month feels financially stressed. Most billers will move a due date on request, often with a single call, aligning bills with paydays instead of leaving them scattered. A separate one-month buffer in checking, distinct from the emergency fund, smooths ordinary timing mismatches. Mistakes: judging finances only by the monthly total, letting bill due dates fall right after low-balance days, and treating the emergency fund as a buffer for routine timing gaps.",
  },
  {
    chapterNumber: 11,
    chapterTitle: "Money Systems",
    partTitle: "Part II — Personal Finance",
    content:
      "A system connects individual habits — budgeting, saving, debt payoff, cash flow — so they run together with minimal ongoing decisions, rather than existing as separate tasks to remember each month. A short weekly check-in paired with a longer monthly review covers everything without turning personal finance into a part-time job. Automating the mechanics (transfers, bill payments) frees review time for actual decisions instead of data entry. A system you actually run every week beats a perfect system you set up once and abandon — simplicity is a feature, not a compromise. Mistakes: manually tracking every transaction by hand indefinitely, reviewing so rarely that problems compound before being noticed, and building a system so complex no one else could maintain it.",
  },
];
