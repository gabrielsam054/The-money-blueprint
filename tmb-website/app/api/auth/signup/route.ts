import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isDisposableEmail } from "@/lib/disposable-email-domains";

const signupSchema = z.object({
  fullName: z.string().min(2, "Enter your name"),
  email: z
    .string()
    .email("Enter a valid email address")
    .refine((email: string) => !isDisposableEmail(email), {
      message: "Temporary/disposable email addresses aren't allowed — please use a real email.",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password needs at least one lowercase letter")
    .regex(/[A-Z]/, "Password needs at least one uppercase letter")
    .regex(/[0-9]/, "Password needs at least one number"),
});

/**
 * Signup goes through this Route Handler rather than calling
 * supabase.auth.signUp() directly from the browser, specifically so the
 * disposable-email and password-strength checks below can't be skipped
 * by anyone bypassing the client-side form (they're enforced here,
 * server-side, as the real gate — the form's own validation is just for
 * instant user feedback, not the actual security boundary).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { fullName, email, password } = parsed.data;
  const origin = new URL(request.url).origin;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
