import { useEffect, useState } from 'react';
import axiosAuth from '../lib/axios';
import { getPendingTrips } from '../utils/tripFilters';
import { TripResponse } from '../types/trip.types';
import { getStoredUser } from '../utils/auth';

export function usePendingTripsCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchTrips = async () => {
      const storedUser = getStoredUser();
      if (!storedUser) return setCount(0);
      const userId = storedUser.userId;
      const now = new Date();
      now.setHours(0,0,0,0);
      try {
        const response = await axiosAuth.get(`/trips/passenger/${userId}`);
        const trips = response.data as TripResponse[];
        const pending = getPendingTrips(trips, userId, now);
        setCount(pending.length);
      } catch {
        setCount(0);
      }
    };
    fetchTrips();
  }, []);

  return count;
}
