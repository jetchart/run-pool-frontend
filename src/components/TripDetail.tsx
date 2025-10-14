import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosAuth from '../lib/axios';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ArrowLeft, MapPin, Clock, Star, Users, User, Car, Caravan, Mail, MessageCircle, CarFront } from 'lucide-react';
import { TripResponse, JoinTripDto } from '../types/trip.types';
import { UserProfileView } from './UserProfileView';
import { toast } from 'sonner';

const TripDetail: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Función para cargar el detalle del viaje
  const loadTripDetail = async () => {
    if (!tripId) return;
    
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('userCredential') ? JSON.parse(localStorage.getItem('userCredential')!) : null;
            if (!storedUser) {
              toast.error('No estás autenticado');
              navigate('/login');
              return;
            }
      const response = await axiosAuth.get(`/trips/${tripId}`);

      setTrip(response.data as TripResponse);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cargar el viaje';
      console.error('Error cargando detalle del viaje:', error);
      toast.error(errorMessage);
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTripDetail();
  }, [tripId]);

  // Función para abrir el modal de perfil
  const handleOpenProfile = (userId: number) => {
    setSelectedUserId(userId);
    setIsProfileModalOpen(true);
  };

  // Función para cerrar el modal de perfil
  const handleCloseProfile = () => {
    setIsProfileModalOpen(false);
    setSelectedUserId(null);
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

  // Función para abandonar el viaje
  const handleLeaveTrip = async () => {
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
        toast.error('El conductor no puede abandonar su propio viaje');
        return;
      }

      // Confirmar antes de abandonar
      if (!window.confirm('¿Estás seguro de que quieres abandonar este viaje?')) {
        return;
      }

      const response = await axiosAuth.delete(`/trips/${trip.id}/passengers/${passengerId}`);

      toast.success('Has abandonado el viaje exitosamente');
      
      // Recargar los datos del viaje para mostrar el estado actualizado
      await loadTripDetail();
      
    } catch (error: any) {
      console.error('Error al abandonar el viaje:', error);
      const errorMessage = error.response?.data?.message || 'Error al abandonar el viaje';
      toast.error(errorMessage);
    } finally {
      setIsJoining(false);
    }
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

      const response = await axiosAuth.post('/trips/join', joinTripData);

      const result = response.data;
      toast.success('¡Te has unido al viaje exitosamente!');
      
      // Recargar los datos del viaje para mostrar el estado actualizado
      await loadTripDetail();
      
    } catch (error: any) {
      console.error('Error al unirse al viaje:', error);
      const errorMessage = error.response?.data?.message || 'Error al enviar la solicitud';
      toast.error(errorMessage);
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
              <h2 className="text-lg font-semibold">Lugares disponibles</h2>

              {/* Ícono del vehículo */}
              <div className="mb-8 text-center">
                <div className="flex flex-col items-center">
                  <Car className="w-24 h-24 text-gray-600 mb-4" />
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">{trip.seats}</span> asientos totales
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                      <span className="text-xs text-gray-500">Ocupado/s ({trip.seats - trip.availableSeats})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-500">Disponible/s ({trip.availableSeats})</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr/>

              {/* Lista de pasajeros */}
              <div className="space-y-3 mt-4">
                {trip.passengers.map((passenger, index) => (
                  <div 
                    key={passenger.id} 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                    onClick={() => handleOpenProfile(passenger.passenger.id)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                      {passenger.passenger.givenName?.[0]}{passenger.passenger.familyName?.[0]}
                    </div>
                    <div className="flex-1 text-sm">
                      {passenger.passenger.name}
                    </div>
                    {passenger.passenger.id === trip.driver.id && <CarFront className="w-4 h-4 text-gray-400" />}
                    {passenger.passenger.id !== trip.driver.id && <User className="w-4 h-4 text-gray-400" />}
                  </div>
                ))}
              </div>

              {/* Botón para unirse o abandonar */}
              {(() => {
                const storedUser = localStorage.getItem('userCredential') ? JSON.parse(localStorage.getItem('userCredential')!) : null;
                const currentUserId = storedUser?.userId;
                
                // Verificar si el usuario actual es el conductor
                const isDriver = currentUserId === trip.driver.id;
                
                // Verificar si el usuario actual está en el viaje como pasajero
                const isPassenger = trip.passengers.some(p => p.passenger.id === currentUserId);
                
                if (!isDriver && isPassenger) {
                  return (
                    <Button 
                      onClick={handleLeaveTrip}
                      variant="destructive"
                      className="w-full mt-4"
                      disabled={isJoining}
                    >
                      {isJoining ? 'Procesando...' : 'Abandonar viaje'}
                    </Button>
                  );
                }
                
                // Usuario no está en el viaje, mostrar botón para unirse
                if (!isPassenger) {
                return (
                  <Button 
                    onClick={handleJoinTrip}
                    className="w-full mt-4"
                    disabled={trip.availableSeats === 0 || isJoining}
                  >
                    {isJoining ? 'Uniéndose...' : 
                     trip.availableSeats === 0 ? 'Viaje completo' : 'Unirme al viaje'}
                  </Button>
                );
              }
              })()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de perfil de usuario */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Perfil del Usuario</DialogTitle>
          </DialogHeader>
          {selectedUserId && (
            <div className="mt-4">
              <UserProfileView userId={selectedUserId.toString()} isModal={true} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TripDetail;