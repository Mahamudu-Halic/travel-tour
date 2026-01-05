"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, Coins } from "lucide-react"

interface RefundRequestFormProps {
  booking: {
    id: string
    total_amount: number
    tours: {
      title: string
    }
  }
}

export function RefundRequestForm({ booking }: RefundRequestFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reason, setReason] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!reason.trim()) {
      setError("Please provide a reason for your refund request")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/refunds/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          reason: reason.trim(),
          refundAmount: booking.total_amount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit refund request")
      }

      router.push(`/dashboard/bookings/${booking.id}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="">Booking Information</CardTitle>
          <CardDescription>Review the details of the booking you want to refund</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Tour</p>
            <p className="font-medium">{booking.tours.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Refund Amount</p>
              <p className="text-xl font-bold text-primary">&#8373;{booking.total_amount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="">Refund Reason</CardTitle>
          <CardDescription>Please explain why you are requesting a refund</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Refund *</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a detailed explanation for your refund request..."
              rows={6}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">A detailed explanation helps us process your request faster</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-medium">Important Information</p>
              <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                <li>Refund requests are reviewed within 2-3 business days</li>
                <li>Approved refunds are processed within 7-10 business days</li>
                <li>Refund amount depends on cancellation timing and our policy</li>
                <li>You will receive email updates on your request status</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1 bg-transparent"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Refund Request"}
        </Button>
      </div>
    </form>
  )
}
