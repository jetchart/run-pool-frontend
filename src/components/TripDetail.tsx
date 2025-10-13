import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, MapPin, Clock, Star, Users, User } from 'lucide-react';
import { TripResponse, JoinTripDto } from '../types/trip.types';
import { toast } from 'sonner';

const TripDetail: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  // Función para cargar el detalle del viaje
  const loadTripDetail = async () => {
    if (!tripId) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/trips/${tripId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar el viaje');
      }

      const data = await response.json();
      setTrip(data);
    } catch (error) {
      console.error('Error cargando detalle del viaje:', error);
      toast.error(error instanceof Error ? error.message : 'Error al cargar el viaje');
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTripDetail();
  }, [tripId]);

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

  // Función para unirse al viaje
  const handleJoinTrip = async () => {
    if (!trip || isJoining) return;
    
    setIsJoining(true);
    try {
      const storedUser = localStorage.getItem('userCredential') ? JSON.parse(localStorage.getItem('userCredential')!) : null;
        if (!storedUser) {
            toast.error('No estás autenticado');
            navigate('/login');
            return;
        }

      const passengerId = storedUser.userId;

      // Verificar que el usuario no sea el conductor del viaje
      if (passengerId === trip.driver.id) {
        toast.error('No puedes unirte a tu propio viaje');
        return;
      }

      // Verificar que el usuario no esté ya en el viaje
      const isAlreadyPassenger = trip.passengers.some(p => p.passenger.id === passengerId);
      if (isAlreadyPassenger) {
        toast.error('Ya estás registrado en este viaje');
        return;
      }

      const joinTripData: JoinTripDto = {
        tripId: trip.id,
        passengerId: passengerId
      };

      const response = await fetch('http://localhost:3000/trips/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify(joinTripData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al unirse al viaje');
      }

      const result = await response.json();
      toast.success('¡Te has unido al viaje exitosamente!');
      
      // Recargar los datos del viaje para mostrar el estado actualizado
      await loadTripDetail();
      
    } catch (error) {
      console.error('Error al unirse al viaje:', error);
      toast.error(error instanceof Error ? error.message : 'Error al enviar la solicitud');
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Viaje no encontrado</h1>
        <p className="text-muted-foreground mb-8">El viaje que buscas no existe o ha sido eliminado.</p>
        <Button onClick={() => navigate(-1)}>Volver</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      </div>

      {/* Información del conductor */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-medium">
          {trip.driver.givenName?.[0]}{trip.driver.familyName?.[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{trip.driver.name}</h1>
          <div className="flex items-center text-gray-600">
            <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
            4.8 • 3 calificaciones
          </div>
          <button className="text-blue-600 text-sm hover:underline mt-1">
            Ver perfil del conductor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda - Detalles del viaje */}
        <div className="space-y-6">
          {/* Detalles del viaje */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Detalles del viaje</h2>
              
              {/* Gráfico de ruta */}
              <div className="h-32 bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-80 h-16" viewBox="0 0 320 80">
                  <path 
                    d="M20 60 Q80 20 160 45 Q240 65 300 35" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    fill="none"
                    className="text-gray-800"
                  />
                  <circle cx="20" cy="60" r="8" stroke="black" fill="white" strokeWidth="2" />
                  <circle cx="300" cy="35" r="8" stroke="black" fill="white" strokeWidth="2" />
                </svg>
              </div>

              {/* Origen */}
              <div className="flex items-start mb-4">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="text-blue-600 text-sm font-medium">Salida</div>
                  <div className="font-semibold">{trip.departureCity}, {trip.departureProvince}</div>
                  <div className="text-gray-600 text-sm flex items-center mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDateTime(trip.departureDay, trip.departureHour)}
                  </div>
                </div>
              </div>

              {/* Destino */}
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="text-blue-600 text-sm font-medium">Destino</div>
                  <div className="font-semibold">
                    {trip.arrivalCity || trip.race.location}, {trip.arrivalProvince || 'Chubut'}
                  </div>
                  <div className="text-gray-600 text-sm">
                    Duración aprox. 6h 45m
                  </div>
                </div>
              </div>

              {/* Descripción si existe */}
              {trip.description && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-2">Información adicional</h3>
                  <p className="text-gray-600 text-sm">{trip.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Lugares disponibles */}
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Lugares disponibles</h2>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  {trip.availableSeats} lugares disponibles
                </div>
              </div>

              {/* Diagrama del vehículo */}
              <div className="mb-8">
                <div className="relative mx-auto w-48">
                  {/* Outline del carro */}
                  <svg viewBox="0 0 200 120" className="w-full">
                    {/* Cuerpo del carro */}
                    <rect x="20" y="30" width="160" height="80" rx="15" fill="none" stroke="black" strokeWidth="2"/>
                    
                    {/* Conductor (siempre ocupado) */}
                    <circle cx="50" cy="50" r="15" fill="black" stroke="none"/>
                    <text x="50" y="55" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                      {trip.driver.givenName?.[0]}{trip.driver.familyName?.[0]}
                    </text>
                    <text x="50" y="25" textAnchor="middle" fontSize="8" fill="gray">Conductor</text>

                    {/* Asiento del copiloto */}
                    <circle cx="150" cy="50" r="15" fill={trip.availableSeats > 0 ? "white" : "lightgray"} stroke="black" strokeWidth="1"/>
                    {trip.availableSeats > 0 && <text x="150" y="55" textAnchor="middle" fontSize="20" fill="gray">+</text>}
                    <text x="150" y="25" textAnchor="middle" fontSize="8" fill="gray">Disponible</text>

                    {/* Asientos traseros */}
                    <circle cx="70" cy="90" r="15" fill={trip.availableSeats > 1 ? "white" : "lightgray"} stroke="black" strokeWidth="1"/>
                    {trip.availableSeats > 1 && <text x="70" y="95" textAnchor="middle" fontSize="20" fill="gray">+</text>}
                    <text x="70" y="135" textAnchor="middle" fontSize="8" fill="gray">Disponible</text>

                    <circle cx="130" cy="90" r="15" fill={trip.availableSeats > 2 ? "white" : "lightgray"} stroke="black" strokeWidth="1"/>
                    {trip.availableSeats > 2 && <text x="130" y="95" textAnchor="middle" fontSize="20" fill="gray">+</text>}
                    <text x="130" y="135" textAnchor="middle" fontSize="8" fill="gray">Disponible</text>
                  </svg>
                </div>
              </div>

              {/* Lista de pasajeros */}
              <div className="space-y-3 mb-6">
                {trip.passengers.map((passenger, index) => (
                  <div key={passenger.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                      {passenger.passenger.givenName?.[0]}{passenger.passenger.familyName?.[0]}
                    </div>
                    <div className="text-sm">{passenger.passenger.name}</div>
                  </div>
                ))}
              </div>

              {/* Botón para unirse */}
              <Button 
                onClick={handleJoinTrip}
                className="w-full"
                disabled={trip.availableSeats === 0 || isJoining}
              >
                {isJoining ? 'Uniéndose...' : 
                 trip.availableSeats === 0 ? 'Viaje completo' : 'Unirme al viaje'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;