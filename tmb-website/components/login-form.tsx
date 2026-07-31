"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [mode, setMode] = useState<"password" | "magic-link">("password");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<FormValues>({
    resolver: zodResolver(
      mode === "password" ? schema : schema.pick({ email: true })
    ),
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const supabase = createClient();

    if (mode === "magic-link") {
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setServerError(error.message);
      else setMagicLinkSent(true);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  if (magicLinkSent) {
    const email = getValues("email");
    return (
      <div className="card flex flex-col items-center gap-3 py-14 text-center">
        <CheckCircle2 className="text-emerald" size={32} />
        <p className="font-heading text-lg font-semibold text-slate-ink">
          Check your inbox
        </p>
        <p className="text-sm text-slate-muted">
          We sent a sign-in link to <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-6 flex rounded-full bg-surface-soft p-1">
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            mode === "password" ? "bg-white text-slate-ink shadow-card" : "text-slate-muted"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setMode("magic-link")}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            mode === "magic-link" ? "bg-white text-slate-ink shadow-card" : "text-slate-muted"
          }`}
        >
          Magic Link
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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

        {mode === "password" && (
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
            {errors.password && (
              <p className="mt-1 text-xs text-error">{errors.password.message}</p>
            )}
          </div>
        )}

        {serverError && (
          <p className="flex items-center gap-2 text-sm text-error">
            <AlertCircle size={16} /> {serverError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? (
            "Working..."
          ) : mode === "magic-link" ? (
            <>
              <Mail size={16} /> Send Magic Link
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-muted">
        No account yet?{" "}
        <Link href="/signup" className="font-semibold text-emerald hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
