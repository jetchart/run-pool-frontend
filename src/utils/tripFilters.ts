import { TripResponse } from '../types/trip.types';
import { TripPassengerStatus } from '@/enums/trip-passenger-status.enum';

export function getUpcomingTrips(trips: TripResponse[], userId: number, now: Date) {
  return trips.filter(trip =>
    new Date(trip.departureDay) >= now &&
    trip.passengers.some(p => p.passenger.id === userId && p.status === TripPassengerStatus.CONFIRMED)
  );
}

export function getPastTrips(trips: TripResponse[], now: Date) {
  return trips.filter(trip => new Date(trip.departureDay) < now);
}

export function getPendingTrips(trips: TripResponse[], userId: number, now: Date) {
  return trips.filter(trip =>
    trip.passengers.some(p =>
      (trip.driver.id === userId || p.passenger.id === userId) &&
      new Date(trip.departureDay) >= now &&
      p.status === TripPassengerStatus.PENDING
    )
  );
}
