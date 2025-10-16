import React, { useState, useEffect } from 'react';
import axiosAuth from '../lib/axios';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ArrowLeft, MapPin, Calendar, Clock, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { CreateTripDto } from '../types/trip.types';
import { ARGENTINE_PROVINCES } from '../constants/provinces';

const CreateTrip: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const race = location.state?.race;

  const [formData, setFormData] = useState<CreateTripDto>({
    driverId: 0, // Se asignará desde el token
    raceId: typeof race?.id === 'string' ? parseInt(race.id) : (race?.id || 0),
    departureDay: '',
    departureHour: '',
    departureCity: '',
    departureProvince: '',
    arrivalCity: '',
    arrivalProvince: '',
    description: '',
    seats: 5
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Si no hay race data, redirigir
    if (!race) {
      toast.error('No se pudo obtener la información de la carrera');
      navigate('/trips');
      return;
    }

    // Pre-rellenar raceId y datos de llegada desde la carrera
    setFormData(prev => ({
      ...prev,
      raceId: typeof race.id === 'string' ? parseInt(race.id) : race.id,
      // Autocompletar con la ubicación de la carrera
      arrivalCity: race.city || '',
      arrivalProvince: race.province || '' // Por ahora usamos la misma location, puede ser mejorado
    }));
  }, [race, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validaciones específicas
    if (name === 'seats') {
      const numValue = parseInt(value);
      if (numValue < 1 || numValue > 5) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'seats' ? parseInt(value) || 5 : value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.departureDay || !formData.departureHour || !formData.departureCity || !formData.departureProvince || !formData.arrivalCity || !formData.arrivalProvince) {
      toast.error('Por favor completa todos los campos obligatorios');
      return false;
    }

    if (formData.seats < 1 || formData.seats > 5) {
      toast.error('Los asientos disponibles deben estar entre 1 y 5');
      return false;
    }

    // Validar formato de fecha (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.departureDay)) {
      toast.error('Formato de fecha inválido');
      return false;
    }

    // Validar formato de hora (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.departureHour)) {
      toast.error('Formato de hora inválido (HH:MM)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const storedUser = localStorage.getItem('userCredential') ? JSON.parse(localStorage.getItem('userCredential')!) : null;
      if (!storedUser) {
        toast.error('No estás autenticado');
        navigate('/login');
        return;
      }

      const driverId = storedUser.userId;

      const tripData: CreateTripDto = {
        ...formData,
        driverId: driverId
      };

      // El token se agrega automáticamente por el interceptor
      const response = await axiosAuth.post('/trips', tripData);

      const result = response.data;
      toast.success('¡Viaje creado exitosamente!');
      
      // Redirigir de vuelta a la lista de viajes
      const raceIdFromState = location.state?.raceId || race?.id;
      navigate(`/races/${raceIdFromState}/trips`);
      
    } catch (error: any) {
      console.error('Error creando viaje:', error);
      const errorMessage = error.response?.data?.message || 'Error inesperado';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Crear Nuevo Viaje
          </h1>
          <p className="text-gray-600">
            {race?.name || 'Carrera'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Viaje</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha *
                </label>
                <input
                  type="date"
                  name="departureDay"
                  value={formData.departureDay}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Hora *
                </label>
                <input
                  type="time"
                  name="departureHour"
                  value={formData.departureHour}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Ciudad y Provincia de salida */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Ciudad de Salida *
                </label>
                <input
                  type="text"
                  name="departureCity"
                  value={formData.departureCity}
                  onChange={handleInputChange}
                  placeholder="Ej: Montevideo"
                  required
                  maxLength={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Provincia de Salida *
                </label>
                <select
                  name="departureProvince"
                  value={formData.departureProvince}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona una provincia</option>
                  {ARGENTINE_PROVINCES.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ciudad y Provincia de llegada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Ciudad de Llegada *
                </label>
                <input
                  type="text"
                  name="arrivalCity"
                  value={formData.arrivalCity}
                  onChange={handleInputChange}
                  placeholder="Ej: Ciudad de la carrera"
                  required
                  maxLength={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Provincia de Llegada *
                </label>
                <select
                  name="arrivalProvince"
                  value={formData.arrivalProvince}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona una provincia</option>
                  {ARGENTINE_PROVINCES.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Asientos */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Asientos Disponibles *
              </label>
              <select
                name="seats"
                value={formData.seats.toString()}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1 asiento</option>
                <option value="2">2 asientos</option>
                <option value="3">3 asientos</option>
                <option value="4">4 asientos</option>
                <option value="5">5 asientos</option>
              </select>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Información adicional sobre el viaje (punto de encuentro, referencias, etc.)"
                maxLength={500}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Creando...' : 'Crear Viaje'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTrip;