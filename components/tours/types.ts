export interface ToursType {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  destination: string;
  duration_days: number;
  duration_nights: number;
  price: number;
  max_participants: number;
  difficulty_level: string;
  category: string;
  image_url: string;
  gallery_urls: string[];
  included_items: string[];
  excluded_items: string[];
  itinerary: JSON;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItineraryType {
  title: string;
  activities: string[];
}
// { [key: string]: ItineraryType }