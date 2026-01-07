import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

const FeaturedTours = async () => {
  const supabase = await createClient();
  const { data: featuredTours } = await supabase
    .from("tours")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(3);


  return (
    <section>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 border-amber-600 text-amber-600">
            Popular Experiences
          </Badge>
          <h2 className="text-3xl font-bold text-balance md:text-4xl">
            Featured Tours
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Handpicked experiences showcasing the best of Ghana&apos;s culture,
            history, and natural beauty
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredTours?.map((tour) => (
            <Card
              key={tour.id}
              className="group overflow-hidden border-border/50 hover:shadow-lg transition-shadow py-0"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={
                    tour.image_url || "/placeholder.svg?height=400&width=600"
                  }
                  alt={tour.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-4 right-4 bg-amber-600 text-white border-0">
                  {tour.category}
                </Badge>
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

        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Link href="/tours">View All Tours</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTours;
