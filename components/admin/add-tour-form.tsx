"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AddTourForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    short_description: "",
    destination: "",
    duration_days: 1,
    duration_nights: 0,
    price: "",
    max_participants: 20,
    difficulty_level: "Moderate",
    category: "Cultural",
    image_url: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "duration_days" ||
        name === "duration_nights" ||
        name === "max_participants" ||
        name === "price"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/tours/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create tour");
        return;
      }

      toast.success("Tour created successfully");

      setFormData({
        title: "",
        slug: "",
        description: "",
        short_description: "",
        destination: "",
        duration_days: 1,
        duration_nights: 0,
        price: "",
        max_participants: 20,
        difficulty_level: "Moderate",
        category: "Cultural",
        image_url: "",
      });
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g., Ashanti Heritage Trail"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Slug</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          placeholder="ashanti-heritage-trail"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Destination</label>
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          required
          placeholder="e.g., Kumasi, Ashanti Region"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-2">Days</label>
          <input
            type="number"
            name="duration_days"
            value={formData.duration_days}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Nights</label>
          <input
            type="number"
            name="duration_nights"
            value={formData.duration_nights}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Price (GHS)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          step="0.01"
          min="0"
          placeholder="0.00"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="Cultural">Cultural</option>
          <option value="Eco-Tourism">Eco-Tourism</option>
          <option value="Heritage">Heritage</option>
          <option value="Adventure">Adventure</option>
          <option value="Wildlife">Wildlife</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Difficulty Level
        </label>
        <select
          name="difficulty_level"
          value={formData.difficulty_level}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Challenging">Challenging</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Max Participants
        </label>
        <input
          type="number"
          name="max_participants"
          value={formData.max_participants}
          onChange={handleChange}
          min="1"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Short Description
        </label>
        <textarea
          name="short_description"
          value={formData.short_description}
          onChange={handleChange}
          placeholder="Brief description for listing"
          rows={2}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Full Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Detailed tour description"
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Image URL</label>
        <input
          type="url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : "Create Tour"}
      </Button>
    </form>
  );
}
