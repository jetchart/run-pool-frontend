import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosAuth from '../lib/axios';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Users, ArrowRight } from 'lucide-react';
import { TripResponse } from '../types/trip.types';
import { toast } from 'sonner';
import { requireAuth, getStoredUser } from '../utils/auth';
import { TripProfileCard } from './TripProfileCard';
import { TripPassengerStatus } from '@/enums/trip-passenger-status.enum';

export function MyTripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'past' | 'pending'>('upcoming');

  useEffect(() => {
    loadMyTrips();
  }, []);

  const loadMyTrips = async () => {
    if (!requireAuth(navigate)) {
      return;
    }

    setIsLoading(true);
    try {
      const storedUser = getStoredUser();
      if (!storedUser) return;

      // Obtener todos los viajes donde el usuario es pasajero
      const response = await axiosAuth.get(`/trips/passenger/${storedUser.userId}`);
      setTrips(response.data as TripResponse[]);
    } catch (error: any) {
      console.error('Error cargando mis viajes:', error);
      const errorMessage = error.response?.data?.message?.message || 'Error al cargar tus viajes';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTrip = (tripId: number) => {
    navigate(`/trips/${tripId}`);
  };

  const getUserRole = (trip: TripResponse): 'driver' | 'passenger' => {
    const storedUser = getStoredUser();
    if (!storedUser) return 'passenger';
    
    return trip.driver.id === storedUser.userId ? 'driver' : 'passenger';
  };

  // Filtrado de viajes según tab
  const now = new Date();
  now.setHours(0,0,0,0);
  const upcomingTrips = trips.filter(trip => new Date(trip.departureDay) >= now && trip.passengers.some(p => p.status === TripPassengerStatus.CONFIRMED));
  const pastTrips = trips.filter(trip => new Date(trip.departureDay) < now);
  const storedUser = getStoredUser();
  const pendingTrips = trips.filter(trip =>
    trip.passengers.some(p =>
      p.passenger.id === storedUser?.userId && p.status === TripPassengerStatus.PENDING
    )
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Mis Viajes
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${tab === 'upcoming' ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 text-gray-500'}`}
          onClick={() => setTab('upcoming')}
        >
          Próximos viajes ({upcomingTrips.length})
        </button>
        <button
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${tab === 'pending' ? 'bg-gray-200 text-yellow-900' : 'bg-gray-100 text-gray-500'}`}
          onClick={() => setTab('pending')}
        >
          Viajes pendientes de confirmación ({pendingTrips.length})
        </button>
        <button
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${tab === 'past' ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 text-gray-500'}`}
          onClick={() => setTab('past')}
        >
          Viajes pasados ({pastTrips.length})
        </button>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48"></div>
            </div>
          ))}
        </div>
      )}

      {/* Sin viajes */}
      {!isLoading && ((tab === 'upcoming' && upcomingTrips.length === 0) || (tab === 'past' && pastTrips.length === 0) || (tab === 'pending' && pendingTrips.length === 0)) && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes viajes {tab === 'upcoming' ? 'próximos' : tab === 'past' ? 'pasados' : 'pendientes de confirmación'}
          </h3>
          <p className="text-gray-500 mb-6">
            {tab === 'upcoming'
              ? 'Aún no tienes viajes próximos. Explora las carreras disponibles para encontrar viajes.'
              : tab === 'past'
              ? 'No tienes viajes pasados registrados.'
              : 'No tienes viajes pendientes de confirmación.'}
          </p>
          <Button onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Ver Carreras
          </Button>
        </div>
      )}

      {/* Lista de viajes */}
      {!isLoading && ((tab === 'upcoming' && upcomingTrips.length > 0) || (tab === 'past' && pastTrips.length > 0) || (tab === 'pending' && pendingTrips.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(tab === 'upcoming' ? upcomingTrips : tab === 'past' ? pastTrips : pendingTrips).map((trip) => (
            <TripProfileCard
              key={trip.id}
              trip={trip}
              userRole={getUserRole(trip)}
              onDetails={() => handleViewTrip(trip.id)}
              onRated={loadMyTrips}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTripsPage;