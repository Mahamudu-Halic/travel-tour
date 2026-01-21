"use client";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { tourSchema, type TourSchemaType } from "@/lib/schema";
import Image from "next/image";
import { compressImage } from "@/lib/image-compress";
import { slugify } from "@/lib/slugify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Type-safe error accessor helper
function getNestedError(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export default function TourForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itineraryDays, setItineraryDays] = useState<string[]>(["day1"]);
  const router = useRouter();
  const form = useForm<TourSchemaType>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      title: "",
      slug: "",
      destination: "",
      duration_days: 1,
      duration_nights: 0,
      price: 0,
      category: "",
      difficulty_level: "",
      max_participants: 1,
      short_description: "",
      description: "",
      included_items: [""],
      excluded_items: [""],
      itinerary: {
        day1: { title: "", activities: [""] },
      },
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // Watch values for rendering
  const watchedIncluded = watch("included_items") || [];
  const watchedExcluded = watch("excluded_items") || [];
  const watchedItinerary = watch("itinerary") || {};

  const onSubmit = async (data: TourSchemaType) => {
    try {
      const formData = new FormData();

      // Append all fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === "image" && value instanceof File) {
          formData.append("image", value);
        } else if (key === "itinerary") {
          formData.append("itinerary", JSON.stringify(value));
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // Submit to API
      const response = await fetch("/api/admin/tours/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create tour");
      }

      const result = await response.json();
      console.log(result);
      toast.success("tour created successfully");
      router.refresh();
      reset();
      setPreview(null);
    } catch {
      toast.error("Failed to create tour");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const compressed = await compressImage(file);
      setPreview(URL.createObjectURL(compressed));
      setValue("image", compressed, { shouldDirty: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleGenerateSlug = () => {
  //   const title = watch("title");
  //   if (title) {
  //     setValue("slug", slugify(title), { shouldDirty: true });
  //   }
  // };

  // Array field handlers
  const addIncludedItem = () => {
    const current = watch("included_items") || [];
    setValue("included_items", [...current, ""], { shouldDirty: true });
  };

  const removeIncludedItem = (index: number) => {
    const current = watch("included_items") || [];
    setValue(
      "included_items",
      current.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  };

  const addExcludedItem = () => {
    const current = watch("excluded_items") || [];
    setValue("excluded_items", [...current, ""], { shouldDirty: true });
  };

  const removeExcludedItem = (index: number) => {
    const current = watch("excluded_items") || [];
    setValue(
      "excluded_items",
      current.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  };

  // Itinerary handlers
  const addDay = () => {
    const newDay = `day${itineraryDays.length + 1}`;
    setItineraryDays([...itineraryDays, newDay]);
    setValue(
      `itinerary.${newDay}`,
      { title: "", activities: [""] },
      { shouldDirty: true },
    );
  };

  const removeDay = (day: string) => {
    if (itineraryDays.length <= 1) return;

    const newDays = itineraryDays.filter((d) => d !== day);
    setItineraryDays(newDays);

    // Create new itinerary object without the removed day
    const currentItinerary = watch("itinerary");
    const newItinerary = { ...currentItinerary };
    delete newItinerary[day];

    // Rename remaining days to maintain sequential naming
    const renamedItinerary: Record<string, any> = {};
    newDays.forEach((oldDay, index) => {
      const newDay = `day${index + 1}`;
      renamedItinerary[newDay] = currentItinerary[oldDay];
    });

    setValue("itinerary", renamedItinerary, { shouldDirty: true });
  };

  const addActivity = (day: string) => {
    const currentActivities = watchedItinerary[day]?.activities || [];
    setValue(`itinerary.${day}.activities`, [...currentActivities, ""], {
      shouldDirty: true,
    });
  };

  const removeActivity = (day: string, index: number) => {
    const currentActivities = watchedItinerary[day]?.activities || [];
    if (currentActivities.length <= 1) return; // Keep at least one activity

    setValue(
      `itinerary.${day}.activities`,
      currentActivities.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  };

  // Get itinerary error safely
  const getItineraryError = (day: string, field: "title" | "activities") => {
    const error = getNestedError(errors, `itinerary.${day}.${field}`);
    return error?.message as string | undefined;
  };

  // Get activity error safely
  const getActivityError = (day: string, index: number) => {
    const error = getNestedError(
      errors,
      `itinerary.${day}.activities.${index}`,
    );
    return error?.message as string | undefined;
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 max-w-4xl mx-auto"
        noValidate
      >
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input
              placeholder="Tour Title"
              {...register("title")}
              className={cn(errors.title && "border-red-500")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Destination *</label>
            <Input
              placeholder="Destination"
              {...register("destination")}
              className={cn(errors.destination && "border-red-500")}
            />
            {errors.destination && (
              <p className="text-sm text-red-500">
                {errors.destination.message}
              </p>
            )}
          </div>

          {/* <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <Input
              placeholder="slug"
              {...register("slug")}
              disabled
              className="flex-1"
            />
            <Button
              size={"sm"}
              type="button"
              variant="outline"
              onClick={handleGenerateSlug}
            >
              Generate
            </Button>
          </div> */}

          <div className="space-y-2">
            <label className="text-sm font-medium">Price (&#8373;) *</label>
            <Input
              type="number"
              step="0.01"
              min="0.00"
              {...register("price", { valueAsNumber: true })}
              placeholder="0.00"
              className={cn(errors.price && "border-red-500")}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration Days *</label>
            <Input
              type="number"
              min="1"
              {...register("duration_days", { valueAsNumber: true })}
              placeholder="Days"
              className={cn(errors.duration_days && "border-red-500")}
            />
            {errors.duration_days && (
              <p className="text-sm text-red-500">
                {errors.duration_days.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration Nights</label>
            <Input
              type="number"
              min="0"
              {...register("duration_nights", { valueAsNumber: true })}
              placeholder="Nights"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category *</label>
            <Select
              onValueChange={(value) =>
                setValue("category", value, { shouldDirty: true })
              }
            >
              <SelectTrigger
                className={cn(
                  "rounded w-full",
                  errors.category && "border-red-500",
                )}
              >
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Adventure">Adventure</SelectItem>
                <SelectItem value="Heritage">Heritage</SelectItem>
                <SelectItem value="Eco-Tourism">Eco-Tourism</SelectItem>
                <SelectItem value="Wildlife">Wildlife</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty Level *</label>
            <Select
              onValueChange={(value) =>
                setValue("difficulty_level", value, { shouldDirty: true })
              }
            >
              <SelectTrigger
                className={cn(
                  "rounded w-full",
                  errors.difficulty_level && "border-red-500",
                )}
              >
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Challenging">Challenging</SelectItem>
              </SelectContent>
            </Select>
            {errors.difficulty_level && (
              <p className="text-sm text-red-500">
                {errors.difficulty_level.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Participants *</label>
            <Input
              type="number"
              min="1"
              {...register("max_participants", { valueAsNumber: true })}
              placeholder="Max participants"
              className={cn(errors.max_participants && "border-red-500")}
            />
            {errors.max_participants && (
              <p className="text-sm text-red-500">
                {errors.max_participants.message}
              </p>
            )}
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Short Description</label>
          <Textarea
            {...register("short_description")}
            placeholder="Brief overview of the tour"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Full Description *</label>
          <Textarea
            {...register("description")}
            placeholder="Detailed description of the tour"
            rows={6}
            className={cn(errors.description && "border-red-500")}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tour Image</label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {preview && (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                  id="image"
                  onChange={handleFileChange}
                />
                <Button asChild variant="outline" className="rounded">
                  <label htmlFor="image" className="cursor-pointer">
                    {loading ? "Processing..." : "Choose Image"}
                  </label>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, or WebP · Max 5MB · Auto-compressed
              </p>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {errors.image && <p className="text-sm text-red-500">required</p>}
        </div>

        {/* Included Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Included Items</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIncludedItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          {watchedIncluded.map((_, index) => (
            <div key={index} className="flex gap-2">
              <Input
                {...register(`included_items.${index}`)}
                placeholder={`Included item ${index + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeIncludedItem(index)}
                disabled={watchedIncluded.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Excluded Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Excluded Items</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addExcludedItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          {watchedExcluded.map((_, index) => (
            <div key={index} className="flex gap-2">
              <Input
                {...register(`excluded_items.${index}`)}
                placeholder={`Excluded item ${index + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeExcludedItem(index)}
                disabled={watchedExcluded.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Itinerary */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Itinerary</h3>
            <Button type="button" variant="outline" onClick={addDay}>
              <Plus className="h-4 w-4 mr-2" />
              Add Day
            </Button>
          </div>

          {itineraryDays.map((day, dayIndex) => (
            <div key={day} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium capitalize">
                  {day} - Day {dayIndex + 1}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDay(day)}
                  disabled={itineraryDays.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Day Title *</label>
                <Input
                  {...register(`itinerary.${day}.title`)}
                  placeholder="e.g., Arrival and Evening Safari"
                  className={cn(
                    getItineraryError(day, "title") && "border-red-500",
                  )}
                />
                {getItineraryError(day, "title") && (
                  <p className="text-sm text-red-500">
                    {getItineraryError(day, "title")}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Activities</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addActivity(day)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                </div>

                {watchedItinerary[day]?.activities?.map((_, activityIndex) => (
                  <div key={activityIndex} className="space-y-1">
                    <div className="flex gap-2">
                      <Input
                        {...register(
                          `itinerary.${day}.activities.${activityIndex}`,
                        )}
                        placeholder={`Activity ${activityIndex + 1}`}
                        className={cn(
                          getActivityError(day, activityIndex) &&
                            "border-red-500",
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeActivity(day, activityIndex)}
                        disabled={
                          (watchedItinerary[day]?.activities?.length || 0) <= 1
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {getActivityError(day, activityIndex) && (
                      <p className="text-sm text-red-500 pl-2">
                        {getActivityError(day, activityIndex)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="pt-6 border-t">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Creating Tour..." : "Create Tour"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
