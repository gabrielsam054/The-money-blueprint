import type { PromptField } from "@/components/worksheets/prompt-online-form";

export const sideHustlePlannerFields: PromptField[] = [
  { type: "field", key: "idea", label: "Business idea (from Part IV or your own)" },
  { type: "field", key: "customer", label: "Who is the specific customer?" },
  { type: "field", key: "problem", label: "What specific problem does it solve for them?" },
  { type: "field", key: "model", label: "Which business model fits? (Ch. 17)" },
  { type: "field", key: "price", label: "What's my starting price? (Ch. 18)" },
  { type: "field", key: "validation", label: "How will I validate demand before building? (Ch. 16)" },
  { type: "field", key: "actions", label: "What are my first 3 action steps?" },
];

export const businessPlanFields: PromptField[] = [
  { type: "field", key: "problem", label: "The problem I'm solving" },
  { type: "field", key: "solution", label: "My solution / offer" },
  { type: "field", key: "customer", label: "My target customer (be specific)" },
  { type: "field", key: "model", label: "My business model (Ch. 17)" },
  { type: "field", key: "pricing", label: "My pricing (Ch. 18)" },
  { type: "field", key: "brand", label: "My brand promise, in one sentence (Ch. 19)" },
  { type: "field", key: "marketing", label: "My primary marketing channel (Part VI)" },
  { type: "field", key: "milestone", label: "My first 90-day milestone (Ch. 47)" },
  { type: "field", key: "risk", label: "My biggest risk, and how I'll manage it" },
];

export const weeklyCeoPlannerFields: PromptField[] = [
  { type: "section", label: "This Week's Top 3 Priorities (only I can do these)" },
  { type: "field", key: "priority1", label: "1." },
  { type: "field", key: "priority2", label: "2." },
  { type: "field", key: "priority3", label: "3." },
  { type: "section", label: "What I'm Delegating or Saying No To This Week" },
  { type: "field", key: "delegating", label: "Delegation / no list" },
  { type: "section", label: "End-of-Week Review" },
  { type: "field", key: "review1", label: "What moved the business forward this week?" },
  { type: "field", key: "review2", label: "What did I spend time on that someone else could have done?" },
  { type: "field", key: "review3", label: "What's my #1 priority next week?" },
];
