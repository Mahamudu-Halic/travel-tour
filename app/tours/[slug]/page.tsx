import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Users,
  Star,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { notFound } from "next/navigation";
import SignInButton from "@/components/sign-in-button";

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createClient();
  const { slug } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: tour } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!tour) {
    notFound();
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("tour_id", tour.id)
    .order("created_at", { ascending: false });

  const averageRating = reviews?.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : null;

  const itinerary = tour.itinerary as Record<
    string,
    { title: string; activities: string[] }
  > | null;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Image */}
        <section className="relative h-[400px] md:h-[500px]">
          <Image
            src={tour.image_url || "/placeholder.svg?height=800&width=1200"}
            alt={tour.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto max-w-7xl">
              <Badge className="mb-3 bg-accent text-accent-foreground border-0">
                {tour.category}
              </Badge>
              <h1 className="mb-2 text-3xl font-bold text-white text-balance md:text-4xl ">
                {tour.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{tour.destination}</span>
                </div>
                {averageRating && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span>
                      {averageRating} ({reviews?.length} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Overview */}
                <div>
                  <h2 className="mb-4 text-2xl font-semibold ">
                    Overview
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {tour.description}
                  </p>
                </div>

                <Separator />

                {/* Tour Details */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <Clock className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-lg font-semibold">
                        {tour.duration_days}D/{tour.duration_nights}N
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
                      <p className="text-sm font-medium">Group Size</p>
                      <p className="text-lg font-semibold">
                        Max {tour.max_participants}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="p-4 text-center">
                      <Badge
                        variant="outline"
                        className="mx-auto mb-2 text-base px-4 py-1"
                      >
                        {tour.difficulty_level}
                      </Badge>
                      <p className="text-sm font-medium">Difficulty</p>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                {/* Included/Excluded */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-4 text-xl font-semibold ">
                      What&apos;s Included
                    </h3>
                    <ul className="space-y-2">
                      {tour.included_items?.map(
                        (item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                            <span className="text-sm text-muted-foreground">
                              {item}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-4 text-xl font-semibold ">
                      What&apos;s Not Included
                    </h3>
                    <ul className="space-y-2">
                      {tour.excluded_items?.map(
                        (item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <XCircle className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
                            <span className="text-sm text-muted-foreground">
                              {item}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* Itinerary */}
                {itinerary && (
                  <>
                    <Separator />
                    <div>
                      <h2 className="mb-6 text-2xl font-semibold ">
                        Itinerary
                      </h2>
                      <div className="space-y-4">
                        {Object.entries(itinerary).map(([key, day]) => (
                          <Card key={key} className="border-border/50">
                            <CardHeader>
                              <CardTitle className="text-lg ">
                                {day.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {day.activities.map(
                                  (activity: string, index: number) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="text-primary font-semibold">
                                        •
                                      </span>
                                      <span className="text-sm text-muted-foreground">
                                        {activity}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Reviews */}
                {reviews && reviews.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold ">
                          Reviews
                        </h2>
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-lg font-semibold">
                            {averageRating}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({reviews.length} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <Card key={review.id} className="border-border/50">
                            <CardContent className="p-4">
                              <div className="mb-2 flex items-center justify-between">
                                <p className="font-medium">
                                  {user?.user_metadata?.full_name ?? "Anonymous"}
                                </p>
                                <div className="flex gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              {review.comment && (
                                <p className="text-sm text-muted-foreground">
                                  {review.comment}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Booking Card */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 border-border/50">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-primary">
                        &#8373;{tour.price}
                      </span>
                      <span className="text-muted-foreground"> /person</span>
                    </div>
                    {user ? (
                      <Button asChild className="w-full" size="lg">
                        <Link href={`/book/${tour.slug}`}>Book This Tour</Link>
                      </Button>
                    ) : (
                      <SignInButton className="w-full" />
                    )}
                    <Separator className="my-6" />
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">
                          {tour.duration_days} Days, {tour.duration_nights}{" "}
                          Nights
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Group Size
                        </span>
                        <span className="font-medium">
                          Max {tour.max_participants} people
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Difficulty
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {tour.difficulty_level}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
