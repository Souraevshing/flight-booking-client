import { getSession } from "@/lib/auth";
import type { BookingDto } from "@/lib/types/booking-dto";
import { BookingStatus, CabinClass, TripType } from "@/lib/types/flights";
import { type NextRequest, NextResponse } from "next/server";

// Mock bookings data
const mockBookings: BookingDto[] = [
  {
    id: "booking-1",
    userId: "1",
    flightDetails: {
      destination: "LAX",
      departureDate: "2023-12-25",
    },
    passengers: 2,
    status: BookingStatus.Confirmed,
    price: 450,
    createdAt: "2023-11-15T10:30:00Z",
    bookingId: "BK12345",
    flightId: "flight-1",
    bookingDate: "2023-11-15",
    totalPrice: 900,
    airline: "Delta",
    flightNumber: "DL1234",
    from: "JFK",
    to: "LAX",
    departureDate: "2023-12-25",
    departureTime: "08:30",
    arrivalTime: "11:45",
    duration: "3h 15m",
    stops: 0,
    cabinClass: CabinClass.Economy,
    tripType: TripType.OneWay,
  },
  {
    id: "booking-2",
    userId: "1",
    flightDetails: {
      destination: "SFO",
      departureDate: "2024-01-15",
      returnDate: "2024-01-22",
    },
    passengers: 1,
    status: BookingStatus.Confirmed,
    price: 650,
    createdAt: "2023-12-01T14:45:00Z",
    bookingId: "BK12346",
    flightId: "flight-2",
    bookingDate: "2023-12-01",
    totalPrice: 650,
    airline: "United",
    flightNumber: "UA5678",
    from: "ORD",
    to: "SFO",
    departureDate: "2024-01-15",
    departureTime: "10:15",
    arrivalTime: "13:00",
    duration: "4h 45m",
    stops: 1,
    cabinClass: CabinClass.Business,
    tripType: TripType.RoundTrip,
    returnFlightId: "flight-3",
    returnDepartureDate: "2024-01-22",
    returnDepartureTime: "14:30",
    returnArrivalTime: "20:45",
  },
  {
    id: "booking-3",
    userId: "1",
    flightDetails: {
      destination: "MIA",
      departureDate: "2023-11-10",
    },
    passengers: 3,
    status: BookingStatus.Cancelled,
    price: 350,
    createdAt: "2023-10-05T09:15:00Z",
    bookingId: "BK12347",
    flightId: "flight-4",
    bookingDate: "2023-10-05",
    totalPrice: 1050,
    airline: "American",
    flightNumber: "AA9012",
    from: "DFW",
    to: "MIA",
    departureDate: "2023-11-10",
    departureTime: "07:45",
    arrivalTime: "11:30",
    duration: "3h 45m",
    stops: 0,
    cabinClass: CabinClass.Economy,
    tripType: TripType.OneWay,
  },
];

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const bookings = fetch("http://localhost:5000/api/v1/flights/booking");

  console.log((await bookings).json());
  console.log(mockBookings);

  // Filter bookings by user ID
  const userBookings = mockBookings.filter(
    (booking) => booking.userId === session.user.id
  );

  console.log(userBookings);
  fetch("")
    .then((res) => console.log(res.json()))
    .catch((err) => console.log(err));

  return NextResponse.json(userBookings);
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const bookingData = await request.json();

    // Create new booking
    const newBooking: BookingDto = {
      id: `booking-${mockBookings.length + 1}`,
      userId: session.user.id,
      ...bookingData,
      status: BookingStatus.Confirmed,
      createdAt: new Date().toISOString(),
      bookingDate: new Date().toISOString().split("T")[0],
    };

    // In a real app, you would save this to your database
    mockBookings.push(newBooking);

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { message: "Failed to create booking" },
      { status: 500 }
    );
  }
}
