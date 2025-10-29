import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface RaceHeaderProps {
  race: {
    name: string;
    imageUrl?: string;
    startDate?: string | Date;
    location?: string;
  };
}

const formatDate = (date?: string | Date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-AR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC'
  });
};

export const RaceHeader: React.FC<RaceHeaderProps> = ({ race }) => {
  return (
          <Card className="mb-6">
            <CardContent className="py-6">
              {/* Mobile: imagen y título en fila, fecha y location debajo */}
              <div className="flex flex-row items-center gap-4 sm:hidden">
                {race.imageUrl && (
                  <img
                    src={race.imageUrl}
                    alt={race.name}
                    className="w-20 h-20 object-cover rounded-xl shadow"
                  />
                )}
                <h1 className="text-2xl font-bold text-gray-900">{race.name}</h1>
              </div>
              <div className="block sm:hidden w-full mt-4">
                {race.startDate && (
                  <div className="flex items-center text-gray-600 mb-1 text-sm w-full">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(race.startDate)}
                  </div>
                )}
                {race.location && (
                  <div className="flex items-center text-gray-600 text-sm w-full">
                    <MapPin className="w-4 h-4 mr-1" />
                    {race.location}
                  </div>
                )}
              </div>
              {/* Desktop: imagen, título, fecha y location en fila */}
              <div className="hidden sm:flex flex-row items-center gap-6">
                {race.imageUrl && (
                  <img
                    src={race.imageUrl}
                    alt={race.name}
                    className="w-24 h-24 object-cover rounded-xl shadow"
                  />
                )}
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{race.name}</h1>
                  {race.startDate && (
                    <div className="flex items-center text-gray-600 mb-1 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(race.startDate)}
                    </div>
                  )}
                  {race.location && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {race.location}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
  );
};

export default RaceHeader;
