export interface BlogPost {
  slug: string;
  title: string;
  category: "Money" | "Business" | "Marketing" | "AI" | "Investing" | "Entrepreneurship";
  excerpt: string;
  date: string;
  readTime: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "income-vs-wealth",
    title: "Why Your Salary Isn't the Number That Matters",
    category: "Money",
    excerpt:
      "Two people can earn the same income and end up in completely different financial positions. Here's the one number that actually predicts which one you'll be.",
    date: "2026-06-02",
    readTime: "4 min read",
    content: [
      "Income is what arrives. Wealth is what stays. Someone earning $250,000 a year who spends $249,000 of it is not wealthy — they're on a treadmill with a higher speed setting than most.",
      "The income-expense gap, not the size of your paycheck, is the real engine of financial progress. Widening that gap — through automated savings, not willpower — is the highest-leverage move most people can make.",
      "This is the opening idea of Chapter 1 in The Modern Money Blueprint. The rest of the book builds forward from it.",
    ],
  },
  {
    slug: "validate-before-you-build",
    title: "The Smallest Test That Can Save You Six Months",
    category: "Business",
    excerpt:
      "Most failed side businesses aren't failed ideas — they're ideas that skipped a five-dollar test before a six-month build.",
    date: "2026-06-09",
    readTime: "5 min read",
    content: [
      "Real validation is a commitment, not a compliment. A pre-order, a deposit, a signed letter of intent — these cost the other person something. 'I'd definitely buy that' costs them nothing.",
      "Before building anything substantial, find the smallest possible version of your offer that can still collect a real commitment: a landing page with a waitlist, a discounted pilot client, a pre-sale.",
      "If ten conversations don't produce a few visibly interested reactions, that's useful data — not failure. It tells you to adjust the offer before you build further, not to give up.",
    ],
  },
  {
    slug: "one-platform-beats-five",
    title: "Why One Marketing Channel Beats Five Half-Used Ones",
    category: "Marketing",
    excerpt:
      "Spreading effort across every platform feels like maximizing reach. In practice, it usually produces nothing anywhere.",
    date: "2026-06-16",
    readTime: "4 min read",
    content: [
      "A furniture maker posted inconsistently across five platforms for a year with almost nothing to show for it. He picked one — the one where his actual customers already spent time — and posted there three times a week without exception.",
      "Six months later, that single platform had generated more customers than all five combined had in the previous year.",
      "Consistency on one channel builds the familiarity that trust is actually built on. A viral post on five platforms rarely converts — it reaches people with no context for who you are.",
    ],
  },
  {
    slug: "ai-accelerates-doesnt-replace",
    title: "AI Won't Replace Your Business Judgment — And That's the Point",
    category: "AI",
    excerpt:
      "The businesses getting real value from AI tools treat them as an execution multiplier, not a replacement for the decisions that actually matter.",
    date: "2026-06-23",
    readTime: "5 min read",
    content: [
      "AI tools are genuinely useful for structured, repetitive tasks — first drafts, summarizing research, generating ad copy variations. They're far less useful for the nuanced judgment calls specific to your business.",
      "The businesses seeing the most benefit keep strategic decisions human — which platform, which customer to serve, what to charge — and use AI purely to execute that strategy faster.",
      "Every AI-generated output still needs a human review step before it reaches a customer. That principle doesn't change as the tools improve.",
    ],
  },
  {
    slug: "savings-rate-not-salary",
    title: "The One Investing Number Nobody Talks About",
    category: "Investing",
    excerpt:
      "Your account balance feels like the number that matters. Your savings rate is the one that actually predicts your future.",
    date: "2026-06-30",
    readTime: "4 min read",
    content: [
      "A percentage is comparable across a $40,000 year and an $80,000 year in a way a fixed dollar target never is. Two people saving $400 a month can be in completely different positions if one earns $40,000 and the other $120,000.",
      "Small, automated step-up increases — raising your savings rate by a point every few months — compound without ever feeling like a sacrifice, because each increase is too small to register as a lifestyle change.",
      "This is educational content, not personalized financial advice. Always consult a licensed professional for your specific situation.",
    ],
  },
  {
    slug: "the-one-week-test",
    title: "The Only Real Test of Whether Your Business Has Scaled",
    category: "Entrepreneurship",
    excerpt:
      "Not revenue. Not headcount. One specific test tells you whether a business actually runs without its founder.",
    date: "2026-07-07",
    readTime: "5 min read",
    content: [
      "The clearest single test of whether a business has actually scaled is whether it can run for a full week without the founder personally available.",
      "This isn't a test to pass once and forget — it's worth attempting deliberately, on a real calendar, rather than waiting for an emergency to force the question.",
      "Decision-making frameworks and regular team rhythms replace the founder as the single point of contact — most questions can genuinely wait for the next scheduled check-in.",
    ],
  },
];
