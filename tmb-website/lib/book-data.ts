import type { Part, Stat, FaqItem, WorkbookTool } from "@/types/book";

export const bookMeta = {
  title: "The Modern Money Blueprint",
  subtitle: "Build Wealth Through Side Hustles, Business, Investing & AI",
  author: "Gabriel Sam",
};

export const stats: Stat[] = [
  { value: 259, suffix: "", label: "Pages" },
  { value: 49, suffix: "", label: "Chapters" },
  { value: 10, suffix: "", label: "Parts" },
  { value: 520, suffix: "+", label: "Business Ideas" },
  { value: 12, suffix: "", label: "Worksheets & Trackers" },
];

export const parts: Part[] = [
  {
    number: 1,
    title: "Money Mindset",
    description:
      "The decision-making layer underneath every dollar you'll ever earn, spend, or invest.",
    chapters: [
      { number: 1, title: "Wealth vs. Income" },
      { number: 2, title: "Financial Freedom, Defined" },
      { number: 3, title: "Good Money Habits" },
      { number: 4, title: "Setting Goals That Actually Work" },
      { number: 5, title: "Building Discipline" },
    ],
  },
  {
    number: 2,
    title: "Personal Finance",
    description: "The budgeting, saving, debt, and cash-flow systems that turn mindset into money that moves on its own.",
    chapters: [
      { number: 6, title: "Budgeting" },
      { number: 7, title: "Saving" },
      { number: 8, title: "The Emergency Fund" },
      { number: 9, title: "Debt Management" },
      { number: 10, title: "Cash Flow" },
      { number: 11, title: "Money Systems" },
    ],
  },
  {
    number: 3,
    title: "Choosing Your Business",
    description: "The filters that narrow hundreds of possible businesses down to the handful that actually fit you.",
    chapters: [
      { number: 12, title: "Self-Assessment" },
      { number: 13, title: "Skills Audit" },
      { number: 14, title: "Passion vs. Profit" },
      { number: 15, title: "Market & Customer Research" },
      { number: 16, title: "Business Validation" },
    ],
  },
  {
    number: 4,
    title: "500+ Business Opportunities",
    description: "A categorized library of 520 ideas across 18 categories, built to run through Part III's filters.",
    chapters: [],
    categories: [
      "Digital & Content Creation",
      "Freelance & Professional Services",
      "E-Commerce & Retail",
      "Local & In-Person Services",
      "Food & Beverage",
      "Health, Wellness & Fitness",
      "Education & Coaching",
      "Tech, Apps & SaaS",
      "Creative & Design",
      "AI-Powered Businesses",
      "Real Estate & Property",
      "Trades & Skilled Services",
      "Events & Entertainment",
      "Pet Services",
      "Automotive",
      "Subscription & Membership Businesses",
      "B2B Niche Services",
      "Outdoor & Seasonal Businesses",
    ],
  },
  {
    number: 5,
    title: "Launching Your Business",
    description: "Turning a validated idea into an operating business — model, price, brand, sales, service, and trust.",
    chapters: [
      { number: 17, title: "Business Models" },
      { number: 18, title: "Pricing" },
      { number: 19, title: "Branding" },
      { number: 20, title: "Sales" },
      { number: 21, title: "Customer Service" },
      { number: 22, title: "Building Trust" },
    ],
  },
  {
    number: 6,
    title: "Marketing",
    description: "Social, email, search, paid ads, content, funnels, and referrals — and how to focus on the few that matter.",
    chapters: [
      { number: 23, title: "Social Media" },
      { number: 24, title: "Email Marketing" },
      { number: 25, title: "Search Engine Optimization (SEO)" },
      { number: 26, title: "Paid Advertising" },
      { number: 27, title: "Content Marketing" },
      { number: 28, title: "Funnels" },
      { number: 29, title: "Referral Systems" },
    ],
  },
  {
    number: 7,
    title: "AI Wealth",
    description: "Practical AI workflows that accelerate execution of the judgment built in every earlier part.",
    chapters: [
      { number: 30, title: "AI for Research and Writing" },
      { number: 31, title: "AI for Marketing Execution" },
      { number: 32, title: "AI Automation and Business Systems" },
      { number: 33, title: "AI Customer Support" },
      { number: 34, title: "AI Product Creation" },
      { number: 35, title: "Prompting as a Skill" },
    ],
  },
  {
    number: 8,
    title: "Scaling",
    description: "Hiring, delegation, documentation, and your own time — all in service of one test: a business that survives a week without you.",
    chapters: [
      { number: 36, title: "Hiring" },
      { number: 37, title: "Delegation" },
      { number: 38, title: "Documenting Your Business (SOPs)" },
      { number: 39, title: "Productivity and Time Management" },
      { number: 40, title: "Systems That Scale" },
    ],
  },
  {
    number: 9,
    title: "Investing",
    description: "Turning business income into long-term wealth — educational, not personalized financial advice.",
    chapters: [
      { number: 41, title: "Compound Interest" },
      { number: 42, title: "Stocks, ETFs, and Index Funds" },
      { number: 43, title: "Real Estate and REITs" },
      { number: 44, title: "Bonds and Dividends" },
      { number: 45, title: "Risk Management and Asset Allocation" },
    ],
  },
  {
    number: 10,
    title: "The Financial Freedom Blueprint",
    description: "A 30-day, 90-day, one-year, and five-year plan that ties the whole book into one sequenced timeline.",
    chapters: [
      { number: 46, title: "The 30-Day Plan" },
      { number: 47, title: "The 90-Day Plan" },
      { number: 48, title: "The One-Year Plan" },
      { number: 49, title: "The Five-Year Plan" },
    ],
  },
];

export const workbookTools: WorkbookTool[] = [
  { number: 1, title: "Net Worth Tracker", tiedTo: "Part I & II" },
  { number: 2, title: "Monthly Budget Template", tiedTo: "Chapter 6" },
  { number: 3, title: "Goal Tracker", tiedTo: "Chapter 4" },
  { number: 4, title: "Side Hustle Planner", tiedTo: "Part III & IV" },
  { number: 5, title: "Business Plan Template", tiedTo: "Part III–V" },
  { number: 6, title: "Weekly CEO Planner", tiedTo: "Chapter 39" },
  { number: 7, title: "AI Prompt Library", tiedTo: "Part VII" },
  { number: 8, title: "Financial Foundations Checklist", tiedTo: "Parts I–II" },
  { number: 9, title: "Business Launch Checklist", tiedTo: "Parts III–V" },
  { number: 10, title: "Marketing Checklist", tiedTo: "Part VI" },
  { number: 11, title: "Investment Checklist", tiedTo: "Part IX" },
  { number: 12, title: "Wealth-Building Milestone Checklist", tiedTo: "Part X" },
];

export const faqItems: FaqItem[] = [
  {
    question: "Who is this book actually for?",
    answer:
      "Anyone who wants multiple income streams and long-term wealth but doesn't have a business background yet — people who want a specific next action, not more motivation.",
  },
  {
    question: "Do I need to already have a business idea?",
    answer:
      "No. Part III walks you through a structured self-assessment and skills audit, then Part IV gives you 520 categorized ideas to test against it.",
  },
  {
    question: "Is the investing content specific financial advice?",
    answer:
      "No — Part IX is intentionally educational. It explains how these vehicles work in general terms and recommends no specific investment. You'll still want a licensed professional for your own situation.",
  },
  {
    question: "What if I'm not interested in AI at all?",
    answer:
      "Part VII treats AI as an accelerant for work you're already doing — research, marketing drafts, automation — not a requirement. Every technique there has a non-AI alternative covered elsewhere in the book.",
  },
  {
    question: "What's included with the book?",
    answer:
      "The full 259-page manuscript plus a 12-tool workbook appendix — trackers, templates, and checklists you'll return to long after a first read.",
  },
];
