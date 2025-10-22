// Enum para el tipo de calificación
export enum TripRatingType {
  DRIVER_TO_PASSENGER = 'driver_to_passenger',
  PASSENGER_TO_DRIVER = 'passenger_to_driver',
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Calendar, Star, Users} from 'lucide-react';
import { TripResponse } from '../types/trip.types';
import { getStoredUser } from '../utils/auth';
import { formatDateTime } from '../constants/dates';
import { getAvailabilityColor, getAvailabilityText } from '../utils/styles';

interface TripCardProps {
  trip: TripResponse;
  showRole?: boolean; // Para mostrar si es conductor o pasajero
  userRole?: 'driver' | 'passenger'; // Rol del usuario actual
}

export const TripCard: React.FC<TripCardProps> = ({ 
  trip, 
  showRole = false, 
  userRole 
}) => {
  const navigate = useNavigate();

  const [showRatingModal, setShowRatingModal] = useState(false);
  const storedUser = getStoredUser();
  const currentUserId = storedUser?.userId;
  const isPassenger = userRole === 'passenger';

  // Comparar solo la fecha (sin hora)
  const tripDate = new Date(trip.departureDay);
  const today = new Date();
  today.setHours(0,0,0,0);
  const isPastTrip = tripDate <= today;

  return (
    <>
      <Card className="p-4">
      {/* Imagen/gráfico de ruta */}
      <div className="h-24 bg-gray-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
        {/* SVG solo para línea y círculos */}
        <div className="w-60 h-10 flex items-center justify-center flex-shrink-0">
          <svg width="240" height="40" viewBox="0 0 240 40" className="block" style={{ width: '240px', height: '40px' }}>
            <path 
              d="M25 30 Q80 5 120 25 Q160 40 215 20" 
              stroke="#1f2937" 
              strokeWidth="3" 
              fill="none"
            />
            <circle cx="25" cy="30" r="6" stroke="#000000" fill="#ffffff" strokeWidth="2" />
            <circle cx="215" cy="20" r="6" stroke="#000000" fill="#ffffff" strokeWidth="2" />
          </svg>
        </div>
        
        {/* Textos posicionados absolutamente cerca de los círculos */}
        <span className="absolute text-xs text-gray-700 text-center transform -translate-x-1/2" 
              style={{ left: 'calc(50% - 95px)', bottom: '14px' }}>
          {trip.departureCity}
        </span>
        <span className="absolute text-xs text-gray-700 text-center transform -translate-x-1/2" 
              style={{ left: 'calc(50% + 95px)', top: '22px' }}>
          {trip.arrivalCity}
        </span>
      </div>

      {/* Badge de rol si se especifica */}
      {showRole && userRole && (
        <div className="mb-3">
          <Badge 
            variant={userRole === 'driver' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {userRole === 'driver' ? 'Conductor' : 'Pasajero'}
          </Badge>
        </div>
      )}

      {/* Origen */}
      <div className="flex items-start mb-3">
        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
        <div>
          <div className="font-medium text-sm">{trip.departureCity}</div>
          <div className="text-xs text-gray-500">{trip.departureProvince}</div>
        </div>
      </div>

      {/* Destino */}
      <div className="flex items-start mb-3">
        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
        <div>
          <div className="font-medium text-sm">
            {trip.arrivalCity}
          </div>
          <div className="text-xs text-gray-500">
            {trip.arrivalProvince}
          </div>
        </div>
      </div>

      {/* Fecha y hora */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Calendar className="w-4 h-4 mr-2" />
        {formatDateTime(trip.departureDay, trip.departureHour)}
      </div>

      {/* Driver info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium mr-3 overflow-hidden">
            {trip.driver.pictureUrl ? (
              <img 
                src={trip.driver.pictureUrl} 
                alt={trip.driver.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{trip.driver.givenName?.[0]}{trip.driver.familyName?.[0]}</span>
            )}
          </div>
          <div>
            <div className="font-medium text-sm">{trip.driver.name}</div>
            <div className="flex items-center text-xs text-gray-500">
              <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
              5.0 (nuevo)
            </div>
          </div>
        </div>
        <Badge className={getAvailabilityColor(trip.availableSeats)}>
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 mr-1" />
            {getAvailabilityText(trip.availableSeats, trip.seats)}
          </div>
        </Badge>
      </div>

      {/* Descripción si existe */}
      {trip.description && (
        <div className="text-xs text-gray-500 mb-4 line-clamp-2">
          {trip.description}
        </div>
      )}

      {/* Botón Ver Viaje */}
        <Button
          variant="outline" 
          className="w-full mb-2"
          onClick={() => navigate(`/trips/${trip.id}`)}
        >
          Ver viaje
        </Button>

      </Card>
    </>
  );
};

export default TripCard;