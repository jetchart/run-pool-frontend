import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import axiosAuth from '../lib/axios';

interface UserAverageRatingProps {
  userId: number;
  className?: string;
}

interface UserCredentialDto {
  id: number;
  name: string;
  pictureUrl?: string;
}

interface UserRatingDto {
  user: UserCredentialDto;
  average: number;
  ratingsCount: number;
}

export const UserAverageRating: React.FC<UserAverageRatingProps> = ({ userId, className }) => {
  const [data, setData] = useState<UserRatingDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosAuth.get<UserRatingDto>(`/users/${userId}/ratings/average`)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .then(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className={className}>Cargando...</div>;
  if (!data) return <div className={className}>No disponible</div>;

  return (
    <div className={`flex items-center gap-4 ${className || ''}`}>
      <div className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center text-3xl font-bold text-white">
        {data.user.pictureUrl ? (
          <img src={data.user.pictureUrl} alt={data.user.name} className="w-full h-full object-cover rounded-full" />
        ) : (
          <span>{data.user.name.split(' ').map(n => n[0]).join('').slice(0,2)}</span>
        )}
      </div>
      <div className="flex flex-col">
        <div className="font-bold text-lg text-black">{data.user.name}</div>
        <div className="flex items-center text-base text-gray-800 gap-2">
          <Star className="w-4 h-4 text-yellow-400" fill="#facc15" />
          <span className="text-gray-800 font-semibold">{data.average.toFixed(1)}</span>
          <span>&bull;</span>
          <span className="text-sm text-gray-500">{data.ratingsCount === 1 ? '1 calificación' : `${data.ratingsCount} calificaciones`}</span>
        </div>
      </div>
    </div>
  );
};
