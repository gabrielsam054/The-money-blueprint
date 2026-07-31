import type { Metadata } from "next";
import { Mail, Instagram, Twitter } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about The Modern Money Blueprint.",
};

export default function ContactPage() {
  return (
    <section className="py-20">
      <div className="container-content grid gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <span className="eyebrow">Get in Touch</span>
          <h1 className="mt-3 font-heading text-4xl font-bold text-slate-ink">
            Contact
          </h1>
          <p className="mt-5 text-slate-body">
            Questions about the book, press inquiries, or partnership ideas —
            send a message and expect a reply within a couple of days.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href="mailto:hello@themodernmoneyblueprint.com"
              className="flex items-center gap-3 text-sm font-medium text-slate-ink hover:text-emerald"
            >
              <Mail size={18} /> hello@themodernmoneyblueprint.com
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-sm font-medium text-slate-ink hover:text-emerald"
            >
              <Instagram size={18} /> @themodernmoneyblueprint
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-sm font-medium text-slate-ink hover:text-emerald"
            >
              <Twitter size={18} /> @gabrielsam
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
