import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Flight } from "@/lib/types/flights";
import { Clock, Plane } from "lucide-react";
import { toast } from "sonner";

async function getFlights(searchParams: URLSearchParams): Promise<Flight[]> {
  const response = await fetch(
    `/api/flights/search?${searchParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    toast.error("Failed to fetch flights");
    throw new Error("Failed to fetch flights");
  }

  toast.success("Flights fetched successfully");
  return response.json();
}

export default async function FlightResults({
  searchParams,
}: {
  searchParams: URLSearchParams;
}) {
  const flights = await getFlights(searchParams);

  if (flights.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold mb-2">No Flights Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria to find more results.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <FlightCard
          key={flight.id}
          flight={flight}
          searchParams={searchParams}
        />
      ))}
    </div>
  );
}

function FlightCard({
  flight,
  searchParams,
}: {
  flight: Flight;
  searchParams: URLSearchParams;
}) {
  const passengers = searchParams.get("passengers") || "1";
  const cabinClass = searchParams.get("cabinClass") || "Economy";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tripType = searchParams.get("tripType") || "OneWay";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <img
                src={flight.airlineLogo || "/placeholder.svg"}
                alt={flight.airline}
                className="w-6 h-6"
              />
            </div>
            <div>
              <h3 className="font-semibold">{flight.airline}</h3>
              <p className="text-sm text-muted-foreground">
                {flight.flightNumber}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">${flight.price}</p>
            <p className="text-sm text-muted-foreground">per person</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <p className="text-xl font-semibold">{flight.departureTime}</p>
            <p className="text-sm font-medium">{flight.departureAirport}</p>
          </div>
          <div className="flex-1 mx-4">
            <div className="relative">
              <div className="border-t border-dashed border-muted-foreground"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                <Plane className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex justify-center mt-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {flight.duration}
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold">{flight.arrivalTime}</p>
            <p className="text-sm font-medium">{flight.arrivalAirport}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {flight.stops === 0 ? (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Direct
              </Badge>
            ) : (
              <Badge variant="outline">
                {flight.stops} {flight.stops === 1 ? "Stop" : "Stops"}
              </Badge>
            )}
            <Badge variant="outline">{cabinClass}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {passengers}{" "}
            {Number.parseInt(passengers) === 1 ? "Passenger" : "Passengers"}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Select Flight</Button>
      </CardFooter>
    </Card>
  );
}
