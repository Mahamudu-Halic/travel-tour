import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import AddTourForm from "@/components/admin/add-tour-form";
import Empty from "@/components/empty";
import TourActions from "@/components/admin/tour-actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function AdminToursPage() {
  const supabase = await createClient();

  const { data: tours } = await supabase
    .from("tours")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <BreadcrumbPage>Tours</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl ">
              Manage Tours
            </h1>
            <p className="text-muted-foreground">
              Create, edit, and manage tour packages
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Add Tour Form */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 sticky top-4">
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-semibold ">Add New Tour</h2>
                <AddTourForm />
              </CardContent>
            </Card>
          </div>

          {/* Tours List */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-semibold ">
                  Current Tours ({tours?.length ?? 0})
                </h2>
                <div className="space-y-4">
                  {tours && tours.length > 0 ? (
                    tours.map((tour) => (
                      <div
                        key={tour.id}
                        className="flex items-start justify-between rounded-lg border border-border/40 p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {tour.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {tour.destination}
                          </p>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="inline-flex items-center gap-1">
                              <span className="font-medium">Duration:</span>
                              {tour.duration_days} days / {tour.duration_nights}{" "}
                              nights
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="font-medium">Price:</span>&#8373;
                              {tour.price}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                tour.is_active
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {tour.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        <TourActions tourId={tour.id} title={tour.title} />
                      </div>
                    ))
                  ) : (
                    <Empty message="No tours found" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
