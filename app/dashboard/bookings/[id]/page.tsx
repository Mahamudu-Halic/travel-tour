import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  User,
  Receipt,
  Clock,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(
      "*, tours(title, slug, destination, image_url, category, price, description, duration_days)"
    )
    .eq("id", id)
    .eq("user_id", user?.id)
    .single();

  if (error || !booking) {
    notFound();
  }

  const { data: refundRequest } = await supabase
    .from("refund_requests")
    .select("*")
    .eq("booking_id", id)
    .eq("user_id", user?.id)
    .maybeSingle();

  const statusConfig = {
    pending: {
      color: "bg-amber-500",
      icon: Clock,
      text: "Pending Confirmation",
    },
    confirmed: { color: "bg-green-600", icon: CheckCircle2, text: "Confirmed" },
    completed: { color: "bg-blue-600", icon: CheckCircle2, text: "Completed" },
    cancelled: { color: "bg-red-600", icon: AlertCircle, text: "Cancelled" },
  };

  const status =
    statusConfig[booking.booking_status as keyof typeof statusConfig] ||
    statusConfig.pending;
  const StatusIcon = status.icon;

  return (
      <div className="container mx-auto max-w-6xl px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/dashboard/bookings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Link>
        </Button>

        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-3xl font-bold text-balance md:text-4xl">
            Booking Details
          </h1>
          <Badge
            variant={
              booking.booking_status === "confirmed" ? "default" : "outline"
            }
            className="flex items-center gap-1.5"
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {status.text}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Tour Information */}
            <Card>
              <CardHeader>
                <CardTitle className="">Tour Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {booking.tours?.image_url && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={booking.tours.image_url || "/placeholder.svg"}
                        alt={booking.tours.title || "Tour"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-xl font-semibold">
                        {booking.tours?.title}
                      </h3>
                      <Badge variant="secondary">
                        {booking.tours?.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {booking.tours?.description}
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.tours?.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.tours?.duration_days} day(s)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="">Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-sm font-medium text-muted-foreground">
                        Start Date
                      </p>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span className="font-semibold">
                          {new Date(booking.start_date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium text-muted-foreground">
                        Participants
                      </p>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="font-semibold">
                          {booking.number_of_participants} person(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">
                      Special Requests
                    </p>
                    <p className="text-sm">
                      {booking.special_requests ||
                        "No special requests provided"}
                    </p>
                  </div>

                  {booking.additional_info && (
                    <>
                      <Separator />
                      <div>
                        <p className="mb-1 text-sm font-medium text-muted-foreground">
                          Additional Information
                        </p>
                        <p className="text-sm">{booking.additional_info}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Traveler Information */}
            <Card>
              <CardHeader>
                <CardTitle className="">Traveler Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-sm font-medium text-muted-foreground">
                      Full Name
                    </p>
                    <p className="font-medium">
                      {user?.user_metadata?.full_name ?? user?.email}
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-sm font-medium text-muted-foreground">
                        Email
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user?.email}</span>
                      </div>
                    </div>
                    {user?.phone && (
                      <div>
                        <p className="mb-1 text-sm font-medium text-muted-foreground">
                          Phone
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Price per person
                    </span>
                    <span className="font-medium">
                      ${booking.tours?.price_per_person}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Number of participants
                    </span>
                    <span className="font-medium">
                      {booking.number_of_participants}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      ${booking.total_amount}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Payment Status</span>
                    <Badge
                      variant={
                        booking.payment_status === "paid"
                          ? "default"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {booking.payment_status}
                    </Badge>
                  </div>
                  {booking.payment_reference && (
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">
                        Payment Reference
                      </p>
                      <p className="font-mono text-xs">
                        {booking.payment_reference}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Booking Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base ">
                  <Receipt className="h-4 w-4" />
                  Booking Reference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-sm font-semibold">
                  {booking.booking_reference}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Use this reference for any inquiries about your booking
                </p>
              </CardContent>
            </Card>

            {/* Booking Date */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base ">Booked On</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {new Date(booking.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base ">
                  {booking.payment_status === "pending"
                    ? "Complete Payment"
                    : "Need Help?"}
                </CardTitle>
                <CardDescription>
                  {booking.payment_status === "pending"
                    ? "Complete your payment to confirm your booking"
                    : "Contact us for assistance with your booking"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {booking.payment_status === "pending" && (
                  <form action={`/api/bookings/${id}/pay`} method="POST">
                    <Button
                      type="submit"
                      className="w-full bg-primary"
                      size="lg"
                    >
                      Make Payment (${booking.total_amount})
                    </Button>
                  </form>
                )}

                {booking.payment_status === "paid" &&
                  booking.booking_status !== "cancelled" &&
                  !refundRequest && (
                    <Button asChild className="w-full" variant="destructive">
                      <Link href={`/dashboard/bookings/${id}/refund`}>
                        Request Refund
                      </Link>
                    </Button>
                  )}

                <Button
                  asChild
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  <Link href={`/tours/${booking.tours?.slug}`}>
                    View Tour Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default page;
