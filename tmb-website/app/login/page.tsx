import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { supabaseConfigured } from "@/lib/supabase/is-configured";
import { SupabaseNotConfiguredNotice } from "@/components/supabase-not-configured-notice";

export const metadata: Metadata = {
  title: "Log In",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <section className="py-20">
      <div className="container-content max-w-sm">
        <div className="text-center">
          <span className="eyebrow">Welcome Back</span>
          <h1 className="mt-3 font-heading text-3xl font-bold text-slate-ink">
            Log In
          </h1>
        </div>
        <div className="mt-10">
          {supabaseConfigured ? (
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          ) : (
            <SupabaseNotConfiguredNotice />
          )}
        </div>
      </div>
    </section>
  );
}
