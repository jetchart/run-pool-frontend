import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosAuth, { axiosPublic } from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Users, Plus } from 'lucide-react';
import { TripResponse } from '../types/trip.types';
import { toast } from 'sonner';
import { checkAuthWithToast } from '../utils/auth';
import TripCard from './TripCard';
import RaceHeader from './RaceHeader';

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
      const errorMessage = error.response?.data?.message?.message || 'Error al cargar los viajes';
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
          {race && <RaceHeader race={race} />}
      {/* Header con título y botón crear viaje */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
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
            <TripCard 
              key={trip.id} 
              trip={trip}
            />
          ))}
        </div>
      )}
    </div>
  );
}