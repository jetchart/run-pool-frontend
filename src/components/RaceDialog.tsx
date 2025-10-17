import { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosAuth from '../lib/axios';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, MapPin, ExternalLink, Copy } from 'lucide-react';
import { RaceType, RACE_TYPE_INFO, DISTANCE_INFO } from '../types/userProfile.types';
import { useAuth } from '../contexts/AuthContext';
import { trackRaceAction } from '../hooks/useGoogleAnalytics';
import { GAAction } from '../constants/ga.enums';
import { getStoredUser } from '../utils/auth';

declare global {
  interface ImportMeta {
    env: {
      VITE_BACKEND_URL: any;
      VITE_GOOGLE_CLIENT_ID: string;
      VITE_GOOGLE_GA4_MEASUREMENT_ID: string;
    };
  }
}

interface RaceDialogProps {
  children: ReactNode;
  race: any;
  type: 'passenger' | 'driver';
}

export function RaceDialog({ children, race, type }: RaceDialogProps) {
  useEffect(() => {
    const storedUser = getStoredUser();
    const userId = storedUser?.userId?.toString();
    trackRaceAction(GAAction.RACE_VIEW_DETAIL, race.id?.toString(), userId, {
      race_name: race.name,
      user_type: type,
      race_location: race.location
    });
  }, []);
  const navigate = useNavigate();
  const { userCredential } = useAuth();
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
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

  const handleViewTrips = async () => {
    setIsCheckingProfile(true);
    
    const storedUser = getStoredUser();
    const userId = storedUser?.userId?.toString();
    
    trackRaceAction(GAAction.RACE_VIEW_TRIPS, race.id?.toString(), userId, {
      race_name: race.name,
      user_type: type,
      race_location: race.location
    });
    
    try {
      navigate(`/races/${race.id}/trips`, { state: { race } });
      
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // Usuario no tiene perfil, redirigir a crear perfil
        navigate('/profile');
        return;
      }
      console.error('Error checking user profile:', error);
      // En caso de error, asumir que no tiene perfil y redirigir
      navigate('/profile');
    } finally {
      setIsCheckingProfile(false);
    }
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
            onClick={() => {
              const storedUser = getStoredUser();
              const userId = storedUser?.userId?.toString();
              
              trackRaceAction(GAAction.RACE_WEBSITE_CLICK, race.id?.toString(), userId, {
                race_name: race.name,
                website_url: race.website
              });
              window.open(race.website, '_blank');
            }}
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
          className="w-full bg-gray-900 hover:bg-gray-800 text-white disabled:bg-gray-400"
          onClick={handleViewTrips}
          disabled={isCheckingProfile}
        >
          {isCheckingProfile ? 'Verificando...' : 'Ver viajes disponibles'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}