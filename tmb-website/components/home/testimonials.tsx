import { Quote } from "lucide-react";
import { testimonials } from "@/lib/book-data";

export function Testimonials() {
  return (
    <section className="bg-emerald-900 py-24">
      <div className="container-content">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow text-gold-200">Early Readers</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
            What people are saying
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name + t.quote.slice(0, 10)}
              className="rounded-xl2 border border-white/10 bg-white/5 p-7"
            >
              <Quote className="text-gold-200" size={22} />
              <blockquote className="mt-4 text-sm leading-relaxed text-white/85">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-heading font-semibold text-white">
                  {t.name}
                </span>
                <span className="text-white/50"> · {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
