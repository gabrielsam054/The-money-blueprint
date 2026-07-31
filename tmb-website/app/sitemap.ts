import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-data";

const siteUrl = "https://themodernmoneyblueprint.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about-the-book",
    "/table-of-contents",
    "/read-a-sample",
    "/pricing",
    "/about-gabriel-sam",
    "/blog",
    "/contact",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...blogRoutes];
}
