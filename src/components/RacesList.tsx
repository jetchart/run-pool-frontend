import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosPublic } from '../lib/axios';
import { SkeletonCard } from './SkeletonCard';
import { RaceDialog } from './RaceDialog';
import { Calendar, MapPin, CarFront, Mountain, HandHelping, ChevronsUp, Edit, Trash, ExternalLink } from 'lucide-react';
import { RaceType, RACE_TYPE_INFO, DISTANCE_INFO } from '../types/userProfile.types';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { getStoredUser } from '@/utils/auth';
import { GAAction } from '@/constants/ga.enums';
import { trackRaceAction } from '@/hooks/useGoogleAnalytics';
import ExpandableText from './ExpandableText';

export function RacesList() {
  const [races, setRaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userCredential, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axiosPublic.get('/races/past-or-today')
      .then(response => {
        setRaces(response.data as any[]);
        setIsLoading(false);
      })
      .catch(() => {
        setRaces([]);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-left">Próximas Carreras</h3>
        {userCredential?.administrator && (
          <Button
            variant="default"
            className="flex items-center"
            onClick={() => navigate('/races/create')}
          >
            Crear Carrera
          </Button>
        )}
      </div>
      <div className="muted mt-2 mb-6 flex items-center gap-2">
        <span>{races.length} carrera{races.length === 1 ? '' : 's'} disponible{races.length === 1 ? '' : 's'}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          <>
            {races.length === 0 && (
              <div className="col-span-full text-center muted">No hay carreras disponibles.</div>
            )}
            {races.map((race: any) => {
              const imgSrc = race.imageUrl || '';
              const startDate = new Date(race.startDate);
              const dateStr = startDate.toLocaleDateString('es-AR', { 
                weekday: 'long', 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' ,
                timeZone: 'UTC'
              });
              const distances = (race.distances || []).map((d: any) => {
                return d.distance + 'K';
              });
              return (
                <Card key={race.id} className="rounded-2xl flex flex-col overflow-hidden transition hover:shadow-lg">
                  <img src={imgSrc} alt={race.name} className="h-48 w-full object-cover object-center" />
                  <CardContent className="flex-1 flex flex-col p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-semibold">{race.name}</span>
                      {race.trips.length > 0 && (
                          <Badge
                            className="ml-auto bg-orange-100 text-orange-700 border-orange-300 cursor-pointer hover:bg-orange-200 transition-colors"
                            onClick={() => navigate(`/races/${race.id}/trips`)}
                          >
                            {race.trips.length} {race.trips.length === 1 ? 'viaje' : 'viajes'}
                          </Badge>
                      )}
                      {userCredential?.administrator && (
                          <div className="flex gap-2 ml-auto">
                            <Badge
                              variant="outline"
                              className="flex cursor-pointer items-center gap-1 text-xs bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 hover:text-blue-900 transition-colors"
                              onClick={() => race.id && navigate(`/races/${race.id}/update`)}
                            >
                              <Edit className="w-3 h-3 text-blue-500" />
                              Editar
                            </Badge>
                            <Badge
                              variant="destructive"
                              className="flex cursor-pointer items-center gap-1 text-xs bg-red-100 text-red-700 border-red-300 hover:bg-red-200 hover:text-red-900 transition-colors"
                              onClick={async () => {
                                if (window.confirm('¿Seguro que querés eliminar esta carrera?')) {
                                  try {
                                    await axiosPublic.delete(`/races/${race.id}`);
                                    setRaces(prev => prev.filter(r => r.id !== race.id));
                                  } catch {
                                    alert('No se pudo eliminar la carrera.');
                                  }
                                }
                              }}
                            >
                              <Trash className="w-3 h-3 text-red-500" />
                              Eliminar
                            </Badge>
                          </div>
                      )}
                    </div>
                    <span className="text-sm font-normal"><ExpandableText text={race.description} maxLength={100} /></span>
                    <div className="flex flex-wrap gap-2 mt-3 mb-3">
                      {race.raceType == RaceType.STREET && (
                        <Badge variant="outline">
                          <ChevronsUp className="w-4 h-4" />
                          {RACE_TYPE_INFO[RaceType.STREET].description}
                        </Badge>
                      )}
                      {race.raceType == RaceType.TRAIL && (
                        <Badge variant="outline">
                          <Mountain className="w-4 h-4" />
                          {RACE_TYPE_INFO[RaceType.TRAIL].description}
                        </Badge>
                      )}
                      {distances.map((dist: string, i: number) => (
                        <Badge key={i} variant="secondary">{dist}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <Calendar className="w-4 h-4 text-black" />
                      <span className="text-xs text-muted-foreground">
                        {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="w-4 h-4 text-black" />
                      <span className="text-xs text-muted-foreground">
                        {race.location}
                      </span>
                    </div>
                    {/* Enlace a página del evento */}
                    {race.website && (
                      <div className="flex items-center gap-1 mb-2 cursor-pointer group"
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
                        <ExternalLink className="w-4 h-4 text-black group-hover:text-blue-600 transition-colors" />
                        <span className="text-xs text-blue-700 group-hover:underline">Página del evento</span>
                      </div>
                    )}
                    {/* Ver viajes disponibles */}
                      <div className="mt-4">
                          <Button
                            variant="default" 
                            className="w-full cursor-pointer" 
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/races/${race.id}/trips`);
                            }}
                          >
                            Ver viajes disponibles
                          </Button>
                      </div>
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}