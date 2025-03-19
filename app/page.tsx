import Link from "next/link";

import FlightSearch from "@/components/flight-search";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Flight Booking System</h1>
          <div className="flex gap-4">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Link href="/api/auth/signout">
                  <Button variant="outline">Sign Out</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Find Your Flight</h2>
          <FlightSearch />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-2">Flexible Booking</h3>
            <p className="text-muted-foreground">
              Change or cancel your flight with no additional fees
            </p>
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-2">Best Price Guarantee</h3>
            <p className="text-muted-foreground">
              Find a lower price and we&apos;ll match it
            </p>
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-muted-foreground">
              Get assistance anytime, anywhere
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
