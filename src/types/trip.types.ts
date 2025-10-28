import { TripRatingType } from "@/components/TripCard";
import { TripPassengerStatus } from "../enums/trip-passenger-status.enum";
import { TripType } from "../enums/trip-type.enum";

// Trip related types
export interface CreateTripDto {
  driverId: number;
  raceId: number;
  departureDay: string; // Format: YYYY-MM-DD
  departureHour: string; // Format: HH:MM
  departureCity: string;
  departureProvince: string;
  arrivalCity: string;
  arrivalProvince: string;
  description?: string;
  seats: number;
  tripType: TripType;
}

export interface TripRatingResponseDto {
  id: number;
  tripId: number;
  raterId: number;
  ratedId: number;
  type: TripRatingType;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripResponse {
  id: number;
  driver: {
    id: number;
    name: string;
    givenName: string;
    familyName: string;
    email: string;
    pictureUrl: string;
  };
  race: {
    id: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    imageUrl?: string;
  };
   car: {
    id: number;
    brand: string;
    model: string;
    year: number;
    color: string;
    seats: number;
    licensePlate: string;
  };
  departureDay: Date;
  departureHour: string;
  departureCity: string;
  departureProvince: string;
  arrivalCity: string;
  arrivalProvince: string;
  description?: string;
  seats: number;
  availableSeats: number;
  passengers: {
    id: number;
    passenger: {
      id: number;
      name: string;
      givenName: string;
      familyName: string;
      email: string;
      pictureUrl: string;
    };
    status: TripPassengerStatus
  }[];
  createdAt: Date;
  deletedAt?: Date;
  ratings?: TripRatingResponseDto[];
  tripType: TripType;
}

// DTO for joining a trip
export interface JoinTripDto {
  tripId: number;
  passengerId: number;
}

// Response interface for trip passenger
export interface TripPassengerResponse {
  id: number;
  tripId: number;
  passengerId: number;
  status: TripPassengerStatus;
  createdAt: Date;
  tripType?: TripType;
}

// Form data interface for the CreateTrip component
export interface TripFormData {
  raceId: string;
  departureDay: string;
  departureHour: string;
  departureCity: string;
  departureProvince: string;
  arrivalCity: string;
  arrivalProvince: string;
  description: string;
  seats: string;
  tripType: TripType;
}