import { faqItems } from "@/lib/book-data";
import { AccordionItem } from "@/components/ui/accordion";

export function Faq() {
  return (
    <section className="bg-surface-soft py-24">
      <div className="container-content max-w-2xl">
        <div className="text-center">
          <span className="eyebrow">Questions</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-slate-ink sm:text-4xl">
            Frequently asked
          </h2>
        </div>

        <div className="mt-12">
          {faqItems.map((item, i) => (
            <AccordionItem
              key={item.question}
              defaultOpen={i === 0}
              trigger={
                <span className="font-heading text-base font-semibold text-slate-ink">
                  {item.question}
                </span>
              }
            >
              <p className="text-sm leading-relaxed text-slate-body">
                {item.answer}
              </p>
            </AccordionItem>
          ))}
        </div>
      </div>
    </section>
  );
}
