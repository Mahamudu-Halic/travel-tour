import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";

const Introduction = () => {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent z-1" />
      <Image
        src={
          "https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg"
        }
        alt="home"
        priority
        loading="eager"
        fill
        className="object-cover w-full h-full absolute top-0 left-0 z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-3xl">
          <Badge className="bg-amber-600/90 text-white hover:bg-amber-600 text-sm px-4 py-1.5 border-0">
            Authentic Cultural Experiences
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Reconnect. Experience. Preserve.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Authentic eco-cultural experience rooted in the heritage of Asanteman
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-lg px-8"
            >
              <Link href="/tours">
                Explore Our Tours
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white hover:bg-white/20 text-white"
            >
              <Link href="/dashboard/bookings">Book an Experience</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
