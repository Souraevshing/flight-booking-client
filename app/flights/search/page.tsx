/* eslint-disable @typescript-eslint/no-unused-vars */
import FlightFilters from "@/components/flight-filters";
import FlightResults from "@/components/flight-results";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/auth";
import type { Flight } from "@/lib/types/flights";
import { Suspense } from "react";

// Function to fetch flights based on search params
async function getFlights(searchParams: URLSearchParams): Promise<Flight[]> {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || ""
    }/api/flights/search?${searchParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch flights");
  }

  return response.json();
}

export default async function FlightSearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();

  // if (!session) {
  //   redirect("/login")
  // }

  // Convert searchParams to URLSearchParams
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      params.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Flight Search Results</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FlightFilters searchParams={searchParams} />
        </div>

        <div className="lg:col-span-3">
          <Suspense
            fallback={
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between mb-4">
                      <Skeleton className="h-8 w-1/3" />
                      <Skeleton className="h-8 w-1/4" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <FlightResults searchParams={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
