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
import { formatDateTime } from '../constants/dates';
import { checkAuthWithToast } from '../utils/auth';
import { getAvailabilityColor, getAvailabilityText } from '../utils/styles';

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
  const raceFromState = location.state?.race as Race;
  
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [race, setRace] = useState<Race | null>(raceFromState || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRace, setIsLoadingRace] = useState(!raceFromState);

  // Función para cargar información de la carrera desde el backend
  const loadRace = async () => {
    if (!raceId || race) return; // Si ya tenemos la carrera, no cargarla
    
    setIsLoadingRace(true);
    try {
      const response = await axiosAuth.get(`/races/${raceId}`);
      setRace(response.data as Race);
    } catch (error: any) {
      console.error('Error cargando información de la carrera:', error);
      toast.error('Error al cargar la información de la carrera');
    } finally {
      setIsLoadingRace(false);
    }
  };

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
    loadRace();
    loadTrips();
  }, [raceId]);

  // Función para manejar la creación del viaje con validación
  const handleCreateTrip = () => {
    // Verificar autenticación
    if (!checkAuthWithToast(navigate, 'Debes iniciar sesión para crear un viaje')) {
      return;
    }

    // Verificar que tenga al menos un vehículo
    if (!userCredential || !userCredential.userProfile || !userCredential.userProfile.cars || userCredential.userProfile.cars.length === 0) {
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
            {(isLoading || isLoadingRace) ? 'Cargando...' : `${trips.length} viajes disponibles`}
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
      {(isLoading || isLoadingRace) && (
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
      {!isLoading && !isLoadingRace && trips.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Users className="w-12 h-12 mx-auto mb-2" />
            No hay viajes disponibles para esta carrera
          </div>
          <p className="text-gray-400 mb-6">Sé el primero en crear un viaje</p>
        </div>
      )}

      {!isLoading && !isLoadingRace && trips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <Card key={trip.id} className="p-4">
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