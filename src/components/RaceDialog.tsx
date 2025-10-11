import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, MapPin, ExternalLink, Copy } from 'lucide-react';
import { RaceType, RACE_TYPE_INFO, DISTANCE_INFO } from '../types/userProfile.types';

interface RaceDialogProps {
  children: ReactNode;
  race: any;
  type: 'passenger' | 'driver';
}

export function RaceDialog({ children, race, type }: RaceDialogProps) {
  const navigate = useNavigate();
  const startDate = new Date(race.startDate);
  const dateStr = startDate.toLocaleDateString('es-AR', { 
    weekday: 'long', 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
  const distances = (race.distances || []).map((d: any) => {
    // Si distance es un enum, usar directamente DISTANCE_INFO
    if (typeof d.distance === 'number') {
      return DISTANCE_INFO[d.distance as keyof typeof DISTANCE_INFO]?.shortDescription || d.distance;
    }
    // Retrocompatibilidad con el formato anterior
    return d.distance?.shortDescription || d.distance;
  });

  const getTitle = () => {
    if (type === 'passenger') {
      return `¿Quieres ir a esta carrera?`;
    }
    return `¿Ofreces viaje en auto?`;
  };

  const handleViewTrips = () => {
    navigate('/trips', { state: { race } });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg" showCloseButton={false}>
        {/* Imagen de la carrera */}
        {race.imageUrl && (
          <div className="h-48 -mt-6 -mx-6 rounded-t-lg overflow-hidden">
            <img 
              src={race.imageUrl} 
              alt={race.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <DialogHeader className="text-left space-y-2">
          <span className="text-2xl font-bold">{race.name}</span>
        </DialogHeader>

        {/* Badges de distancias */}
        <div className="flex flex-wrap gap-2 mb-2">
          {race.raceType === RaceType.STREET && (
            <Badge variant="default" className="bg-gray-800 text-white text-xs">
              {RACE_TYPE_INFO[RaceType.STREET].description}
            </Badge>
          )}
          {race.raceType === RaceType.TRAIL && (
            <Badge variant="default" className="bg-gray-800 text-white text-xs">
              {RACE_TYPE_INFO[RaceType.TRAIL].description}
            </Badge>
          )}
          {distances.map((dist: string, i: number) => (
            <Badge key={i} variant="outline" className="border-gray-300 text-xs">
              {dist}
            </Badge>
          ))}
        </div>

        {/* Fecha */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
          </span>
        </div>

        {/* Ubicación */}
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{race.location}</span>
        </div>

        {/* Enlace a página del evento */}
        {race.website && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => window.open(race.website, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Página del evento
          </Button>
        )}

        {/* Acerca del evento */}
        <div className="mb-2">
          <h3 className="font-semibold mb-2">Acerca del evento</h3>
          <span className="text-sm text-muted-foreground leading-relaxed">
            {race.description || 'El ' + race.name + ' combina el desafío del running con la belleza de la región. Corriendo podrás disfrutar de un paisaje único mientras te exigís al máximo.'}
          </span>
        </div>

        {/* Botón principal */}
        <Button 
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          onClick={handleViewTrips}
        >
          Ver viajes disponibles
        </Button>
      </DialogContent>
    </Dialog>
  );
}