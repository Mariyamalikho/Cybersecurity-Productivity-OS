import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cybersecurity-productivity-os.vercel.app";
  const now = new Date();

  const routes: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/roadmap", priority: 0.95, changeFrequency: "weekly" },
    { path: "/learning/courses", priority: 0.9, changeFrequency: "daily" },
    { path: "/learning/cybersecurity", priority: 0.9, changeFrequency: "daily" },
    { path: "/learning/programming", priority: 0.9, changeFrequency: "daily" },
    { path: "/learning/revision", priority: 0.9, changeFrequency: "daily" },
    { path: "/learning/exams", priority: 0.85, changeFrequency: "weekly" },
    { path: "/tasks", priority: 0.85, changeFrequency: "daily" },
    { path: "/study-abroad", priority: 0.8, changeFrequency: "weekly" },
    { path: "/study-abroad/guide", priority: 0.8, changeFrequency: "weekly" },
    { path: "/projects", priority: 0.8, changeFrequency: "weekly" },
    { path: "/research", priority: 0.75, changeFrequency: "weekly" },
    { path: "/habits", priority: 0.75, changeFrequency: "daily" },
    { path: "/calendar", priority: 0.7, changeFrequency: "daily" },
    { path: "/analytics", priority: 0.7, changeFrequency: "daily" },
    { path: "/achievements", priority: 0.65, changeFrequency: "weekly" },
    { path: "/journal", priority: 0.65, changeFrequency: "daily" },
  ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
