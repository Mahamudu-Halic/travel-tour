import { createClient } from "@/lib/supabase/server";

export default async function sitemap() {
  const supabase = await createClient();

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // Dynamic tour pages
  const { data: tours } = await supabase
    .from("tours")
    .select("id, slug, updated_at")
    .eq("is_active", true);

  const tourPages =
    tours?.map((tour) => ({
      url: `${baseUrl}/tours/${tour.slug}`,
      lastModified: new Date(tour.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || [];

  return [...staticPages, ...tourPages];
}
