"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});
type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    // Phase 2: POST to /api/contact once Supabase is connected.
    await new Promise((r) => setTimeout(r, 500));
    console.log("contact submission:", values);
    setSubmitted(true);
    reset();
  }

  if (submitted) {
    return (
      <div className="card flex flex-col items-center gap-3 py-14 text-center">
        <CheckCircle2 className="text-emerald" size={32} />
        <p className="font-heading text-lg font-semibold text-slate-ink">
          Message sent
        </p>
        <p className="text-sm text-slate-muted">
          Thanks for reaching out — expect a reply within a couple of days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-5">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-slate-ink">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="mt-1.5 w-full rounded-lg border border-surface-line px-4 py-3 text-sm focus:border-emerald focus:outline-none"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-error">{errors.name.message}</p>
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
        <label htmlFor="message" className="text-sm font-medium text-slate-ink">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="mt-1.5 w-full resize-none rounded-lg border border-surface-line px-4 py-3 text-sm focus:border-emerald focus:outline-none"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-error">{errors.message.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
