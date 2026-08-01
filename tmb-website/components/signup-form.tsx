"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { isDisposableEmail } from "@/lib/disposable-email-domains";
import { safeJson } from "@/lib/safe-json";

const schema = z.object({
  fullName: z.string().min(2, "Enter your name"),
  email: z
    .string()
    .email("Enter a valid email address")
    .refine((email: string) => !isDisposableEmail(email), {
      message: "Temporary/disposable email addresses aren't allowed — please use a real email.",
    }),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[a-z]/, "Needs a lowercase letter")
    .regex(/[A-Z]/, "Needs an uppercase letter")
    .regex(/[0-9]/, "Needs a number"),
});
type FormValues = z.infer<typeof schema>;

export function SignupForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    // Posts to a server route rather than calling Supabase directly from
    // the browser — the disposable-email and password-strength checks are
    // enforced there, server-side, where they can't be bypassed.
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await safeJson<{ error?: string }>(res, {});
    if (!res.ok) {
      setServerError(json.error ?? "Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="card flex flex-col items-center gap-3 py-14 text-center">
        <CheckCircle2 className="text-emerald" size={32} />
        <p className="font-heading text-lg font-semibold text-slate-ink">
          Check your inbox
        </p>
        <p className="text-sm text-slate-muted">
          Confirm your email to finish creating your account.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div>
          <label htmlFor="fullName" className="text-sm font-medium text-slate-ink">
            Name
          </label>
          <input
            id="fullName"
            {...register("fullName")}
            className="mt-1.5 w-full rounded-lg border border-surface-line px-4 py-3 text-sm focus:border-emerald focus:outline-none"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-error">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="mt-1.5 w-full rounded-lg border border-surface-line px-4 py-3 text-sm focus:border-emerald focus:outline-none"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-error">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-slate-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="mt-1.5 w-full rounded-lg border border-surface-line px-4 py-3 text-sm focus:border-emerald focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-muted">
            At least 8 characters, with an uppercase letter, a lowercase letter, and a number.
          </p>
          {errors.password && (
            <p className="mt-1 text-xs text-error">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <p className="flex items-center gap-2 text-sm text-error">
            <AlertCircle size={16} /> {serverError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-emerald hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
