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
          <h2 className="text-2xl font-bold mb-1 text-neutral-900 dark:text-neutral-100 text-left">Próximas Carreras</h2>
          <div className="text-neutral-500 dark:text-neutral-400 mb-6 text-base flex items-center gap-2">
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
                  <div className="col-span-full text-center text-gray-500">No hay carreras disponibles.</div>
                )}
                {races.map((race: any) => {
              const imgSrc = race.imageUrl || '';
              const startDate = new Date(race.startDate);
              const dateStr = startDate.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
              const distances = (race.distances || []).map((d: any) => d.distance.shortDescription);
              const inscriptionOpen = race.inscriptionStatus === 'open' || race.inscriptionOpen;
              const description = race.description?.length > 90 ? race.description.slice(0, 87) + '...' : race.description;
              return (
                <div key={race.id} className="rounded-2xl bg-white dark:bg-neutral-950 shadow-md border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden transition hover:shadow-lg">
                  {imgSrc && (
                    <img src={imgSrc} alt={race.name} className="h-48 w-full object-cover object-center" />
                  )}
                  <div className="flex-1 flex flex-col p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-base text-neutral-900 dark:text-neutral-100">{race.name}</span>
                      {inscriptionOpen && (
                        <span className="ml-2 flex items-center gap-1 text-green-600 text-xs font-medium">
                          <svg width="8" height="8" className="inline-block" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" /></svg>
                          Inscripciones abiertas
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-300 mb-2 text-left">{description}</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                          Calle
                        </span>
                      {distances.map((dist: string, i: number) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700">{dist}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      <span className="flex items-center gap-1">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                        {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                      {race.city}{race.country ? `, ${race.country}` : ''}
                    </div>
                    <div className="mt-auto pt-2">
                      {race.website && (
                        <a href={race.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline text-sm">Ver más</a>
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
