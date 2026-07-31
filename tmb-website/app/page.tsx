import { Hero } from "@/components/home/hero";
import { TrustedNumbers } from "@/components/home/trusted-numbers";
import { InsideTheBook } from "@/components/home/inside-the-book";
import { BookShowcase } from "@/components/home/book-showcase";
import { Comparison } from "@/components/home/comparison";
import { Testimonials } from "@/components/home/testimonials";
import { AuthorTeaser } from "@/components/home/author-teaser";
import { Faq } from "@/components/home/faq";
import { Newsletter } from "@/components/home/newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedNumbers />
      <InsideTheBook />
      <BookShowcase />
      <Comparison />
      <Testimonials />
      <AuthorTeaser />
      <Faq />
      <Newsletter />
    </>
  );
}
