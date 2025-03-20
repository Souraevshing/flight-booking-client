"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Airline, DepartureTime, StopType } from "@/lib/types/flights";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function FlightFilters({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [priceRange, setPriceRange] = useState<[number, number]>([200, 1000]);

  const [selectedAirlines, setSelectedAirlines] = useState<{
    [key in Airline]?: boolean;
  }>({
    [Airline.DELTA]: false,
    [Airline.UNITED]: false,
    [Airline.AMERICAN]: false,
    [Airline.SPIRIT]: false,
    [Airline.JET_BLUE]: false,
  });

  const [stops, setStops] = useState<{
    [key in StopType]?: boolean;
  }>({
    [StopType.DIRECT]: false,
    [StopType.ONE_STOP]: false,
    [StopType.MULTI_STOP]: false,
  });

  const [departureTimes, setDepartureTimes] = useState<{
    [key in DepartureTime]?: boolean;
  }>({
    [DepartureTime.MORNING]: false,
    [DepartureTime.AFTERNOON]: false,
    [DepartureTime.EVENING]: false,
  });

  const applyFilters = () => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === "string") {
        params.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      }
    });

    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());

    const selectedAirlinesList = Object.entries(selectedAirlines)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, selected]) => selected)
      .map(([airline]) => airline);

    if (selectedAirlinesList.length > 0) {
      params.set("airlineList", JSON.stringify(selectedAirlinesList));
    }

    const stopsFilter = {
      direct: stops[StopType.DIRECT] || false,
      oneStop: stops[StopType.ONE_STOP] || false,
      multiStop: stops[StopType.MULTI_STOP] || false,
    };

    if (Object.values(stopsFilter).some(Boolean)) {
      params.set("stops", JSON.stringify(stopsFilter));
    }
    const departureTimeFilter = {
      morning: departureTimes[DepartureTime.MORNING] || false,
      afternoon: departureTimes[DepartureTime.AFTERNOON] || false,
      evening: departureTimes[DepartureTime.EVENING] || false,
    };

    if (Object.values(departureTimeFilter).some(Boolean)) {
      params.set("departureTime", JSON.stringify(departureTimeFilter));
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    setPriceRange([200, 1000]);
    setSelectedAirlines({
      [Airline.DELTA]: false,
      [Airline.UNITED]: false,
      [Airline.AMERICAN]: false,
      [Airline.SPIRIT]: false,
      [Airline.JET_BLUE]: false,
    });
    setStops({
      [StopType.DIRECT]: false,
      [StopType.ONE_STOP]: false,
      [StopType.MULTI_STOP]: false,
    });
    setDepartureTimes({
      [DepartureTime.MORNING]: false,
      [DepartureTime.AFTERNOON]: false,
      [DepartureTime.EVENING]: false,
    });

    const basicParams = new URLSearchParams();
    [
      "from",
      "to",
      "departureDate",
      "returnDate",
      "passengers",
      "cabinClass",
      "tripType",
    ].forEach((param) => {
      const value = searchParams[param];
      if (value) {
        basicParams.set(param, Array.isArray(value) ? value[0] : value);
      }
    });

    router.push(`${pathname}?${basicParams.toString()}`);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion
          type="multiple"
          defaultValue={["price", "airlines", "stops", "departure"]}
        >
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider
                  defaultValue={priceRange}
                  min={100}
                  max={2000}
                  step={50}
                  value={priceRange}
                  onValueChange={(value) =>
                    setPriceRange(value as [number, number])
                  }
                />
                <div className="flex justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="airlines">
            <AccordionTrigger>Airlines</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {Object.values(Airline).map((airline) => (
                  <div key={airline} className="flex items-center space-x-2">
                    <Checkbox
                      id={`airline-${airline}`}
                      checked={selectedAirlines[airline] || false}
                      onCheckedChange={(checked) =>
                        setSelectedAirlines({
                          ...selectedAirlines,
                          [airline]: checked === true,
                        })
                      }
                    />
                    <Label htmlFor={`airline-${airline}`}>{airline}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="stops">
            <AccordionTrigger>Stops</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="direct"
                    checked={stops[StopType.DIRECT] || false}
                    onCheckedChange={(checked) =>
                      setStops({
                        ...stops,
                        [StopType.DIRECT]: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="direct">Direct</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="one-stop"
                    checked={stops[StopType.ONE_STOP] || false}
                    onCheckedChange={(checked) =>
                      setStops({
                        ...stops,
                        [StopType.ONE_STOP]: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="one-stop">1 Stop</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="multi-stop"
                    checked={stops[StopType.MULTI_STOP] || false}
                    onCheckedChange={(checked) =>
                      setStops({
                        ...stops,
                        [StopType.MULTI_STOP]: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="multi-stop">2+ Stops</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="departure">
            <AccordionTrigger>Departure Time</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="morning"
                    checked={departureTimes[DepartureTime.MORNING] || false}
                    onCheckedChange={(checked) =>
                      setDepartureTimes({
                        ...departureTimes,
                        [DepartureTime.MORNING]: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="morning">Morning (5:00 - 11:59)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="afternoon"
                    checked={departureTimes[DepartureTime.AFTERNOON] || false}
                    onCheckedChange={(checked) =>
                      setDepartureTimes({
                        ...departureTimes,
                        [DepartureTime.AFTERNOON]: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="afternoon">Afternoon (12:00 - 17:59)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="evening"
                    checked={departureTimes[DepartureTime.EVENING] || false}
                    onCheckedChange={(checked) =>
                      setDepartureTimes({
                        ...departureTimes,
                        [DepartureTime.EVENING]: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="evening">Evening (18:00 - 23:59)</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex space-x-2 mt-6">
          <Button variant="outline" onClick={resetFilters} className="flex-1">
            Reset
          </Button>
          <Button onClick={applyFilters} className="flex-1">
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
