import { getSession } from "@/lib/auth";
import { generateMockFlights } from "@/lib/mock-data";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const session = await getSession();

  // if (!session) {
  //   return NextResponse.json({ message: "Authentication required" }, { status: 401 })
  // }

  // Get search parameters
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const departureDate = searchParams.get("departureDate") || "";

  // Generate mock flights based on search criteria
  const flights = generateMockFlights(from, to, departureDate, 10);

  return NextResponse.json(flights);
}
