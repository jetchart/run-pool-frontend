import React from 'react';
import { Badge } from './ui/badge';
import { TripResponse } from '../types/trip.types';
import { getStoredUser } from '../utils/auth';
import { TripPassengerStatus } from '@/enums/trip-passenger-status.enum';
import { CarFront, TriangleAlert, UserIcon } from 'lucide-react';

interface TripRoleBadgeProps {
  trip: TripResponse;
}

export const TripRoleBadge: React.FC<TripRoleBadgeProps> = ({ trip }) => {
  const storedUser = getStoredUser();
  const currentUserId = storedUser?.userId;
  const isDriver = trip.driver.id === currentUserId;
  const isPassenger = !isDriver && trip.passengers.some(p => p.passenger.id === currentUserId);

  if (isDriver) {
    const driverTemplate = <Badge className="bg-green-100 text-green-800 border-green-300"><CarFront /> Sos conductor</Badge>;
    const pendingApprovals = trip.passengers.some(p => p.status === TripPassengerStatus.PENDING);
    if (pendingApprovals) {
      return <div className='flex gap-2'> {driverTemplate} <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300"><TriangleAlert /> Aprobaciones pendientes</Badge></div>;
    }
    return driverTemplate;
  }
  if (isPassenger) {
    const passengerObj = trip.passengers.find(p => p.passenger.id === currentUserId);
    if (passengerObj?.status === TripPassengerStatus.CONFIRMED) {
      return <Badge className="bg-green-100 text-green-800 border-green-300"><UserIcon /> Sos pasajero</Badge>;
    }
    if (passengerObj?.status === TripPassengerStatus.PENDING) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300"><TriangleAlert /> Esperando aprobación</Badge>;
    }
  }
  return null;
};
