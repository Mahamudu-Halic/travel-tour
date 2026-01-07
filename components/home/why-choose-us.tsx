import { Card, CardContent } from "../ui/card";
import { Calendar, Star, Users } from "lucide-react";

const WhyChooseUs = () => {
  return (
    <section className="bg-muted/30 py-16 md:py-24 mb-0!">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-balance md:text-4xl ">
            Why Choose BESEPA
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Your trusted partner for authentic cultural and eco-tourism
            experiences in Ghana
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Expert Guides</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our knowledgeable local guides bring Ghana&apos;s history and
                culture to life with authentic stories and deep insights
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Small Groups</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Intimate group sizes ensure personalized attention and
                meaningful connections with local communities
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Flexible Booking</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Easy online booking, secure payments, and flexible cancellation
                policies for your peace of mind
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
