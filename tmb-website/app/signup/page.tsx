import type { Metadata } from "next";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <section className="py-20">
      <div className="container-content max-w-sm">
        <div className="text-center">
          <span className="eyebrow">Get Started</span>
          <h1 className="mt-3 font-heading text-3xl font-bold text-slate-ink">
            Create Your Account
          </h1>
          <p className="mt-3 text-sm text-slate-muted">
            Track your reading progress, save bookmarks, and (soon) talk to
            the AI Coach.
          </p>
        </div>
        <div className="mt-10">
          <SignupForm />
        </div>
      </div>
    </section>
  );
}
