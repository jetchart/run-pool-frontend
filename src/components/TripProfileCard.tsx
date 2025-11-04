export interface TripProfileCardProps {
  trip: TripResponse;
  userRole: 'driver' | 'passenger';
  onDetails: () => void;
  onRated?: () => void; // callback para recargar trips
}
import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Calendar, StarIcon, CheckIcon } from 'lucide-react';

import { TripResponse } from '../types/trip.types';
import { TripRatingModal } from './TripRatingModal';
import { TripRatingType } from './TripCard';
import { getStoredUser } from '../utils/auth';
import { TripType } from '@/enums/trip-type.enum';
import { PassengerRatingModal } from './PassengerRatingModal';

export const TripProfileCard: React.FC<TripProfileCardProps> = ({ trip, userRole, onDetails, onRated }) => {
  const imageUrl = trip.race?.imageUrl || '/default-race.jpg';
  const raceName = trip.race?.name || '';
  const raceDate = trip.race?.startDate ? new Date(trip.race.startDate).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
  const raceLocation = trip.race?.location || '';
  const tripDate = trip.departureDay ? new Date(trip.departureDay).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
  const departureCity = trip.departureCity;
  const destination = trip.arrivalCity ? `${trip.arrivalCity}${trip.arrivalProvince ? ', ' + trip.arrivalProvince : ''}` : '';
  const seats = trip.seats;
  const occupied = trip.seats - trip.availableSeats;

  // Calificación
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showPassengerRatingModal, setShowPassengerRatingModal] = useState(false);
  const storedUser = getStoredUser();
  const currentUserId = storedUser?.userId;
  const isPassenger = userRole === 'passenger';
  const tripDay = new Date(trip.departureDay);
  const today = new Date();
  today.setHours(0,0,0,0);
  const isPastTrip = tripDay <= today;

  // Handler para cerrar el modal y recargar trips si corresponde
  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    if (onRated) onRated();
  };
  const handleOpenPassengerRatingModal = () => setShowPassengerRatingModal(true);
  const handleClosePassengerRatingModal = () => {
    setShowPassengerRatingModal(false);
    if (onRated) onRated();
  };

  return (
    <>
      <div className="rounded-2xl shadow bg-white overflow-hidden max-w-md w-full">
        {/* Imagen con overlay y texto */}
        <div className="h-32 w-full relative overflow-hidden">
          <img src={imageUrl} alt={raceName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute left-0 bottom-0 w-full px-4 pb-2 pt-2">
            <div className="font-semibold text-base leading-tight mb-0.5 line-clamp-1 text-white drop-shadow-sm">{raceName}</div>
            <div className="flex items-center text-[11px] text-white gap-1 mb-0.5 drop-shadow-sm">
              <Calendar className="w-3 h-3 mr-1" />
              {raceDate}
              <span className="mx-0.5">•</span>
              {raceLocation}
            </div>
          </div>
        </div>
        {/* Card body */}
        <div className="px-4 pb-4 pt-2 mt-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant={userRole === 'driver' ? 'default' : 'secondary'} className="text-xs px-3 py-1">
                {userRole === 'driver' ? 'Conductor' : 'Pasajero'}
              </Badge>
              <Badge variant="outline" >
                {trip.tripType === TripType.OUTBAND ? 'Ida' : 'Vuelta'}
              </Badge>
            </div>
            <span className="text-xs text-gray-500 font-medium">{tripDate}</span>
          </div>
          <div className="mb-2">
            <div className="text-xs text-gray-500 font-medium mb-1">Salida</div>
            <div className="text-sm font-semibold">{departureCity}</div>
          </div>
          <div className="mb-2">
            <div className="text-xs text-gray-500 font-medium mb-1">Destino</div>
            <div className="text-sm font-semibold">{destination}</div>
          </div>
          <div className="flex items-center justify-between border-t pt-3 mt-3">
            <span className="text-sm text-gray-600">
              {occupied}/{seats} lugares ocupados
            </span>
            <button
              className="text-sm font-medium text-black hover:underline"
              onClick={onDetails}
            >
              Ver detalles
            </button>
          </div>

          {/* Botón Calificar solo si es pasajero y el viaje ya pasó */}
          {isPassenger && isPastTrip && trip.ratings?.length === 0 && (
            <button
              className="w-full mt-3 flex items-center justify-center gap-1 border border-gray-300 rounded-lg py-1 text-sm hover:bg-gray-50"
              onClick={() => setShowRatingModal(true)}
            >
              <StarIcon className="w-4 h-4"/><span className="text-xs">Calificar</span>
            </button>
          )}
          {/* Botón para conductor calificar pasajeros */}
          {userRole === 'driver' && isPastTrip && trip.ratings?.length === 0 && trip.passengers && trip.passengers.length > 0 && (
            trip.passengers.some(p => p.passenger.id !== currentUserId) && (
              <button
                className="w-full mt-3 flex items-center justify-center gap-1 border border-gray-300 rounded-lg py-1 text-sm hover:bg-gray-50"
                onClick={handleOpenPassengerRatingModal}
              >
                <StarIcon className="w-4 h-4"/><span className="text-xs">Calificar</span>
              </button>
            )
          )}
          {/* Botón Calificado */}
          {isPastTrip && trip.ratings && trip.ratings.length > 0 && (
            <button
              className="w-full mt-3 flex items-center justify-center gap-1 border border-green-200 bg-green-50 text-green-700 rounded-lg py-1"
              disabled
            >
              <CheckIcon className="w-4 h-4 text-green-600"/><span className="text-xs">Calificado</span>
            </button>
          )}
        </div>
      </div>
      {/* Modal de calificación */}
      {isPassenger && (
        <TripRatingModal
          open={showRatingModal}
          onClose={handleCloseRatingModal}
          trip={trip}
          raterId={currentUserId}
          ratedId={trip.driver.id}
          ratedName={trip.driver.name}
          ratedPictureUrl={trip.driver.pictureUrl}
          fromCity={trip.departureCity}
          toCity={trip.arrivalCity}
          ratingType={TripRatingType.PASSENGER_TO_DRIVER}
        />
      )}
      {/* Modal de calificación de pasajeros para conductor */}
      {userRole === 'driver' && (
        <PassengerRatingModal
          open={showPassengerRatingModal}
          onClose={handleClosePassengerRatingModal}
          tripId={trip.id}
          passengers={trip.passengers.filter(p => p.passenger.id !== currentUserId).map(p => ({ id: p.passenger.id, name: p.passenger.name, pictureUrl: p.passenger.pictureUrl }))}
          driverId={trip.driver.id}
          race={trip.race}
        />
      )}
    </>
  );
}
