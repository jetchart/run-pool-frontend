import React from 'react';
import { Badge } from './ui/badge';
import { ArrowBigRight, ArrowBigLeft } from 'lucide-react';
import { TripResponse } from '../types/trip.types';
import { TripType } from '@/enums/trip-type.enum';

interface TripTypeBadgeProps {
  trip: TripResponse;
}

export const TripTypeBadge: React.FC<TripTypeBadgeProps> = ({ trip }) => {
  if (trip.tripType === TripType.OUTBAND) {
    return (
      <Badge variant="default">
        <ArrowBigRight /> Ida
      </Badge>
    );
  }
  if (trip.tripType === TripType.RETURN) {
    return (
      <Badge variant="default">
        <ArrowBigLeft /> Vuelta
      </Badge>
    );
  }
  return null;
};
