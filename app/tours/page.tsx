import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Users, ArrowRight, Search } from "lucide-react";

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  let query = supabase
    .from("tours")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category);
  }

  if (params.search) {
    query = query.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%`
    );
  }

  const { data: tours } = await query;

  const categories = [
    "Cultural",
    "Eco-Tourism",
    "Heritage",
    "Adventure",
    "Wildlife",
  ];

  return (
    <div className="">
      {/* Hero Section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-accent text-accent-foreground border-0">
              Explore Ghana
            </Badge>
            <h1 className="mb-4 text-4xl font-bold text-balance md:text-5xl ">
              All Tours & Experiences
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Browse our collection of authentic cultural tours, heritage
              journeys, and eco-adventures across Ghana
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-b border-border/40 bg-background py-6">
        <div className="container mx-auto max-w-7xl px-4">
          <form
            method="get"
            className="flex flex-col gap-4 md:flex-row md:items-end"
          >
            <div className="flex-1">
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-medium"
              >
                Search Tours
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  name="search"
                  type="text"
                  placeholder="Search by name or description..."
                  defaultValue={params.search}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium"
              >
                Category
              </label>
              <Select name="category" defaultValue={params.category || "all"}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full md:w-auto">
              Apply Filters
            </Button>
          </form>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          {tours && tours.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => (
                <Card
                  key={tour.id}
                  className="group overflow-hidden border-border/50 hover:shadow-lg transition-shadow py-0"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={
                        tour.image_url ||
                        "/placeholder.svg?height=400&width=600"
                      }
                      alt={tour.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground border-0">
                      {tour.category}
                    </Badge>
                    {tour.is_featured && (
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-0">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{tour.destination}</span>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-balance group-hover:text-primary transition-colors">
                      {tour.title}
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {tour.short_description}
                    </p>
                    <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {tour.duration_days}D/{tour.duration_nights}N
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Max {tour.max_participants}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {tour.difficulty_level}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          &#8373;{tour.price}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          /person
                        </span>
                      </div>
                      <Button
                        asChild
                        variant="ghost"
                        className="group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        <Link href={`/tours/${tour.slug}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">
                No tours found matching your criteria.
              </p>
              <Button asChild variant="outline" className="mt-4 bg-transparent">
                <Link href="/tours">View All Tours</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
