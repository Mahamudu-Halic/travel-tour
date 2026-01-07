import { ToursType } from "@/components/tours/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
const TourInformation = ({tours}: {tours: ToursType}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="">Tour Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tours?.image_url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={tours.image_url || "/placeholder.svg"}
                alt={tours.title || "Tour"}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-xl font-semibold">{tours?.title}</h3>
              <Badge variant="secondary">{tours?.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {tours?.description}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{tours?.destination}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{tours?.duration_days} day(s)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourInformation;
