"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, CheckCircle2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type FormValues = z.infer<typeof schema>;

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    // Phase 2: POST to /api/newsletter once Supabase is connected.
    await new Promise((r) => setTimeout(r, 500));
    console.log("newsletter signup:", values.email);
    setSubmitted(true);
    reset();
  }

  return (
    <section className="bg-emerald py-20">
      <div className="container-content flex flex-col items-center text-center">
        <Mail className="text-gold-200" size={28} />
        <h2 className="mt-4 font-heading text-2xl font-bold text-white sm:text-3xl">
          One email a week. No fluff, no upsell spam.
        </h2>
        <p className="mt-3 max-w-md text-sm text-white/70">
          Practical notes on money, business, and AI — from the same system
          the book is built on.
        </p>

        {submitted ? (
          <div className="mt-8 flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-white">
            <CheckCircle2 size={18} className="text-gold-200" />
            You&apos;re on the list — check your inbox to confirm.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="flex-1 text-left">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="you@email.com"
                {...register("email")}
                className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-white/50 focus:border-gold-200 focus:outline-none"
              />
              {errors.email && (
                <p className="mt-1.5 pl-2 text-xs text-gold-200">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-gold px-6 py-3.5 font-heading text-sm font-semibold text-slate-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {isSubmitting ? "Joining..." : "Join the list"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
