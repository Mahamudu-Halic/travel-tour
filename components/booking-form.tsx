"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface BookingFormProps {
  tour: {
    id: string
    slug: string
    title: string
    price: number
    max_participants: number
  }
  user: {
    id: string
    email?: string
    user_metadata?: {
      full_name?: string
    }
    phone?: string
  }
}

export function BookingForm({ tour, user }: BookingFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    fullName: user.user_metadata?.full_name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    participants: 1,
    specialRequests: "",
  })

  const totalAmount = tour.price * formData.participants

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!date) {
      setError("Please select a start date")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour.id,
          tourSlug: tour.slug,
          startDate: format(date, "yyyy-MM-dd"),
          participants: formData.participants,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests,
          totalAmount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking")
      }

      // Initialize Paystack payment
      if (data.bookingId && data.paystackAuthUrl) {
        window.location.href = data.paystackAuthUrl
      } else {
        router.push(`/dashboard/bookings/${data.bookingId}`)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="">Booking Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                required
                placeholder="+233 XX XXX XXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="participants">Number of Participants *</Label>
              <Input
                id="participants"
                type="number"
                min="1"
                max={tour.max_participants}
                required
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: Number.parseInt(e.target.value) })}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Start Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-transparent"
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <Textarea
              id="specialRequests"
              placeholder="Any dietary restrictions, accessibility needs, or special requests..."
              rows={4}
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="rounded-lg border border-border/40 bg-muted/30 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Price per person</span>
              <span className="font-medium">&#8373;{tour.price}</span>
            </div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Number of participants</span>
              <span className="font-medium">{formData.participants}</span>
            </div>
            <div className="border-t border-border/40 pt-2 mt-2 flex items-center justify-between">
              <span className="font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-primary">&#8373;{totalAmount}</span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By proceeding, you agree to our terms and conditions. Your payment will be processed securely via Paystack.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
