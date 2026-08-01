import { Quote, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/is-configured";

interface Review {
  rating: number;
  review_text: string;
  reviewer_name: string | null;
  reviewer_role: string | null;
}

/**
 * Real reviews only — no fabricated placeholder content. If there are
 * zero approved reviews yet, this section renders nothing at all rather
 * than showing an empty or awkward state; it'll start appearing on its
 * own the moment a real review gets approved.
 */
export async function Testimonials() {
  if (!supabaseConfigured) return null;

  let reviews: Review[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reviews")
      .select("rating, review_text, reviewer_name, reviewer_role")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6);
    reviews = data ?? [];
  } catch {
    return null; // never let a homepage section crash the whole page
  }

  if (reviews.length === 0) return null;

  return (
    <section className="bg-emerald-900 py-24">
      <div className="container-content">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow text-gold-200">Real Readers</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
            What people are saying
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <figure
              key={i}
              className="rounded-xl2 border border-white/10 bg-white/5 p-7"
            >
              <div className="flex items-center justify-between">
                <Quote className="text-gold-200" size={22} />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star
                      key={j}
                      size={13}
                      className={j < r.rating ? "fill-gold-200 text-gold-200" : "text-white/20"}
                    />
                  ))}
                </div>
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-white/85">
                “{r.review_text}”
              </blockquote>
              {(r.reviewer_name || r.reviewer_role) && (
                <figcaption className="mt-5 text-sm">
                  {r.reviewer_name && (
                    <span className="font-heading font-semibold text-white">
                      {r.reviewer_name}
                    </span>
                  )}
                  {r.reviewer_role && (
                    <span className="text-white/50"> · {r.reviewer_role}</span>
                  )}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
