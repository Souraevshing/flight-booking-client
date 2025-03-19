"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CabinClass, TripType } from "@/lib/types/flights";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  from: z.string().min(3, {
    message: "Origin is required",
  }),
  to: z.string().min(3, {
    message: "Destination is required",
  }),
  departureDate: z.date({
    required_error: "Departure date is required",
  }),
  returnDate: z.date().optional(),
  passengers: z.string().min(1, {
    message: "At least 1 passenger is required",
  }),
  cabinClass: z.string(),
  tripType: z.string(),
});

export default function FlightSearch() {
  const router = useRouter();
  const [tripType, setTripType] = useState<string>(TripType.OneWay);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from: "",
      to: "",
      passengers: "1",
      cabinClass: CabinClass.Economy,
      tripType: TripType.OneWay,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const searchParams = new URLSearchParams({
      from: values.from,
      to: values.to,
      departureDate: format(values.departureDate, "yyyy-MM-dd"),
      passengers: values.passengers,
      cabinClass: values.cabinClass,
      tripType: values.tripType,
    });

    if (values.returnDate && values.tripType === TripType.RoundTrip) {
      searchParams.append(
        "returnDate",
        format(values.returnDate, "yyyy-MM-dd")
      );
    }

    router.push(`/flights/search?${searchParams.toString()}`);
  }

  return (
    <Tabs
      defaultValue={TripType.OneWay}
      onValueChange={(value) => {
        setTripType(value);
        form.setValue("tripType", value);
      }}
      className="w-full"
    >
      <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
        <TabsTrigger value={TripType.OneWay}>One Way</TabsTrigger>
        <TabsTrigger value={TripType.RoundTrip}>Round Trip</TabsTrigger>
      </TabsList>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <FormControl>
                    <Input placeholder="City or airport" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input placeholder="City or airport" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Departure Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {tripType === TripType.RoundTrip && (
              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Return Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const departureDate =
                              form.getValues("departureDate");
                            return (
                              date <
                                new Date(new Date().setHours(0, 0, 0, 0)) ||
                              (departureDate && date < departureDate)
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="passengers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passengers</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="9"
                      placeholder="Number of passengers"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cabinClass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cabin Class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cabin class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={CabinClass.Economy}>
                        Economy
                      </SelectItem>
                      <SelectItem value={CabinClass.Business}>
                        Business
                      </SelectItem>
                      <SelectItem value={CabinClass.FirstClass}>
                        First Class
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Search Flights
          </Button>
        </form>
      </Form>
    </Tabs>
  );
}
