import { createClient } from "@/lib/supabase/server";
import { BookingForm } from "@/components/booking-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MapPin, Clock, Users } from "lucide-react";
import { notFound, redirect } from "next/navigation";

export default async function BookTourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createClient();
  const { slug } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // redirect(`/auth/login?redirect=/book/${slug}`)
    return null;
  }

  const { data: tour } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!tour) {
    notFound();
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl ">
            Complete Your Booking
          </h1>
          <p className="text-muted-foreground">
            Fill in your details to book this amazing experience
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm
              tour={tour}
              user={user}
            />
          </div>

          {/* Tour Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-border/50">
              <CardHeader>
                <CardTitle className="">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative h-48 overflow-hidden rounded-lg">
                  <Image
                    src={
                      tour.image_url || "/placeholder.svg?height=300&width=400"
                    }
                    alt={tour.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <Badge className="mb-2 bg-accent text-accent-foreground border-0">
                    {tour.category}
                  </Badge>
                  <h3 className="text-lg font-semibold text-balance">
                    {tour.title}
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{tour.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {tour.duration_days} Days, {tour.duration_nights} Nights
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Max {tour.max_participants} people</span>
                  </div>
                </div>
                <div className="border-t border-border/40 pt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted-foreground">
                      Price per person
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      &#8373;{tour.price}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
