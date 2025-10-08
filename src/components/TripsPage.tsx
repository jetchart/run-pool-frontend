import { useLocation } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { MapPin, Calendar, Star, Users } from 'lucide-react';

interface Race {
  id: string;
  name: string;
  location: string;
  startDate: string;
  imageUrl?: string;
  description?: string;
  website?: string;
  distances?: any[];
  raceType?: any;
}

interface Trip {
  id: string;
  driver: {
    name: string;
    initials: string;
    rating: number;
    reviews: number;
  };
  route: {
    from: string;
    fromSubtitle: string;
    to: string;
    toSubtitle: string;
  };
  datetime: string;
  availableSeats: number;
}

export function TripsPage() {
  const location = useLocation();
  const race = location.state?.race as Race;

  // Datos hardcodeados basados en la imagen
  const trips: Trip[] = [
    {
      id: '1',
      driver: {
        name: 'Tomás Zona Norte',
        initials: 'TZ',
        rating: 4.8,
        reviews: 3
      },
      route: {
        from: 'Palermo',
        fromSubtitle: 'CABA',
        to: 'Comodoro Rivadavia',
        toSubtitle: 'Comodoro Rivadavia, Chubut'
      },
      datetime: 'DOM. 10 noviembre • 06:00 hs',
      availableSeats: 4
    },
    {
      id: '2',
      driver: {
        name: 'Ayelen Serifo',
        initials: 'AS',
        rating: 4.9,
        reviews: 11
      },
      route: {
        from: 'Rosario Centro',
        fromSubtitle: 'Otra provincia',
        to: 'Comodoro Rivadavia',
        toSubtitle: 'Comodoro Rivadavia, Chubut'
      },
      datetime: 'DOM. 10 noviembre • 04:00 hs',
      availableSeats: 2
    },
    {
      id: '3',
      driver: {
        name: 'Karina Méndez Delfino',
        initials: 'KM',
        rating: 5.0,
        reviews: 35
      },
      route: {
        from: 'Belgrano',
        fromSubtitle: 'CABA',
        to: 'Comodoro Rivadavia',
        toSubtitle: 'Comodoro Rivadavia, Chubut'
      },
      datetime: 'DOM. 10 noviembre • 06:30 hs',
      availableSeats: 3
    }
  ];

  if (!race) {
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
      <div className="mb-6">
        <div className="muted mt-2">
          {trips.length} viajes disponibles
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.map((trip) => (
          <Card key={trip.id} className="p-4">
            {/* Imagen/gráfico de ruta */}
            <div className="h-24 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <svg className="w-20 h-12" viewBox="0 0 120 60">
                <path 
                  d="M10 40 Q60 10 110 40" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none"
                  className="text-gray-600"
                />
                <circle cx="10" cy="40" r="3" fill="currentColor" className="text-gray-600" />
                <circle cx="110" cy="40" r="3" fill="currentColor" className="text-gray-600" />
              </svg>
            </div>

            {/* Origen */}
            <div className="flex items-start mb-3">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
              <div>
                <div className="font-medium text-sm">{trip.route.from}</div>
                <div className="text-xs text-gray-500">{trip.route.fromSubtitle}</div>
              </div>
            </div>

            {/* Destino */}
            <div className="flex items-start mb-3">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
              <div>
                <div className="font-medium text-sm">{trip.route.to}</div>
                <div className="text-xs text-gray-500">{trip.route.toSubtitle}</div>
              </div>
            </div>

            {/* Fecha y hora */}
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              {trip.datetime}
            </div>

            {/* Driver info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium mr-3">
                  {trip.driver.initials}
                </div>
                <div>
                  <div className="font-medium text-sm">{trip.driver.name}</div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                    {trip.driver.rating} ({trip.driver.reviews})
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                {trip.availableSeats}
              </div>
            </div>

            {/* Botón */}
            <Button 
              variant="outline" 
              className="w-full"
            >
              Ver viaje
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}