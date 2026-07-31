import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Poppins, Inter } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://themodernmoneyblueprint.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Modern Money Blueprint — Gabriel Sam",
    template: "%s — The Modern Money Blueprint",
  },
  description:
    "Build wealth through side hustles, business, investing & AI. A complete, practical system across 10 parts, 49 chapters, and 520 business ideas.",
  keywords: [
    "personal finance book",
    "side hustle book",
    "business book",
    "investing for beginners",
    "AI for business",
    "Gabriel Sam",
  ],
  authors: [{ name: "Gabriel Sam" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "The Modern Money Blueprint",
    description:
      "Build wealth through side hustles, business, investing & AI.",
    siteName: "The Modern Money Blueprint",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Modern Money Blueprint",
    description:
      "Build wealth through side hustles, business, investing & AI.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: siteUrl },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "The Modern Money Blueprint",
    author: { "@type": "Person", name: "Gabriel Sam" },
    description:
      "Build wealth through side hustles, business, investing & AI.",
    numberOfPages: "259",
  };

  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-emerald focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
