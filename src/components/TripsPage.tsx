import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosAuth, { axiosPublic } from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { MapPin, Calendar, Star, Users, Plus } from 'lucide-react';
import { TripResponse } from '../types/trip.types';
import { toast } from 'sonner';

interface Race {
  id: number | string;
  name: string;
  location: string;
  startDate: string;
  imageUrl?: string;
  description?: string;
  website?: string;
  distances?: any[];
  raceType?: any;
}

export function TripsPage() {
  const { userCredential } = useAuth();
  const { raceId } = useParams<{ raceId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const race = location.state?.race as Race;
  
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para cargar viajes desde el backend
  const loadTrips = async () => {
    if (!raceId) return;
    
    setIsLoading(true);
    try {
      const response = await axiosAuth.get(`/trips?raceId=${raceId}`);
      setTrips(response.data as TripResponse[]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar los viajes';
      console.error('Error cargando viajes:', error);
      toast.error(errorMessage);
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [raceId]);

  // Función para obtener el color según disponibilidad de asientos
  const getAvailabilityColor = (availableSeats: number) => {
    if (availableSeats >= 3) return 'bg-green-600 text-white';
    if (availableSeats > 0) return 'bg-yellow-300 text-white';
    return 'bg-red-600 text-white';
  };

  // Función para formatear la fecha
  const formatDateTime = (departureDay: Date, departureHour: string) => {
    const date = new Date(departureDay);
    const dayNames = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                       'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    
    return `${dayName}. ${day} ${month} • ${departureHour} hs`;
  };

  // Función para manejar la creación del viaje con validación
  const handleCreateTrip = () => {
    // Verificar autenticación
    if (!userCredential) {
      toast.error('Debes iniciar sesión para crear un viaje');
      navigate('/login');
      return;
    }

    // Verificar que tenga al menos un vehículo
    if (!userCredential.userProfile || !userCredential.userProfile.cars || userCredential.userProfile.cars.length === 0) {
      const currentPath = window.location.pathname + window.location.search;
      toast.error('Necesitas tener al menos un vehículo registrado para crear un viaje', {
        action: {
          label: 'Ir al perfil',
          onClick: () => navigate(`/profile?backTo=${encodeURIComponent(currentPath)}`)
        }
      });
      return;
    }

    // Si tiene vehículos, proceder a crear el viaje
    navigate('/trips/create', { state: { race, raceId } });
  };

  if (!raceId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Carrera no encontrada</h1>
        <p className="text-muted-foreground mb-8">No se pudo cargar la información de la carrera.</p>
        <a href="/" className="text-primary hover:underline">Volver al inicio</a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header con título y botón crear viaje */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {race?.name || 'Viajes disponibles'}
          </h1>
          <div className="text-gray-600">
            {isLoading ? 'Cargando...' : `${trips.length} viajes disponibles`}
          </div>
        </div>
        <Button 
          onClick={handleCreateTrip}
          className="mt-4 sm:mt-0 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Crear Viaje
        </Button>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Lista de viajes */}
      {!isLoading && trips.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Users className="w-12 h-12 mx-auto mb-2" />
            No hay viajes disponibles para esta carrera
          </div>
          <p className="text-gray-400 mb-6">Sé el primero en crear un viaje</p>
        </div>
      )}

      {!isLoading && trips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <Card key={trip.id} className="p-4">
              {/* Imagen/gráfico de ruta */}
              <div className="h-24 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-24 h-12" viewBox="0 0 140 60">
                  <path 
                    d="M10 45 Q40 15 70 35 Q100 50 130 25" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    fill="none"
                    className="text-gray-800"
                  />
                  <circle cx="10" cy="45" r="6" stroke="black" fill="white" className="text-gray-800" />
                  <circle cx="130" cy="25" r="6" stroke="black" fill="white" className="text-gray-800" />
                </svg>
              </div>

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
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium mr-3">
                    {trip.driver.givenName?.[0]}{trip.driver.familyName?.[0]}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{trip.driver.name}</div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                      5.0 (nuevo)
                    </div>
                  </div>
                </div>
                 <Badge className={`${getAvailabilityColor(trip.availableSeats)}`}>
                <div className={`flex items-center text-sm `}>
                  <Users className="w-4 h-4 mr-1" />
                  {trip.seats - trip.availableSeats} / {trip.seats}
                </div>
                </Badge>
              </div>

              {/* Descripción si existe */}
              {trip.description && (
                <div className="text-xs text-gray-500 mb-4 line-clamp-2">
                  {trip.description}
                </div>
              )}

              {/* Botón */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                Ver viaje
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}