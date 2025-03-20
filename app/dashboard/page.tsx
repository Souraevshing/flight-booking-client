import BookingHistory from "@/components/booking-history";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfile from "@/components/user-profile";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getSession();

  // if (!session) {
  //   redirect("/login")
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Bookings</CardTitle>
            <CardDescription>Your flight bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Trips</CardTitle>
            <CardDescription>Flights in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">1</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Loyalty Points</CardTitle>
            <CardDescription>Current reward points</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">2,450</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings">
          <BookingHistory />
        </TabsContent>
        <TabsContent value="profile">
          <UserProfile user={session.user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
