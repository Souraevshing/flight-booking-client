// This worker handles CPU-intensive operations like filtering and sorting flights

self.addEventListener("message", (e) => {
  const { action, data } = e.data;

  switch (action) {
    case "filter":
      const filteredFlights = filterFlights(data.flights, data.filters);
      self.postMessage({ action: "filterResult", flights: filteredFlights });
      break;
    case "sort":
      const sortedFlights = sortFlights(data.flights, data.sortBy, data.order);
      self.postMessage({ action: "sortResult", flights: sortedFlights });
      break;
    default:
      self.postMessage({ error: "Unknown action" });
  }
});

function filterFlights(flights, filters) {
  return flights.filter((flight) => {
    // Filter by departure and arrival airports
    if (
      filters.departureAirport &&
      flight.departureAirport !== filters.departureAirport
    )
      return false;
    if (
      filters.arrivalAirport &&
      flight.arrivalAirport !== filters.arrivalAirport
    )
      return false;

    // Filter by departure date
    if (filters.departureDate) {
      const flightDate = new Date(flight.departureTime).toDateString();
      const filterDate = new Date(filters.departureDate).toDateString();
      if (flightDate !== filterDate) return false;
    }

    // Filter by cabin class
    if (filters.cabinClass && flight.cabinClass !== filters.cabinClass)
      return false;

    // Filter by available seats
    const totalPassengers =
      (filters.adults || 0) + (filters.children || 0) + (filters.infants || 0);
    if (totalPassengers > 0 && flight.availableSeats < totalPassengers)
      return false;

    // Filter by price range
    if (filters.minPrice && flight.price < filters.minPrice) return false;
    if (filters.maxPrice && flight.price > filters.maxPrice) return false;

    return true;
  });
}

function sortFlights(flights, sortBy, order) {
  return [...flights].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "price":
        comparison = a.price - b.price;
        break;
      case "duration":
        // Convert duration strings to minutes for comparison
        const durationA = parseDuration(a.duration);
        const durationB = parseDuration(b.duration);
        comparison = durationA - durationB;
        break;
      case "departureTime":
        comparison =
          new Date(a.departureTime).getTime() -
          new Date(b.departureTime).getTime();
        break;
      case "arrivalTime":
        comparison =
          new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
        break;
      default:
        comparison = 0;
    }

    return order === "desc" ? -comparison : comparison;
  });
}

function parseDuration(duration) {
  // Parse duration string like "2h 30m" to minutes
  const hours = duration.match(/(\d+)h/)
    ? Number.parseInt(duration.match(/(\d+)h/)[1])
    : 0;
  const minutes = duration.match(/(\d+)m/)
    ? Number.parseInt(duration.match(/(\d+)m/)[1])
    : 0;
  return hours * 60 + minutes;
}
