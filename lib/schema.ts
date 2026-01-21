import z from "zod";
import { slugify } from "./slugify";

export const tourSchema = z.object({
  title: z.string().nonempty("required"),
  slug: z.string(),
  destination: z.string().nonempty("required"),
  duration_days: z.number().min(1),
  duration_nights: z.number().min(0),
  price: z.number().min(0.00),
  category: z.string().nonempty("required"),
  difficulty_level: z.string().nonempty("required"),
  max_participants: z.number().min(1),
  short_description: z.string(),
  description: z.string().nonempty("required"),
  image: z.instanceof(File).nonoptional("required"),
  included_items: z.array(z.string().nonempty("required")),
  excluded_items: z.array(z.string().nonempty("required")),
  itinerary: z.record(
    z.string(), // Key type - string keys like "day1", "day2"
    z.object({
      title: z.string().nonempty("required"),
      activities: z.array(z.string().nonempty("required")),
    })
  ),
}).transform((data) => ({
  ...data,
  slug: slugify(data.title),
}));

export type TourSchemaType = z.infer<typeof tourSchema>