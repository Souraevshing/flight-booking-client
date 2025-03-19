"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { BookingDto } from "@/lib/types/booking-dto";
import { BookingStatus } from "@/lib/types/flights";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BookingHistory() {
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/bookings");
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
          toast.success("Bookings fetched successfully");
        } else {
          toast.error("Failed to fetch bookings");
          console.error("Failed to fetch bookings");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          console.error("Error fetching bookings:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Confirmed:
        return "default";
      case BookingStatus.Pending:
        return "outline";
      case BookingStatus.Cancelled:
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-1/4" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Bookings Found</CardTitle>
          <CardDescription>
            You haven&apos;t made any bookings yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Start by searching for flights and making your first booking.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/")}>Search Flights</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="w-full">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>
                  {booking.from} to {booking.to}
                </CardTitle>
                <CardDescription>
                  Booking ID: {booking.bookingId}
                </CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(booking.status)}>
                {booking.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Flight Details</p>
                <p className="text-sm text-muted-foreground">
                  {booking.airline} • {booking.flightNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(booking.departureDate), "PPP")} •{" "}
                  {booking.departureTime} - {booking.arrivalTime}
                </p>
                <p className="text-sm text-muted-foreground">
                  Duration: {booking.duration} • Stops: {booking.stops}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Passenger Information</p>
                <p className="text-sm text-muted-foreground">
                  {booking.passengers} Passenger(s) • {booking.cabinClass}
                </p>
                <p className="text-sm font-medium mt-2">Price</p>
                <p className="text-sm text-muted-foreground">
                  ${booking.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push(`/bookings/${booking.id}`)}
            >
              View Details
            </Button>
            {booking.status !== BookingStatus.Cancelled && (
              <Button
                variant="destructive"
                onClick={() => {
                  // Handle cancellation
                }}
              >
                Cancel Booking
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
