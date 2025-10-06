declare global {
  interface ImportMeta {
    env: {
      VITE_BACKEND_URL: any;
      VITE_GOOGLE_CLIENT_ID: string;
    };
  }
}

import { useState, useEffect } from 'react';
import { SkeletonCard } from './components/SkeletonCard';
import { Calendar, MapPin, CheckCircle, ExternalLink, CarFront, HandMetal, Mountain, HandHelping, Construction, Equal, ChevronsUp } from 'lucide-react';
import { RaceType } from './enums/race-type.enum';
import { Badge } from './components/ui/badge';

function App() {
  const [races, setRaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      setIsLoading(true);
      fetch(`${import.meta.env.VITE_BACKEND_URL}/races`, {})
        .then(res => res.json())
        .then(data => {
          setRaces(data);
          setIsLoading(false);
        })
        .catch(() => {
          setRaces([]);
          setIsLoading(false);
        });
    }, []
  );

  return (
    <div className="min-h-screen dark:bg-neutral-950 p-2 sm:p-6">
        <div className="max-w-7xl mx-auto mt-10">
          <h3 className="text-left">Próximas Carreras</h3>
          <div className="muted mt-2 mb-6 flex items-center gap-2">
            <span>{races.length} carrera{races.length === 1 ? '' : 's'} disponible{races.length === 1 ? '' : 's'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
              const dateStr = startDate.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
              const distances = (race.distances || []).map((d: any) => d.distance.shortDescription);
              const inscriptionOpen = race.inscriptionStatus === 'open' || race.inscriptionOpen;
              const description = race.description?.length > 90 ? race.description.slice(0, 87) + '...' : race.description;
              return (
                <div key={race.id} className="rounded-2xl bg-card shadow-md border flex flex-col overflow-hidden transition hover:shadow-lg">
                  <img src={imgSrc} alt={race.name} className="h-48 w-full object-cover object-center" />
                  <div className="flex-1 flex flex-col p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{race.name}</span>
                      {inscriptionOpen && (
                        <span className="ml-2 flex items-center gap-1 text-green-600 small">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Inscripciones abiertas
                        </span>
                      )}
                    </div>
                    <span className="muted">{description}</span>
                    <div className="flex flex-wrap gap-2 mt-3 mb-3">
                          {race.raceType == RaceType.STREET && (
                              <Badge variant="outline">
                                <ChevronsUp className="w-4 h-4" />{RaceType.STREET}
                              </Badge>
                          )}
                          {race.raceType == RaceType.TRAIL && (
                            <Badge variant="outline">
                                <ChevronsUp className="w-4 h-4" />{RaceType.TRAIL}
                              </Badge>
                          )}
                      {distances.map((dist: string, i: number) => (
                         <Badge variant="secondary">{dist}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 muted mb-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-black" />
                        {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 muted mb-2">
                      <MapPin className="w-4 h-4 text-black" />
                      {race.location}
                    </div>
                    <div className="flex pt-2 items-center justify-around">
                      {race.website && (
                        <div className="flex items-center gap-2">
                          <button className="text-primary bg-secondary small inline-flex items-center gap-1 px-4 py-3 rounded-3xl border">
                            <HandHelping className="w-5 h-5" />
                            Quiero ir
                          </button>
                          <button className="text-primary bg-secondary small inline-flex items-center gap-1 px-4 py-3 rounded-3xl border">
                            <CarFront className="w-5 h-5" />
                            Voy en auto
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
              </>
            )}
          </div>
        </div>
    </div>
  );
}

export default App
